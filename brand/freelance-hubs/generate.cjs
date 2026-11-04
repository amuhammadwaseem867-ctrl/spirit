// Renders the six FREELANCE HUBS logo concepts to delivery PNGs.
// Usage: node brand/freelance-hubs/generate.cjs && python3 brand/freelance-hubs/set-dpi.py
// Renders at 3x and set-dpi.py downsamples to the exact delivery size for crisp edges.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { C, COLOR, INK, concepts, lockup } = require('./concepts.cjs');

const SCALE = 3;
const REVERSED = '06-talk-network'; // shown white-on-blue as its hero version

const formats = [
  { key: 'web-72dpi', w: 770, h: 684, mode: 'stacked' },
  { key: 'print-300dpi', w: 768, h: 450, mode: 'horizontal' },
];

const page = (c, f) => {
  const rev = c.id === REVERSED;
  const bg = rev ? `radial-gradient(120% 120% at 0% 0%, ${C.bright} 0%, ${C.blue} 45%, ${C.navy} 100%)` : C.white;
  const body = lockup(c, { mode: f.mode, monoInk: rev ? C.white : undefined, P: COLOR, ink: rev ? INK.white : INK.color });
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0}
    body{width:${f.w}px;height:${f.h}px;background:${bg};display:flex;align-items:center;justify-content:center;
      overflow:hidden;text-rendering:geometricPrecision}
  </style></head><body><div class="lock">${body}</div></body></html>`;
};

(async () => {
  const out = path.join(__dirname, 'png');
  fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(out)) fs.unlinkSync(path.join(out, f));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: SCALE });
  const p = await ctx.newPage();
  for (const c of concepts) {
    for (const f of formats) {
      await p.setViewportSize({ width: f.w, height: f.h });
      await p.setContent(page(c, f));
      await p.evaluate(() => document.fonts.ready);
      const box = await p.$eval('.lock > div', (el) => el.getBoundingClientRect().toJSON());
      if (box.width > f.w - 80 || box.height > f.h - 80) {
        console.warn(`WARN ${c.id} ${f.key}: lockup ${Math.round(box.width)}x${Math.round(box.height)} leaves thin margins`);
      }
      const file = path.join(out, `freelance-hubs-${c.id}-${f.key}.png`);
      await p.screenshot({ path: file });
    }
  }
  await browser.close();
  console.log('rendered', concepts.length * formats.length, 'PNGs');
})();
