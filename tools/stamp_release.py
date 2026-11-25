"""Stamp the offline release and pin the exact bytes fetched by its worker."""

import base64
import hashlib
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
FILES = (
    "index.html",
    "manifest.webmanifest",
    "styles.css",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/maskable-512.png",
)
HTML_MARKER = rb'(<meta name="app-release" content=")[^"]*(">)'
WORKER_RELEASE = rb"(?m)^const RELEASE = '[^']*';"
WORKER_INTEGRITY = rb"(?m)^const OFFLINE_INTEGRITY = .*;"


def replace_marker(pattern, replacement, data):
    result, count = re.subn(pattern, replacement, data)
    if count != 1:
        raise ValueError(f"Expected exactly one marker for {pattern!r}")
    return result


def sha256(data):
    return hashlib.sha256(data).digest()


def main():
    # Keep browser modules under js/ so the release includes their full import graph.
    modules = sorted(path.relative_to(ROOT).as_posix() for path in (ROOT / "js").rglob("*.js"))
    files = {name: (ROOT / name).read_bytes() for name in (*FILES, *modules)}
    text_files = ("index.html", "manifest.webmanifest", "styles.css", *modules)
    for name in text_files:
        files[name] = files[name].replace(b"\r\n", b"\n")
    html = replace_marker(HTML_MARKER, rb"\g<1>unstamped\g<2>", files["index.html"])
    files["index.html"] = html

    sw = ROOT / "sw.js"
    worker = sw.read_bytes().replace(b"\r\n", b"\n")
    worker = replace_marker(WORKER_RELEASE, b"const RELEASE = 'unstamped';", worker)
    worker = replace_marker(WORKER_INTEGRITY, b"const OFFLINE_INTEGRITY = {};", worker)

    digest = hashlib.sha256()
    for name, data in (*files.items(), ("sw.js", worker)):
        digest.update(name.encode("ascii") + b"\0" + sha256(data))
    release = digest.hexdigest()[:16]
    files["index.html"] = replace_marker(
        HTML_MARKER, rb"\g<1>" + release.encode("ascii") + rb"\g<2>", html
    )
    integrity = {
        name: "sha256-" + base64.b64encode(sha256(data)).decode("ascii")
        for name, data in files.items()
    }
    worker = replace_marker(WORKER_RELEASE, f"const RELEASE = '{release}';".encode(), worker)
    worker = replace_marker(
        WORKER_INTEGRITY, f"const OFFLINE_INTEGRITY = {json.dumps(integrity)};".encode(), worker
    )

    for name in text_files:
        path = ROOT / name
        if path.read_bytes() != files[name]:
            path.write_bytes(files[name])
    if sw.read_bytes() != worker:
        sw.write_bytes(worker)
    print(release)


if __name__ == "__main__":
    main()
