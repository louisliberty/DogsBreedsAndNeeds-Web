"""Regenerate derived images in public/. Run after adding or replacing a breed photo.

    python3 tools/images.py

Needs Pillow (pip install pillow). Creates:
  public/breeds/thumbs/<slug>.webp   480x336 card thumbnails from public/breeds/<slug>.webp
  public/images/products/*.webp      800px product photos from the .jpg originals
  public/og-default.jpg              1200x630 social share card from public/og-default.png
"""
import glob, os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pub = lambda *p: os.path.join(ROOT, "public", *p)

os.makedirs(pub("breeds", "thumbs"), exist_ok=True)
made = 0
for src in sorted(glob.glob(pub("breeds", "*.webp"))):
    out = pub("breeds", "thumbs", os.path.basename(src))
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
        continue
    im = Image.open(src).convert("RGB")
    ImageOps.fit(im, (480, 336), Image.LANCZOS).save(out, "WEBP", quality=78, method=6)
    made += 1
print(f"breed thumbnails written: {made}")

for src in glob.glob(pub("images", "products", "*.jpg")):
    out = src[:-4] + ".webp"
    im = Image.open(src).convert("RGB")
    im.thumbnail((800, 800), Image.LANCZOS)
    im.save(out, "WEBP", quality=78, method=6)
    os.remove(src)
    print("product image:", os.path.basename(out))

if os.path.exists(pub("og-default.png")):
    im = Image.open(pub("og-default.png")).convert("RGB")
    ImageOps.fit(im, (1200, 630), Image.LANCZOS).save(pub("og-default.jpg"), "JPEG", quality=82, optimize=True, progressive=True)
    os.remove(pub("og-default.png"))
    print("og-default.jpg written")
