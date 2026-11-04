"""Writes DPI metadata into the rendered PNGs (72 for web, 300 for print)
and builds a contact sheet of all concepts for review."""
import glob
import os

from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
pngs = sorted(glob.glob(os.path.join(here, "png", "*.png")))

for f in pngs:
    dpi, size = ((300, (768, 450)) if "300dpi" in f else (72, (770, 684)))
    im = Image.open(f).convert("RGB")
    if im.size != size:  # downsample the 3x supersampled render
        im = im.resize(size, Image.LANCZOS)
    im.save(f, dpi=(dpi, dpi), optimize=True)
    print(f"{os.path.basename(f)}: {im.size[0]}x{im.size[1]} px @ {dpi} DPI "
          f"= {im.size[0]/dpi:.2f} x {im.size[1]/dpi:.2f} in")

# Contact sheet: one row per concept, web lockup + print lockup side by side.
web = [f for f in pngs if "web-72dpi" in f]
gap = 24
rows = []
for w in web:
    a = Image.open(w)
    b = Image.open(w.replace("web-72dpi", "print-300dpi"))
    rows.append((a, b))
W = gap + 770 + gap + 768 + gap
H = gap + len(rows) * (684 + gap)
sheet = Image.new("RGB", (W, H), (226, 232, 240))
y = gap
for a, b in rows:
    sheet.paste(a, (gap, y))
    sheet.paste(b, (gap + 770 + gap, y + (684 - 450) // 2))
    y += 684 + gap
sheet = sheet.resize((W // 2, H // 2), Image.LANCZOS)
sheet.save(os.path.join(here, "freelance-hubs-contact-sheet.png"), dpi=(72, 72), optimize=True)
print("wrote contact sheet")
