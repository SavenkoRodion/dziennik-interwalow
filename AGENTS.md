# Instrukcje dla agentów

To repozytorium jest publiczne. Katalog `private/` zawiera prywatne dokumenty właściciela. Czytaj je jako kontekst dotyczący architektury i wizji produktu.

Główne repozytorium nigdy nie śledzi `private/`. Nie przenoś dokumentów poza ten katalog i nie kopiuj ich treści do plików śledzonych przez główne repozytorium, w tym do komentarzy w kodzie i README, ani do komunikatów commitów głównego repozytorium.

Po każdej zmianie plików w `private/` zrób commit z krótkim opisem zmiany w osobnym lokalnym repozytorium Git w `private/`. Nie dodawaj do niego żadnego remote, chyba że właściciel wprost o to poprosi.

## Projekt i zasady pracy

„Dziennik interwałów” to osobista PWA do śledzenia czasu (Android, obsługa jedną ręką), też projekt portfolio. Zwykły HTML/CSS/moduły ES, bez bibliotek i CDN. Wdrożenie na GitHub Pages pod stałym adresem (dane są przypisane do origin, adres nie może się zmienić). Wizję i architekturę czytaj z `private/architecture.md` i `private/pomysly.md`; architektura jest źródłem prawdy. Sprzeczności między architekturą a kodem zgłaszaj w raporcie.

- **Dane użytkownika są najważniejsze.** Zmiany schematu tylko z migracją i zgodnością ze starymi kopiami JSON (w tym `backup-testowy.json`). Zapis nie może nadpisać danych nowszej wersji. Import niczego nie zapisuje przed podglądem i potwierdzeniem.
- **Offline-first.** Aplikacja ma działać w trybie samolotowym; release stempluje `tools/stamp_release.py`.
- **Testy.** Logikę danych (import, migracje, konflikty) pokrywaj testami w `tests/*.test.mjs` (wbudowany `node:test`, bez zewnętrznych frameworków).
- **Kontrola.** Przed raportem uruchom `node tools/check.mjs` (składnia, testy, stempel release, prywatne pliki poza gitem). Raport bez przechodzącej kontroli to raport o blokadzie.
- **Git.** Edytuj tylko pliki. Nie wykonuj zapisów do `.git` (add, commit, branch, push). Commity robi Lead po przeglądzie, push robi właściciel.
- **Blokady.** Gdy coś Cię blokuje (uprawnienia, sandbox, brak narzędzia), zatrzymaj się i opisz dokładnie co. Nie obchodź tego kopią repo ani innym obejściem i nie raportuj sukcesu kroku, którego nie wykonałeś w prawdziwym repo.
- **Właściciel** nie wykonuje ręcznych kroków w terminalu. Projektuj tak, żeby testował na telefonie (Android) i laptopie (Windows).
- **Raport na koniec:** co zrobiłeś, decyzje projektowe i powody, wynik `node tools/check.mjs`, czego nie dało się zweryfikować bez telefonu, kroki testu na urządzeniach.
