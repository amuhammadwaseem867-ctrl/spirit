// Builds the FREELANCE HUBS client presentation: one board per concept + an overview board.
// Usage: node brand/freelance-hubs/presentation.cjs && python3 brand/freelance-hubs/make-pdf.py
// Output: presentation/board-*.png (4000x1886) -> FREELANCE-HUBS-Logo-Concepts.pdf
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { C, monoMark, INK, svg, concepts, lockup } = require('./concepts.cjs');

const W = 2000, H = 943, PANEL = 667;
const NAVY_BG = '#0C2A63';   // hero panel base; also the knockout colour of white marks on it
const LABEL = '#0F2E6B';     // woven label / dark card base
const GREY = '#E4E6EA';

const noise = (rgb, a) =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${rgb}  0 0 0 0 ${rgb}  0 0 0 0 ${rgb}  ${a} 0 0 0 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const denim = (a) => `repeating-linear-gradient(135deg, rgba(255,255,255,${a}) 0 1px, transparent 1px 5px)`;
const TEX_DARK = `${noise(1, 0.09)}, ${denim(0.03)}`;
const TEX_LIGHT = `${noise(0, 0.06)}`;

const icons = {
  phone: '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z"/>',
  mail: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4 7v1.8l8 5 8-5V7z"/>',
  web: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15 15 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8 8 0 0 1 0-4h3.4a16 16 0 0 0 0 4zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16zM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.4 6.7 8 8zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14 14 0 0 1 0-4h4.6a14 14 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6zm1.7-5.6a16 16 0 0 0 0-4h3.4a8 8 0 0 1 0 4z"/>',
  pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
};
const ico = (k) => `<svg viewBox="0 0 24 24" width="13" height="13" fill="${C.navy}">${icons[k]}</svg>`;

const css = `
  *{box-sizing:border-box} html,body{margin:0;padding:0}
  body{width:${W}px;height:${H}px;overflow:hidden;font-family:Inter,sans-serif;text-rendering:geometricPrecision}
  .board{position:relative;width:${W}px;height:${H}px;display:flex}
  .hero{width:${PANEL}px;height:100%;position:relative;display:flex;align-items:center;justify-content:center;
    background:${TEX_DARK}, radial-gradient(90% 70% at 28% 22%, #1A4FA8 0%, ${NAVY_BG} 62%, #081D47 100%)}
  .mid{width:${W - 2 * PANEL}px;height:100%;position:relative;background:${TEX_LIGHT}, ${GREY}}
  .right{width:${PANEL}px;height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:333px 1fr}
  .abs{position:absolute}
  .vline{position:absolute;width:1px;background:#6B7280}
  .hline{position:absolute;height:1px;background:#6B7280}
  .cross{position:absolute;width:22px;height:22px}
  .cross:before,.cross:after{content:"";position:absolute;background:#374151}
  .cross:before{left:10px;top:0;width:1.5px;height:22px}.cross:after{top:10px;left:0;height:1.5px;width:22px}
  .tile-dark{background:${TEX_DARK}, radial-gradient(80% 80% at 30% 20%, #34425C 0%, #1B2436 70%);display:flex;align-items:center;justify-content:center}
  .tile-light{background:${TEX_LIGHT}, radial-gradient(90% 90% at 60% 10%, #F4F5F7 0%, #DADDE3 100%);display:flex;align-items:center;justify-content:center}
  .badge{width:192px;height:192px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 35% 25%, #FFFFFF 0%, #E3E6EC 38%, #A9B0BD 100%);
    box-shadow:0 18px 30px rgba(0,0,0,.55), 0 4px 8px rgba(0,0,0,.4), inset 0 -6px 10px rgba(0,0,0,.18), inset 0 4px 6px rgba(255,255,255,.9)}
  .badge-in{width:150px;height:150px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 40% 30%, #1D4FA8 0%, ${LABEL} 70%);
    box-shadow:inset 0 6px 14px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.8)}
  .label{width:252px;height:158px;border-radius:14px;position:relative;display:flex;align-items:center;justify-content:center;
    background:${TEX_DARK}, radial-gradient(120% 120% at 20% 0%, #1D4FA8 0%, ${LABEL} 70%);
    box-shadow:0 14px 26px rgba(15,23,42,.35), 0 3px 6px rgba(15,23,42,.25)}
  .label:after{content:"";position:absolute;inset:10px;border:1.6px dashed rgba(255,255,255,.75);border-radius:8px}
  .cards{grid-column:1 / span 2;position:relative;overflow:hidden;background:${TEX_LIGHT}, linear-gradient(160deg,#EDEFF3 0%,#D7DBE2 100%)}
  .card{position:absolute;width:440px;height:252px;border-radius:6px;overflow:hidden}
  .card.back{left:46px;top:58px;transform:rotate(-5deg);
    background:${TEX_DARK}, linear-gradient(135deg, #17469A 0%, ${LABEL} 55%, #091E4A 100%);
    box-shadow:0 26px 40px rgba(15,23,42,.35), 0 6px 12px rgba(15,23,42,.25)}
  .card.front{left:192px;top:282px;transform:rotate(3.2deg);background:#FBFBFC;border-right:7px solid ${C.navy};
    box-shadow:0 26px 42px rgba(15,23,42,.32), 0 6px 12px rgba(15,23,42,.2)}
  .wm{position:absolute;opacity:.07}
  .ov{background:${TEX_LIGHT}, ${GREY}}
`;

const heroPanel = (c) => `<div class="hero">${svg(monoMark(c), 200)}</div>`;

const midPanel = (c) => `<div class="mid">
  <div class="abs" style="left:53px;top:238px;width:12px;height:62px;background:${C.navy}"></div>
  <div class="abs" style="left:602px;top:239px;width:11px;height:11px;border-radius:50%;background:${C.navy}"></div>
  <div class="abs" style="left:602px;top:272px;width:11px;height:11px;border-radius:50%;border:1.5px solid ${C.navy}"></div>
  <div class="abs" style="left:602px;top:289px;width:11px;height:11px;border-radius:50%;background:${C.navy}"></div>
  <div class="vline" style="left:59px;top:370px;height:505px"></div>
  <div class="vline" style="left:607px;top:370px;height:505px"></div>
  <div class="hline" style="left:24px;top:713px;width:92px"></div><div class="cross" style="left:49px;top:703px"></div>
  <div class="hline" style="left:550px;top:713px;width:92px"></div><div class="cross" style="left:596px;top:703px"></div>
  <div class="cross" style="left:49px;top:880px"></div><div class="cross" style="left:596px;top:880px"></div>
  <div class="abs" style="left:0;right:0;top:${436 - 48}px;height:96px;display:flex;justify-content:center;align-items:center">
    ${lockup(c, { mode: 'horizontal', zoom: 0.5 })}</div>
  <div class="abs" style="left:0;right:0;top:${617 - 30}px;height:60px;display:flex;justify-content:center;align-items:center">
    ${lockup(c, { mode: 'inline', zoom: 0.6 })}</div>
</div>`;

const contact = (k, t) => `<div style="display:flex;align-items:center;gap:8px;height:19px">${ico(k)}<span>${t}</span></div>`;

const rightPanel = (c) => `<div class="right">
  <div class="tile-dark"><div class="badge"><div class="badge-in">${svg(monoMark(c), 84)}</div></div></div>
  <div class="tile-light"><div class="label">${lockup(c, { mode: 'horizontal', monoInk: '#FFFFFF', ink: INK.white, zoom: 0.31 })}</div></div>
  <div class="cards">
    <div class="card back">
      <div class="wm" style="right:-70px;top:40px">${svg(monoMark(c), 300)}</div>
      <div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center">
        ${lockup(c, { mode: 'inline', monoInk: '#FFFFFF', ink: INK.white, zoom: 0.46 })}</div>
    </div>
    <div class="card front">
      <div class="wm" style="right:-60px;top:-40px;opacity:.04">${svg(monoMark(c, C.navy), 250)}</div>
      <div class="abs" style="left:26px;top:24px">${lockup(c, { mode: 'horizontal', zoom: 0.2 })}</div>
      <div class="abs" style="left:26px;top:170px;color:${C.navy}">
        <div style="font-family:'Inter Display',Inter;font-weight:700;font-size:18px">[Your Name]</div>
        <div style="font-size:7.5px;letter-spacing:.22em;margin-top:3px;color:#475569">[DESIGNATION]</div>
        <div style="width:30px;height:2px;background:${C.blue};margin-top:10px"></div>
      </div>
      <div class="abs" style="left:262px;top:160px;padding-left:16px;border-left:1px solid #CBD5E1;font-size:9.5px;color:#334155">
        ${contact('phone', '[Phone number]')}${contact('mail', '[Email address]')}${contact('web', '[Website]')}${contact('pin', '[Office address, City]')}
      </div>
    </div>
  </div>
</div>`;

const board = (c) => `<div class="board">${heroPanel(c)}${midPanel(c)}${rightPanel(c)}</div>`;

const overview = () => `<div class="board">
  <div class="hero" style="display:grid;grid-template-columns:repeat(3,120px);gap:72px 64px;align-content:center;justify-content:center">
    ${concepts.map((c) => svg(monoMark(c), 120)).join('')}
  </div>
  <div class="ov" style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:252px;
    gap:22px;padding:0 52px;align-content:center">
    ${concepts.map((c) => `<div style="background:#fff;display:flex;align-items:center;justify-content:center;position:relative">
        ${lockup(c, { mode: 'horizontal', zoom: 0.36 })}
        <span style="position:absolute;left:16px;top:12px;font:600 11px Inter;letter-spacing:.16em;color:#94A3B8">${c.id.slice(0, 2)}</span>
      </div>`).join('')}
  </div>
</div>`;

const html = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

(async () => {
  const out = path.join(__dirname, 'presentation');
  fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(out)) fs.unlinkSync(path.join(out, f));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: W, height: H } });
  const p = await ctx.newPage();
  const pages = [...concepts.map((c) => [`board-${c.id}`, board(c)]), ['board-07-overview', overview()]];
  for (const [name, body] of pages) {
    await p.setContent(html(body));
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, `${name}.png`) });
  }
  await browser.close();
  console.log('rendered', pages.length, 'boards');
})();
