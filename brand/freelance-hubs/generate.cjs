// Renders the six FREELANCE HUBS logo concepts (round 2) to PNG.
// Usage: node brand/freelance-hubs/generate.cjs && python3 brand/freelance-hubs/set-dpi.py
// Renders at 3x and set-dpi.py downsamples to the exact delivery size for crisp edges.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const C = {
  navy: '#0B2559',
  blue: '#1662E0',
  bright: '#2F86FF',
  sky: '#7DB8FF',
  ice: '#E6F0FF',
  white: '#FFFFFF',
};
const SCALE = 3;

const pt = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)];
};

// ---------- Marks (200 x 200 grid) ----------
const marks = {
  // 1. HUB H: the crossbar of the H is a hub node joining two stems
  hubH: () => `
    <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.bright}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient></defs>
    <circle cx="100" cy="100" r="94" fill="url(#g1)"/>
    <g fill="${C.white}">
      <rect x="52" y="50" width="26" height="100" rx="13"/>
      <rect x="122" y="50" width="26" height="100" rx="13"/>
      <rect x="70" y="93" width="60" height="14"/>
      <circle cx="100" cy="100" r="22"/>
    </g>
    <circle cx="100" cy="100" r="9" fill="${C.navy}"/>`,

  // 2. FORWARD F: the F's middle arm is an arrow breaking out of the circle
  forwardF: () => {
    const [sx, sy] = pt(100, 100, 76, 32);
    const [ex, ey] = pt(100, 100, 76, -32);
    return `
    <path d="M${sx} ${sy} A76 76 0 1 1 ${ex} ${ey}" fill="none" stroke="${C.navy}" stroke-width="16" stroke-linecap="round"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="20">
      <path d="M72 140V62h50" stroke="${C.navy}"/>
      <path d="M84 101h94" stroke="${C.blue}"/>
      <path d="M164 85l16 16-16 16" stroke="${C.blue}"/>
    </g>`;
  },

  // 3. THE LINK: client and freelancer as two interlaced rings
  link: () => {
    const L = [68, 100], R = [132, 100], r = 54, w = 20;
    const ring = (c, col) => `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
    const seg = (d1, d2) => {
      const [x1, y1] = pt(L[0], L[1], r, d1);
      const [x2, y2] = pt(L[0], L[1], r, d2);
      return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
    };
    // halo only where the rings cross; the redrawn stroke runs longer so its ends sit on solid navy
    const halo = seg(34, 76);
    const arc = seg(14, 96);
    return `
      ${ring(L, C.navy)}
      <circle cx="${R[0]}" cy="${R[1]}" r="${r}" fill="none" stroke="${C.white}" stroke-width="${w + 12}"/>
      ${ring(R, C.blue)}
      <path d="${halo}" fill="none" stroke="${C.white}" stroke-width="${w + 12}"/>
      <path d="${arc}" fill="none" stroke="${C.navy}" stroke-width="${w}"/>`;
  },

  // 4. CORE CUBE: three faces meet at one hub point
  cube: () => {
    const c = [100, 100];
    const v = [-90, -30, 30, 90, 150, 210].map((d) => pt(100, 100, 90, d));
    const poly = (pts, fill) =>
      `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${C.white}" stroke-width="9" stroke-linejoin="round"/>`;
    return `
      ${poly([v[0], v[1], c, v[5]], C.sky)}
      ${poly([v[1], v[2], v[3], c], C.navy)}
      ${poly([v[5], c, v[3], v[4]], C.blue)}
      <circle cx="100" cy="100" r="20" fill="${C.white}"/>
      <circle cx="100" cy="100" r="10" fill="${C.bright}"/>`;
  },

  // 5. TAKE FLIGHT: a paper plane for the freedom to work from anywhere
  plane: () => `
    <path d="M16 176C34 150 52 138 78 134" fill="none" stroke="${C.sky}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 17"/>
    <polygon points="20,92 184,26 98,116" fill="${C.bright}"/>
    <polygon points="98,116 184,26 122,172" fill="${C.navy}"/>
    <polygon points="98,116 122,172 90,150" fill="${C.blue}"/>`,

  // 6. TALK NETWORK (reversed): conversation bubble holding a connected team
  chat: () => `
    <path d="M50 30h100a28 28 0 0 1 28 28v58a28 28 0 0 1-28 28H86l-34 26a4 4 0 0 1-6.4-3.2V144A28 28 0 0 1 22 116V58a28 28 0 0 1 28-28z" fill="${C.white}"/>
    <g stroke="${C.blue}" stroke-width="7" stroke-linecap="round">
      <line x1="100" y1="66" x2="66" y2="108"/><line x1="100" y1="66" x2="134" y2="108"/><line x1="66" y1="108" x2="134" y2="108"/>
    </g>
    <circle cx="100" cy="66" r="15" fill="${C.navy}"/>
    <circle cx="66" cy="108" r="15" fill="${C.blue}"/>
    <circle cx="134" cy="108" r="15" fill="${C.blue}"/>`,
};

const svg = (inner, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">${inner}</svg>`;

// ---------- Wordmarks ----------
const W = {
  // single line in stacked mode, two lines in horizontal mode
  duo: (mode, a, b, opts = {}) => {
    const st = mode === 'stacked';
    const fs = st ? opts.fs || 62 : opts.fsH || 60;
    return `<div class="wm" style="font-family:'Inter Display',Inter;font-weight:${opts.weight || 800};
      font-size:${fs}px;letter-spacing:${opts.track || '0.015em'};line-height:.98;text-align:${st ? 'center' : 'left'};white-space:nowrap">
      <span style="color:${a}">FREELANCE</span>${st ? ' ' : '<br>'}<span style="color:${b}">HUBS</span></div>`;
  },
};

// ---------- Concepts ----------
const concepts = [
  {
    id: '01-hub-h',
    name: 'Hub H',
    bg: C.white,
    mark: marks.hubH,
    word: (m) => W.duo(m, C.navy, C.blue, { fs: 64, fsH: 62 }),
  },
  {
    id: '02-forward-f',
    name: 'Forward F',
    bg: C.white,
    mark: marks.forwardF,
    word: (m) => `
      <div class="wm" style="font-family:'Inter Display',Inter;text-align:${m === 'stacked' ? 'center' : 'left'};line-height:1;color:${C.navy}">
        <div style="font-weight:800;font-size:${m === 'stacked' ? 64 : 58}px;letter-spacing:.06em;margin-right:-.06em">FREELANCE</div>
        <div style="font-weight:700;font-size:${m === 'stacked' ? 40 : 36}px;letter-spacing:.62em;
          margin-right:${m === 'stacked' ? '-.62em' : '0'};margin-top:10px;color:${C.blue}">HUBS</div>
      </div>`,
  },
  {
    id: '03-the-link',
    name: 'The Link',
    bg: C.white,
    mark: marks.link,
    word: (m) => `
      <div class="wm" style="font-family:'Inter Display',Inter;text-align:${m === 'stacked' ? 'center' : 'left'};line-height:1">
        <div style="font-weight:300;font-size:${m === 'stacked' ? 66 : 60}px;letter-spacing:.02em;color:${C.navy}">FREELANCE</div>
        <div style="font-weight:800;font-size:${m === 'stacked' ? 66 : 60}px;letter-spacing:.02em;color:${C.blue}">HUBS</div>
      </div>`,
  },
  {
    id: '04-core-cube',
    name: 'Core Cube',
    bg: C.white,
    mark: marks.cube,
    word: (m) => `
      <div class="wm" style="font-family:'Inter Display',Inter;text-align:${m === 'stacked' ? 'center' : 'left'};line-height:1;color:${C.navy}">
        <div style="font-weight:700;font-size:${m === 'stacked' ? 60 : 54}px;letter-spacing:.16em;margin-right:-.16em">FREELANCE</div>
        <div style="display:flex;align-items:center;gap:14px;margin-top:12px;${m === 'stacked' ? 'justify-content:center' : ''}">
          <span style="flex:${m === 'stacked' ? '0 0 64px' : '1'};height:4px;border-radius:2px;background:${C.sky}"></span>
          <span style="font-weight:800;font-size:${m === 'stacked' ? 38 : 34}px;letter-spacing:.42em;margin-right:-.42em;color:${C.blue}">HUBS</span>
          <span style="flex:${m === 'stacked' ? '0 0 64px' : '1'};height:4px;border-radius:2px;background:${C.sky}"></span>
        </div>
      </div>`,
  },
  {
    id: '05-take-flight',
    name: 'Take Flight',
    bg: C.white,
    mark: marks.plane,
    word: (m) => W.duo(m, C.navy, C.blue, { fs: 66, fsH: 62, weight: 700, track: '0.01em' }),
  },
  {
    id: '06-talk-network',
    name: 'Talk Network (reversed)',
    bg: `radial-gradient(120% 120% at 0% 0%, ${C.bright} 0%, ${C.blue} 45%, ${C.navy} 100%)`,
    mark: marks.chat,
    word: (m) => W.duo(m, C.white, C.sky, { fs: 64, fsH: 60 }),
  },
];

const formats = [
  { key: 'web-72dpi', w: 770, h: 684, mode: 'stacked', icon: 240, gap: 40 },
  { key: 'print-300dpi', w: 768, h: 450, mode: 'horizontal', icon: 176, gap: 36 },
];

const page = (c, f) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${f.w}px;height:${f.h}px;background:${c.bg};font-family:Inter,sans-serif;
    display:flex;align-items:center;justify-content:center;overflow:hidden;
    font-feature-settings:"ss01","cv11";text-rendering:geometricPrecision}
  .lock{display:flex;align-items:center;justify-content:center;
    flex-direction:${f.mode === 'stacked' ? 'column' : 'row'};gap:${f.gap}px}
  svg{display:block;flex:none}
</style></head><body><div class="lock">${svg(c.mark(), f.icon)}${c.word(f.mode)}</div></body></html>`;

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
      const box = await p.$eval('.lock', (el) => el.getBoundingClientRect().toJSON());
      if (box.width > f.w - 80 || box.height > f.h - 80) {
        console.warn(`WARN ${c.id} ${f.key}: lockup ${Math.round(box.width)}x${Math.round(box.height)} leaves thin margins`);
      }
      const file = path.join(out, `freelance-hubs-${c.id}-${f.key}.png`);
      await p.screenshot({ path: file });
      console.log('wrote', path.basename(file));
    }
  }
  await browser.close();
})();
