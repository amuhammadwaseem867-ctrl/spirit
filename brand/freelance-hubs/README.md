# FREELANCE HUBS — Logo Concepts

Six logo concepts in blue and white. Each one comes in two PNG lockups:

| File suffix | Pixels | DPI | Physical size | Layout |
|---|---|---|---|---|
| `-web-72dpi.png` | 770 × 684 | 72 | 10.7 × 9.5 in | Stacked (icon above name) |
| `-print-300dpi.png` | 768 × 450 | 300 | 2.56 × 1.50 in | Horizontal (icon beside name) |

| # | Concept | Idea |
|---|---|---|
| 01 | Hub H | The H's crossbar is a hub node joining two stems. Name and idea in one mark. |
| 02 | Forward F | The F's middle arm becomes an arrow breaking out of the circle: freelancers moving forward. |
| 03 | The Link | Client and freelancer as two interlaced rings, a partnership. |
| 04 | Core Cube | An isometric cube whose three faces meet at one hub point: the place where all sides of the work meet. |
| 05 | Take Flight | A faceted paper plane: freedom to work from anywhere. |
| 06 | Talk Network | A speech bubble holding a connected team, white on a blue gradient. |

Each mark is built on a 200-unit grid with matched stroke weights. It stays readable at favicon size. Renders are supersampled 3x and then downscaled for clean edges.

Palette: Navy `#0B2559` · Blue `#1662E0` · Bright `#2F86FF` · Sky `#7DB8FF` · White `#FFFFFF`
Typeface: Inter / Inter Display

`freelance-hubs-contact-sheet.png` shows all concepts on one page for review.

## Client presentation

`FREELANCE-HUBS-Logo-Concepts.pdf` has 7 pages, each 2000 × 943. It follows the reference deck's board layout:

- **Pages 1–6:** one board per concept, in three panels:
  - the mark in white on a textured navy background
  - the horizontal and one-line lockups on light grey
  - mockups: a button badge, a woven label, and front and back business cards
- **Page 7:** an overview of every mark and lockup.

The individual boards are in `presentation/` at 4000 × 1886.

## Regenerate

```
node brand/freelance-hubs/generate.cjs && python3 brand/freelance-hubs/set-dpi.py      # delivery PNGs
node brand/freelance-hubs/presentation.cjs && python3 brand/freelance-hubs/make-pdf.py # presentation
```

The marks, wordmarks and lockups live in `concepts.cjs` and are shared by both scripts.
