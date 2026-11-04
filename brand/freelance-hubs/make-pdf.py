"""Combines the rendered presentation boards into one client-ready PDF."""
import glob
import os

from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
boards = sorted(glob.glob(os.path.join(here, "presentation", "board-*.png")))
imgs = [Image.open(b).convert("RGB") for b in boards]
out = os.path.join(here, "FREELANCE-HUBS-Logo-Concepts.pdf")
# 2000x943 pt pages, matching the reference deck; images are 2x for sharpness.
imgs[0].save(out, save_all=True, append_images=imgs[1:], resolution=144.0, quality=92)
print(f"wrote {os.path.basename(out)}: {len(imgs)} pages, {os.path.getsize(out)/1e6:.1f} MB")
