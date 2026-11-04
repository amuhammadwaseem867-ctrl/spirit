// Shared definitions for the FREELANCE HUBS logo concepts:
// colour palette, palette-aware marks, wordmarks and lockups.
// Used by generate.cjs (delivery PNGs) and presentation.cjs (presentation boards).

const C = {
  navy: '#0B2559',
  blue: '#1662E0',
  bright: '#2F86FF',
  sky: '#7DB8FF',
  ice: '#E6F0FF',
  white: '#FFFFFF',
};

// Palettes. `white` is the knockout colour: gaps, gutters and counters inside a mark.
const COLOR = { ...C, grad: true };
const mono = (knockout, ink = '#FFFFFF') => ({
  navy: ink, blue: ink, bright: ink, sky: ink, ice: ink, white: knockout, grad: false,
});

let uid = 0;
const pt = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)];
};

// ---------- Marks (200 x 200 grid) ----------
const marks = {
  // 1. HUB H: the crossbar of the H is a hub node joining two stems
  hubH: (P) => {
    const id = `g${++uid}`;
    const fill = P.grad ? `url(#${id})` : P.blue;
    return `
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${P.bright}"/><stop offset="1" stop-color="${P.blue}"/></linearGradient></defs>
    <circle cx="100" cy="100" r="94" fill="${fill}"/>
    <g fill="${P.white}">
      <rect x="52" y="50" width="26" height="100" rx="13"/>
      <rect x="122" y="50" width="26" height="100" rx="13"/>
      <rect x="70" y="93" width="60" height="14"/>
      <circle cx="100" cy="100" r="22"/>
    </g>
    <circle cx="100" cy="100" r="9" fill="${P.navy}"/>`;
  },

  // 2. FORWARD F: the F's middle arm is an arrow breaking out of the circle
  forwardF: (P) => {
    const [sx, sy] = pt(100, 100, 76, 32);
    const [ex, ey] = pt(100, 100, 76, -32);
    return `
    <path d="M${sx} ${sy} A76 76 0 1 1 ${ex} ${ey}" fill="none" stroke="${P.navy}" stroke-width="16" stroke-linecap="round"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="20">
      <path d="M72 140V62h50" stroke="${P.navy}"/>
      <path d="M84 101h94" stroke="${P.blue}"/>
      <path d="M164 85l16 16-16 16" stroke="${P.blue}"/>
    </g>`;
  },

  // 3. THE LINK: client and freelancer as two interlaced rings
  link: (P) => {
    const L = [68, 100], R = [132, 100], r = 54, w = 20;
    const ring = (c, col) => `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
    const seg = (d1, d2) => {
      const [x1, y1] = pt(L[0], L[1], r, d1);
      const [x2, y2] = pt(L[0], L[1], r, d2);
      return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
    };
    // halo only where the rings cross; the redrawn stroke runs longer so its ends sit on solid ink
    const halo = seg(34, 76);
    const arc = seg(14, 96);
    return `
      ${ring(L, P.navy)}
      <circle cx="${R[0]}" cy="${R[1]}" r="${r}" fill="none" stroke="${P.white}" stroke-width="${w + 12}"/>
      ${ring(R, P.blue)}
      <path d="${halo}" fill="none" stroke="${P.white}" stroke-width="${w + 12}"/>
      <path d="${arc}" fill="none" stroke="${P.navy}" stroke-width="${w}"/>`;
  },

  // 4. CORE CUBE: three faces meet at one hub point
  cube: (P) => {
    const c = [100, 100];
    const v = [-90, -30, 30, 90, 150, 210].map((d) => pt(100, 100, 90, d));
    const poly = (pts, fill) =>
      `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${P.white}" stroke-width="9" stroke-linejoin="round"/>`;
    return `
      ${poly([v[0], v[1], c, v[5]], P.sky)}
      ${poly([v[1], v[2], v[3], c], P.navy)}
      ${poly([v[5], c, v[3], v[4]], P.blue)}
      <circle cx="100" cy="100" r="20" fill="${P.white}"/>
      <circle cx="100" cy="100" r="10" fill="${P.bright}"/>`;
  },

  // 5. TAKE FLIGHT: a paper plane for the freedom to work from anywhere
  plane: (P) => `
    <path d="M16 176C34 150 52 138 78 134" fill="none" stroke="${P.sky}" stroke-width="8" stroke-linecap="round" stroke-dasharray="1 17"/>
    <g stroke="${P.white}" stroke-width="${P.grad ? 0 : 5}" stroke-linejoin="round">
      <polygon points="20,92 184,26 98,116" fill="${P.bright}"/>
      <polygon points="98,116 184,26 122,172" fill="${P.navy}"/>
      <polygon points="98,116 122,172 90,150" fill="${P.blue}"/>
    </g>`,

  // 6. TALK NETWORK: conversation bubble holding a connected team
  chat: (P) => {
    const id = `g${++uid}`;
    const fill = P.grad ? `url(#${id})` : P.blue;
    return `
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${P.bright}"/><stop offset="1" stop-color="${P.blue}"/></linearGradient></defs>
    <path d="M50 30h100a28 28 0 0 1 28 28v58a28 28 0 0 1-28 28H86l-34 26a4 4 0 0 1-6.4-3.2V144A28 28 0 0 1 22 116V58a28 28 0 0 1 28-28z" fill="${fill}"/>
    <g stroke="${P.white}" stroke-width="7" stroke-linecap="round">
      <line x1="100" y1="66" x2="66" y2="108"/><line x1="100" y1="66" x2="134" y2="108"/><line x1="66" y1="108" x2="134" y2="108"/>
    </g>
    <g fill="${P.white}"><circle cx="100" cy="66" r="15"/><circle cx="66" cy="108" r="15"/><circle cx="134" cy="108" r="15"/></g>`;
  },
};

const svg = (inner, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" style="display:block;flex:none">${inner}</svg>`;

// ---------- Wordmarks ----------
// ink = { main, accent, rule }   mode = 'stacked' | 'horizontal' | 'inline'
const INK = {
  color: { main: C.navy, accent: C.blue, rule: C.sky },
  white: { main: C.white, accent: C.sky, rule: 'rgba(255,255,255,.45)' },
};
const FONT = "font-family:'Inter Display',Inter,sans-serif";

const duo = (mode, ink, o = {}) => {
  const st = mode === 'stacked';
  const fs = st ? o.fs || 62 : o.fsH || 60;
  return `<div style="${FONT};font-weight:${o.weight || 800};font-size:${fs}px;letter-spacing:${o.track || '0.015em'};
    line-height:.98;text-align:${st ? 'center' : 'left'};white-space:nowrap">
    <span style="color:${ink.main}">FREELANCE</span>${st ? ' ' : '<br>'}<span style="color:${ink.accent}">HUBS</span></div>`;
};

// One-line name, used for the inline lockup on every concept.
const line = (ink, o = {}) => `<div style="${FONT};font-size:${o.fs || 54}px;letter-spacing:${o.track || '0.03em'};white-space:nowrap;line-height:1">
  <span style="font-weight:${o.w1 || 800};color:${ink.main}">FREELANCE</span>
  <span style="font-weight:${o.w2 || 800};color:${ink.accent}">HUBS</span></div>`;

const concepts = [
  {
    id: '01-hub-h',
    name: 'Hub H',
    idea: 'The crossbar of the H is a hub node joining two stems.',
    mark: marks.hubH,
    line: {},
    word: (m, ink) => duo(m, ink, { fs: 64, fsH: 62 }),
  },
  {
    id: '02-forward-f',
    name: 'Forward F',
    idea: 'The F’s middle arm becomes an arrow breaking out of the circle.',
    mark: marks.forwardF,
    line: { w2: 600, track: '0.06em' },
    word: (m, ink) => `
      <div style="${FONT};text-align:${m === 'stacked' ? 'center' : 'left'};line-height:1;color:${ink.main};white-space:nowrap">
        <div style="font-weight:800;font-size:${m === 'stacked' ? 64 : 58}px;letter-spacing:.06em;margin-right:-.06em">FREELANCE</div>
        <div style="font-weight:700;font-size:${m === 'stacked' ? 40 : 36}px;letter-spacing:.62em;
          margin-right:${m === 'stacked' ? '-.62em' : '0'};margin-top:10px;color:${ink.accent}">HUBS</div>
      </div>`,
  },
  {
    id: '03-the-link',
    name: 'The Link',
    idea: 'Client and freelancer as two interlaced rings: a partnership.',
    mark: marks.link,
    line: { w1: 300, w2: 800 },
    word: (m, ink) => `
      <div style="${FONT};text-align:${m === 'stacked' ? 'center' : 'left'};line-height:1;white-space:nowrap">
        <div style="font-weight:300;font-size:${m === 'stacked' ? 66 : 60}px;letter-spacing:.02em;color:${ink.main}">FREELANCE</div>
        <div style="font-weight:800;font-size:${m === 'stacked' ? 66 : 60}px;letter-spacing:.02em;color:${ink.accent}">HUBS</div>
      </div>`,
  },
  {
    id: '04-core-cube',
    name: 'Core Cube',
    idea: 'Three faces of the work meet at one hub point.',
    mark: marks.cube,
    line: { w1: 700, w2: 800, track: '0.14em' },
    word: (m, ink) => `
      <div style="${FONT};text-align:${m === 'stacked' ? 'center' : 'left'};line-height:1;color:${ink.main};white-space:nowrap">
        <div style="font-weight:700;font-size:${m === 'stacked' ? 60 : 54}px;letter-spacing:.16em;margin-right:-.16em">FREELANCE</div>
        <div style="display:flex;align-items:center;gap:14px;margin-top:12px;${m === 'stacked' ? 'justify-content:center' : ''}">
          <span style="flex:${m === 'stacked' ? '0 0 64px' : '1'};height:4px;border-radius:2px;background:${ink.rule}"></span>
          <span style="font-weight:800;font-size:${m === 'stacked' ? 38 : 34}px;letter-spacing:.42em;margin-right:-.42em;color:${ink.accent}">HUBS</span>
          <span style="flex:${m === 'stacked' ? '0 0 64px' : '1'};height:4px;border-radius:2px;background:${ink.rule}"></span>
        </div>
      </div>`,
  },
  {
    id: '05-take-flight',
    name: 'Take Flight',
    idea: 'A faceted paper plane: the freedom to work from anywhere.',
    mark: marks.plane,
    line: { w1: 700, w2: 700 },
    word: (m, ink) => duo(m, ink, { fs: 66, fsH: 62, weight: 700, track: '0.01em' }),
  },
  {
    id: '06-talk-network',
    name: 'Talk Network',
    idea: 'A conversation bubble holding a connected team.',
    mark: marks.chat,
    line: {},
    word: (m, ink) => duo(m, ink, { fs: 64, fsH: 60 }),
  },
];

// Single-colour mark whose gaps are truly transparent (works on any background or texture).
const monoMark = (c, ink = '#FFFFFF') => {
  const id = `m${++uid}`;
  return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">
    <rect x="-20" y="-20" width="240" height="240" fill="black"/>${c.mark(mono('black', 'white'))}</mask></defs>
    <rect x="-20" y="-20" width="240" height="240" fill="${ink}" mask="url(#${id})"/>`;
};

// A full lockup as HTML. `zoom` scales the whole thing for small placements.
const lockup = (c, { mode = 'horizontal', P = COLOR, ink = INK.color, monoInk, icon, gap, zoom = 1 } = {}) => {
  const isStack = mode === 'stacked';
  const size = icon || (isStack ? 240 : mode === 'inline' ? 78 : 176);
  const g = gap ?? (isStack ? 40 : mode === 'inline' ? 22 : 36);
  const text = mode === 'inline' ? line(ink, c.line) : c.word(mode, ink);
  return `<div style="display:flex;align-items:center;justify-content:center;zoom:${zoom};
    flex-direction:${isStack ? 'column' : 'row'};gap:${g}px">${svg(monoInk ? monoMark(c, monoInk) : c.mark(P), size)}${text}</div>`;
};

module.exports = { C, COLOR, mono, monoMark, INK, marks, svg, concepts, lockup };
