"""Print a private, local summary of a Dziennik interwałów JSON backup."""

import argparse
from collections import Counter
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
from statistics import median
import sys


HOUR_MS = 3_600_000
LONG_INTERVAL_MS = 8 * HOUR_MS
ACTIONS = {
    "stop": "stop", "edit": "edycja", "delete": "usunięcie",
    "copy": "kopia", "restore": "przywrócenie", "update": "aktualizacja",
}
ERRORS = {
    "state_write": "zapis", "clipboard": "schowek",
    "sw_register": "rejestracja PWA", "future_schema": "nowszy schemat",
}


def integer(value):
    return type(value) is int


def event_date(event):
    offset = event.get("offset")
    at = event.get("at")
    if not integer(at) or not integer(offset) or abs(offset) >= 1440:
        return None
    try:
        return datetime.fromtimestamp(at / 1000, timezone(timedelta(minutes=offset)))
    except (ValueError, OverflowError, OSError):
        return None


def ratio(count, total):
    return f"{count}/{total} ({count / total:.1%})" if total else "0/0 (brak próby)"


def breakdown(records, labels):
    counts = Counter(event.get("kind") for event in records if isinstance(event.get("kind"), str))
    return ", ".join(f"{label} {counts[key]}" for key, label in labels.items())


def median_text(values, formatted):
    return f"{formatted(median(values))} (n={len(values)})" if values else "brak (n=0)"


def report(data):
    source_events = data.get("events", [])
    seen = set()
    events = []
    for event in source_events if isinstance(source_events, list) else []:
        if not isinstance(event, dict) or event.get("type") not in ("visible", "note", "action", "error"):
            continue
        ident = event.get("id")
        moment = event_date(event)
        if not isinstance(ident, str) or ident in seen or moment is None:
            continue
        seen.add(ident)
        events.append((event, moment))

    dates = [moment.date() for _, moment in events]
    interval = f"{min(dates)} – {max(dates)}" if dates else "brak"
    print(f"Zakres zdarzeń {interval} | zdarzenia {len(events)} | dni z obserwacją {len(set(dates))}")

    notes = [event for event, _ in events if event["type"] == "note"]
    complete = [event for event in notes if event.get("end") in ("done", "replaced")]
    lengths = [event["chars"] for event in complete if integer(event.get("chars")) and event["chars"] >= 0]
    timed = [event for event in complete if integer(event.get("firstMs")) and
             integer(event.get("lastMs")) and 0 <= event["firstMs"] <= event["lastMs"]]
    first = median_text([event["firstMs"] for event in timed], lambda value: f"{value / 1000:.2f} s")
    last = median_text([event["lastMs"] for event in timed], lambda value: f"{value / 1000:.2f} s")
    size = median_text(lengths, lambda value: f"{value:g} znaków")
    print(f"1. Notatki ({len(complete)}/{len(notes)} domkniętych) — mediany do pierwszej zmiany {first}, do ostatniej {last}.")
    nonempty = median_text([length for length in lengths if length], lambda value: f"{value:g} znaków")
    print(f"   Puste {ratio(lengths.count(0), len(lengths))}, długość wszystkich {size}, niepustych {nonempty}.")

    visible = [(event, moment) for event, moment in events if event["type"] == "visible"]
    by_hour = Counter(moment.hour for _, moment in visible)
    hours = ", ".join(f"{hour:02d}={by_hour[hour]}" for hour in sorted(by_hour)) or "brak"
    visibility = breakdown([event for event, _ in visible], {"open": "otwarcia", "resume": "powroty"})
    print(f"2. Widoczność — {visibility} (n={len(visible)}). Godziny lokalne (00–23) {hours}.")
    # Gaps describe the recorded traces, including note boundary observations.
    traces = [(event["at"], moment) for event, moment in events if event["type"] != "error"]
    gaps = [(after - before, start, end)
            for (before, start), (after, end) in zip(traces, traces[1:])]
    gaps = [gap for gap in gaps if gap[0] >= 0]
    long_gaps = [gap for gap in gaps if gap[0] >= HOUR_MS]
    print(f"   Przerwy ≥1 h między śladami {ratio(len(long_gaps), len(gaps))}. Dotknięcia poza zdarzeniami nie są obserwowane.")
    if long_gaps:
        gap, start, end = max(long_gaps, key=lambda item: item[0])
        print(f"   Najdłuższa {gap / HOUR_MS:.1f} h ({start:%d.%m %H:%M} → {end:%d.%m %H:%M}).")

    entries = [entry for entry in data.get("entries", []) if isinstance(entry, dict) and
               integer(entry.get("start")) and integer(entry.get("end")) and 0 <= entry["start"] <= entry["end"]]
    closes = Counter(entry["end"] for entry in entries)
    starts = Counter(entry["start"] for entry in entries)
    current = data.get("current")
    if isinstance(current, dict) and integer(current.get("start")):
        starts[current["start"]] += 1
    inferred = closes + (starts - closes)
    daily = Counter()
    for stamp, count in inferred.items():
        try:
            daily[datetime.fromtimestamp(stamp / 1000).date()] += count
        except (ValueError, OverflowError, OSError):
            continue
    days = sorted(daily)
    days_range = f"{days[0]} – {days[-1]}" if days else "brak"
    daily_text = ", ".join(f"{day:%d.%m}={daily[day]}" for day in days[-14:]) or "brak"
    big = sum(entry["end"] - entry["start"] >= LONG_INTERVAL_MS for entry in entries)
    print(f"3. Granice pomiaru z wpisów — {sum(daily.values())} na {len(days)} dni z granicą ({days_range}, strefa komputera).")
    print(f"   Dziennie, do 14 ostatnich dni z granicą {daily_text}. Obejmuje Stop i wnioskowane starty.")
    ongoing = "brak"
    exported_at = data.get("lastBackupAt")
    if isinstance(current, dict) and integer(current.get("start")):
        ongoing = "trwa"
        if integer(exported_at) and exported_at >= current["start"]:
            hours_running = (exported_at - current["start"]) / HOUR_MS
            ongoing = f"{hours_running:.1f} h w chwili kopii"
    print(f"   Ukończone ≥8 h {ratio(big, len(entries))}. Bieżący pomiar {ongoing}.")
    for number, kind, title, names in [(4, "action", "Rzadkie akcje", ACTIONS), (5, "error", "Błędy", ERRORS)]:
        rows = [event for event, _ in events if event["type"] == kind]
        print(f"{number}. {title} (n={len(rows)}) — {breakdown(rows, names)}.")
    for_mode = Counter(event.get("mode") for event, _ in visible if isinstance(event.get("mode"), str))
    print("6. Tryb wyświetlania — " + ", ".join(
        f"{label} {ratio(for_mode[key], len(visible))}"
        for key, label in [("standalone", "PWA"), ("browser", "karta"), ("other", "inny")]
    ))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", nargs="?", default="-", help="Plik kopii JSON lub - dla stdin.")
    args = parser.parse_args()
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(errors="backslashreplace")
    try:
        raw = (sys.stdin.buffer.read().decode("utf-8-sig") if args.file == "-"
               else Path(args.file).read_text(encoding="utf-8-sig"))
        data = json.loads(raw)
        if not isinstance(data, dict) or not isinstance(data.get("entries"), list):
            raise ValueError
    except (ValueError, OSError):
        parser.exit(2, "Nie można odczytać kopii JSON z listą wpisów.\n")
    report(data)


if __name__ == "__main__":
    main()
