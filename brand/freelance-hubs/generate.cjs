// Renders the six FREELANCE HUBS logo concepts to PNG.
// Usage: node brand/freelance-hubs/generate.cjs
// Output: brand/freelance-hubs/png/*.png  (DPI metadata applied by set-dpi.py)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const C = {
  navy: '#0A2A5E',
  blue: '#1565D8',
  sky: '#4DA3FF',
  ice: '#DCEBFF',
  white: '#FFFFFF',
};

// ---------- Icons (all drawn in a 200x200 box) ----------
const icons = {
  // 1. Hub network: central hub connected to six freelancer nodes
  network: (ink = C.blue, accent = C.navy, bg = C.white) => {
    const nodes = [];
    const spokes = [];
    const ring = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      const x = 100 + 72 * Math.cos(a);
      const y = 100 + 72 * Math.sin(a);
      ring.push([x, y]);
      spokes.push(`<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`);
      nodes.push(`<circle cx="${x}" cy="${y}" r="17" fill="${i % 2 ? ink : accent}"/>`);
    }
    const poly = ring.map((p) => p.join(',')).join(' ');
    return `<polygon points="${poly}" fill="none" stroke="${ink}" stroke-opacity=".35" stroke-width="4" stroke-linejoin="round"/>
      ${spokes.join('')}
      <circle cx="100" cy="100" r="31" fill="${accent}"/>
      <circle cx="100" cy="100" r="13" fill="${bg}"/>
      ${nodes.join('')}`;
  },

  // 2. FH monogram: F and H fused through a shared crossbar, in a rounded tile
  monogram: () => `
    <defs><clipPath id="tile"><rect x="6" y="6" width="188" height="188" rx="44"/></clipPath></defs>
    <rect x="6" y="6" width="188" height="188" rx="44" fill="${C.blue}"/>
    <path d="M6 194L194 6V194z" fill="${C.navy}" opacity=".22" clip-path="url(#tile)"/>
    <g fill="${C.white}">
      <rect x="44" y="46" width="24" height="108" rx="4"/>
      <rect x="44" y="46" width="74" height="22" rx="4"/>
      <rect x="44" y="90" width="112" height="22" rx="4"/>
      <rect x="132" y="46" width="24" height="108" rx="4"/>
    </g>`,

  // 3. Location pin holding a freelancer — "talent, anywhere"
  pin: () => `
    <defs><clipPath id="pinface"><circle cx="100" cy="80" r="46"/></clipPath></defs>
    <path d="M100 8c-43 0-74 31-74 72 0 52 61 100 70 108a6 6 0 0 0 8 0c9-8 70-56 70-108 0-41-31-72-74-72z" fill="${C.blue}"/>
    <circle cx="100" cy="80" r="52" fill="${C.white}"/>
    <g clip-path="url(#pinface)">
      <circle cx="100" cy="80" r="46" fill="${C.ice}"/>
      <circle cx="100" cy="68" r="17" fill="${C.navy}"/>
      <path d="M60 130c0-26 18-42 40-42s40 16 40 42z" fill="${C.navy}"/>
    </g>`,

  // 4. Honeycomb hub: seven hexagon cells around a core
  hex: () => {
    const hex = (cx, cy, r, fill) => {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
      }
      return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${C.white}" stroke-width="6" stroke-linejoin="round"/>`;
    };
    const r = 34;
    const d = r * Math.sqrt(3);
    const fills = [C.navy, C.blue, C.sky, C.navy, C.blue, C.sky];
    let out = '';
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      out += hex(100 + d * Math.cos(a), 100 + d * Math.sin(a), r, fills[i]);
    }
    out += hex(100, 100, r, C.white);
    out += `<polygon points="${[0, 1, 2, 3, 4, 5]
      .map((i) => {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        return `${(100 + 31 * Math.cos(a)).toFixed(2)},${(100 + 31 * Math.sin(a)).toFixed(2)}`;
      })
      .join(' ')}" fill="none" stroke="${C.blue}" stroke-width="5"/>`;
    out += `<circle cx="100" cy="100" r="11" fill="${C.blue}"/>`;
    return out;
  },

  // 5. Community circle: four people linked around a shared hub
  people: () => `
    <defs><clipPath id="team"><circle cx="100" cy="100" r="78"/></clipPath></defs>
    <circle cx="100" cy="100" r="88" fill="none" stroke="${C.blue}" stroke-width="8"/>
    <circle cx="100" cy="100" r="78" fill="${C.ice}"/>
    <g clip-path="url(#team)">
      <circle cx="56" cy="86" r="16" fill="${C.sky}"/>
      <path d="M22 160c0-30 15-50 34-50s34 20 34 50z" fill="${C.sky}"/>
      <circle cx="144" cy="86" r="16" fill="${C.sky}"/>
      <path d="M110 160c0-30 15-50 34-50s34 20 34 50z" fill="${C.sky}"/>
      <circle cx="100" cy="72" r="21" fill="${C.ice}"/>
      <circle cx="100" cy="72" r="18" fill="${C.navy}"/>
      <path d="M58 182c0-38 19-80 42-80s42 42 42 80z" fill="${C.ice}"/>
      <path d="M62 182c0-36 17-76 38-76s38 40 38 76z" fill="${C.navy}"/>
    </g>`,

  // 6. Laptop with a connected-node screen — digital work, reversed (white on blue)
  laptop: () => `
    <rect x="34" y="40" width="132" height="90" rx="10" fill="none" stroke="${C.white}" stroke-width="9"/>
    <path d="M14 146h172l-10 16a8 8 0 0 1-7 4H31a8 8 0 0 1-7-4z" fill="${C.white}"/>
    <rect x="86" y="146" width="28" height="6" rx="3" fill="${C.blue}"/>
    <g stroke="${C.sky}" stroke-width="5" stroke-linecap="round">
      <line x1="100" y1="85" x2="66" y2="64"/><line x1="100" y1="85" x2="134" y2="64"/>
      <line x1="100" y1="85" x2="66" y2="108"/><line x1="100" y1="85" x2="134" y2="108"/>
    </g>
    <circle cx="100" cy="85" r="13" fill="${C.white}"/>
    <g fill="${C.sky}"><circle cx="66" cy="64" r="8"/><circle cx="134" cy="64" r="8"/>
    <circle cx="66" cy="108" r="8"/><circle cx="134" cy="108" r="8"/></g>`,
};

const svg = (inner, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">${inner}</svg>`;

// ---------- Concepts ----------
// Each concept: icon, background, and a wordmark renderer for "stacked" and "horizontal" lockups.
const concepts = [
  {
    id: '01-hub-network',
    name: 'Hub Network',
    bg: C.white,
    icon: () => icons.network(),
    word: (mode) => `
      <div class="wm" style="color:${C.navy};font-weight:800;letter-spacing:.02em;line-height:.95;
        font-size:${mode === 'stacked' ? 64 : 62}px;${mode === 'stacked' ? '' : 'text-align:left'}">
        FREELANCE${mode === 'stacked' ? ' ' : '<br>'}<span style="color:${C.blue}">HUBS</span>
      </div>`,
  },
  {
    id: '02-fh-monogram',
    name: 'FH Monogram',
    bg: C.white,
    icon: () => icons.monogram(),
    word: (mode) => `
      <div class="wm" style="color:${C.navy};text-align:${mode === 'stacked' ? 'center' : 'left'}">
        <div style="font-weight:700;font-size:${mode === 'stacked' ? 62 : 58}px;letter-spacing:.08em;line-height:1">FREELANCE</div>
        <div style="display:flex;align-items:center;gap:14px;margin-top:10px;${mode === 'stacked' ? 'justify-content:center' : ''}">
          <span style="height:4px;width:${mode === 'stacked' ? 70 : 40}px;background:${C.blue};border-radius:2px"></span>
          <span style="font-weight:600;font-size:${mode === 'stacked' ? 38 : 34}px;letter-spacing:.42em;color:${C.blue};margin-right:-.42em">HUBS</span>
          <span style="height:4px;width:${mode === 'stacked' ? 70 : 40}px;background:${C.blue};border-radius:2px"></span>
        </div>
      </div>`,
  },
  {
    id: '03-talent-pin',
    name: 'Talent Pin',
    bg: C.white,
    icon: () => icons.pin(),
    word: (mode) => `
      <div class="wm" style="text-align:${mode === 'stacked' ? 'center' : 'left'};line-height:1">
        <div style="font-weight:300;font-size:${mode === 'stacked' ? 66 : 60}px;color:${C.navy};letter-spacing:.03em">FREELANCE</div>
        <div style="font-weight:900;font-size:${mode === 'stacked' ? 66 : 60}px;color:${C.blue};letter-spacing:.03em;margin-top:2px">HUBS</div>
      </div>`,
  },
  {
    id: '04-honeycomb-hub',
    name: 'Honeycomb Hub',
    bg: C.white,
    icon: () => icons.hex(),
    word: (mode) => `
      <div class="wm" style="text-align:${mode === 'stacked' ? 'center' : 'left'};line-height:1;font-family:'Inter Display',Inter">
        <div style="font-weight:800;font-size:${mode === 'stacked' ? 60 : 54}px;color:${C.navy};letter-spacing:.14em;margin-right:-.14em">FREELANCE</div>
        <div style="margin-top:12px;display:inline-block;background:${C.blue};color:${C.white};font-weight:800;
          font-size:${mode === 'stacked' ? 34 : 30}px;letter-spacing:.5em;padding:8px 6px 8px 22px;border-radius:6px">HUBS</div>
      </div>`,
  },
  {
    id: '05-community-circle',
    name: 'Community Circle',
    bg: C.white,
    icon: () => icons.people(),
    word: (mode) => `
      <div class="wm" style="text-align:${mode === 'stacked' ? 'center' : 'left'};line-height:1">
        <div style="font-weight:700;font-size:${mode === 'stacked' ? 60 : 50}px;letter-spacing:-.01em;white-space:nowrap">
          <span style="color:${C.navy}">FREELANCE</span>${mode === 'stacked' ? ' ' : '<br>'}<span style="color:${C.blue}">HUBS</span>
        </div>
        <div style="margin-top:14px;font-weight:500;font-size:${mode === 'stacked' ? 21 : 18}px;letter-spacing:.24em;color:${C.blue}">CONNECT · CREATE · DELIVER</div>
      </div>`,
  },
  {
    id: '06-digital-workspace',
    name: 'Digital Workspace (reversed)',
    bg: `linear-gradient(135deg, ${C.blue} 0%, ${C.navy} 100%)`,
    icon: () => icons.laptop(),
    word: (mode) => `
      <div class="wm" style="color:${C.white};text-align:${mode === 'stacked' ? 'center' : 'left'};line-height:1">
        <div style="font-weight:800;font-size:${mode === 'stacked' ? 62 : 56}px;letter-spacing:.04em">FREELANCE</div>
        <div style="font-weight:800;font-size:${mode === 'stacked' ? 62 : 56}px;letter-spacing:.04em;color:${C.sky};margin-top:4px">HUBS</div>
      </div>`,
  },
];

const formats = [
  { key: 'web-72dpi', w: 770, h: 684, mode: 'stacked', icon: 250 },
  { key: 'print-300dpi', w: 768, h: 450, mode: 'horizontal', icon: 210 },
];

const page = (c, f) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${f.w}px;height:${f.h}px;background:${c.bg};font-family:Inter,sans-serif;
    display:flex;align-items:center;justify-content:center;overflow:hidden;-webkit-font-smoothing:antialiased}
  .lock{display:flex;align-items:center;justify-content:center;
    flex-direction:${f.mode === 'stacked' ? 'column' : 'row'};gap:${f.mode === 'stacked' ? 34 : 34}px}
  svg{display:block;flex:none}
</style></head><body><div class="lock">${svg(c.icon(), f.icon)}${c.word(f.mode)}</div></body></html>`;

(async () => {
  const out = path.join(__dirname, 'png');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  for (const c of concepts) {
    for (const f of formats) {
      await p.setViewportSize({ width: f.w, height: f.h });
      await p.setContent(page(c, f));
      await p.evaluate(() => document.fonts.ready);
      // guard: the lockup must fit inside the canvas with a margin
      const box = await p.$eval('.lock', (el) => el.getBoundingClientRect().toJSON());
      if (box.width > f.w - 40 || box.height > f.h - 40) {
        console.warn(`WARN ${c.id} ${f.key} lockup ${Math.round(box.width)}x${Math.round(box.height)} is tight`);
      }
      const file = path.join(out, `freelance-hubs-${c.id}-${f.key}.png`);
      await p.screenshot({ path: file });
      console.log('wrote', path.relative(process.cwd(), file));
    }
  }
  await browser.close();
})();
