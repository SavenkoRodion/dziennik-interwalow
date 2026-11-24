"""Build the three PNG icons using only the Python standard library."""

from pathlib import Path
import struct
import zlib


ICONS = Path(__file__).resolve().parents[1] / "icons"
BACKGROUND = bytes.fromhex("146348")
INK = bytes.fromhex("f3f5f1")
RECTANGLES = ((24, 39, 43, 61), (47, 28, 53, 72), (57, 39, 76, 61))


def chunk(kind, data):
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))


def icon(size, maskable):
    pixels = bytearray()
    for y in range(size):
        pixels.append(0)  # PNG row filter: none
        for x in range(size):
            px, py = (x + 0.5) * 100 / size, (y + 0.5) * 100 / size
            transparent = not maskable and (px - 50)**2 + (py - 50)**2 > 48**2
            ink = any(left <= px < right and top <= py < bottom
                      for left, top, right, bottom in RECTANGLES)
            pixels.extend(INK if ink else BACKGROUND)
            pixels.append(0 if transparent else 255)
    header = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header)
            + chunk(b"IDAT", zlib.compress(pixels)) + chunk(b"IEND", b""))


if __name__ == "__main__":
    ICONS.mkdir(exist_ok=True)
    for filename, size, maskable in (
        ("icon-192.png", 192, False),
        ("icon-512.png", 512, False),
        ("maskable-512.png", 512, True),
    ):
        (ICONS / filename).write_bytes(icon(size, maskable))
