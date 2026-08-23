from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
MEDIA_ROOT = ROOT / "images" / "portfolio"


def difference_hash(path: Path, size: int = 16) -> int:
    with Image.open(path) as image:
        pixels = list(image.convert("L").resize((size + 1, size)).getdata())
    bits = 0
    for row in range(size):
        offset = row * (size + 1)
        for column in range(size):
            bits = (bits << 1) | (pixels[offset + column] > pixels[offset + column + 1])
    return bits


def distance(left: int, right: int) -> int:
    return (left ^ right).bit_count()


for media_dir in sorted(MEDIA_ROOT.glob("*/ai-2026")):
    files = sorted(media_dir.glob("*.jpeg"))
    hashes = {path: difference_hash(path) for path in files}
    pairs = []
    for index, left in enumerate(files):
        for right in files[index + 1 :]:
            pairs.append((distance(hashes[left], hashes[right]), left.name, right.name))
    ranked_pairs = sorted(pairs)
    close_pairs = [pair for pair in ranked_pairs if pair[0] <= 70]
    print(f"{media_dir.parent.name}: {len(files)} images")
    if close_pairs:
        for score, left, right in close_pairs:
            print(f"  distance {score:>2}: {left} / {right}")
    else:
        closest = ", ".join(f"{left}/{right} ({score})" for score, left, right in ranked_pairs[:3])
        print(f"  no close visual matches; closest: {closest}")
