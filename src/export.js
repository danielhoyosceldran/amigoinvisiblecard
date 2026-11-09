import { CELLS, MAX_PER_CELL } from './cells.js';

// La imagen que se comparte: 1080×1560, el cartón entero con el nombre.

const W = 1080;
const H = 1560;
const C = {
  ink: '#2234a8',
  onInkSoft: '#c9d0f5',
  paper: '#ffffff',
  black: '#141414',
};
const NUM = "'Archivo Variable', 'Arial Narrow', sans-serif";
const TEXT = "'Atkinson Hyperlegible Next', system-ui, sans-serif";

function font(ctx, weight, px, family, condensed = false) {
  ctx.font = `${condensed ? 'extra-condensed ' : ''}${weight} ${px}px ${family}`;
  if ('fontStretch' in ctx) ctx.fontStretch = condensed ? 'extra-condensed' : 'normal';
}

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const sw = w / s;
  const sh = h / s;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

function wrap(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function dauber(ctx, cx, cy, r) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.25, r * 0.1, cx, cy, r);
  g.addColorStop(0, 'rgba(255,46,136,0.78)');
  g.addColorStop(0.8, 'rgba(255,46,136,0.9)');
  g.addColorStop(1, 'rgba(255,46,136,0.98)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, r, r * 0.95, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Sello de goma en tinta: anula sin tapar la foto.
function stampNo(ctx, cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.24);
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.85;
  font(ctx, 900, Math.round(size * 0.4), NUM, true);
  const tw = ctx.measureText('NO').width;
  const bw = tw + size * 0.14;
  const bh = size * 0.42;
  ctx.lineWidth = size * 0.026;
  ctx.strokeStyle = C.black;
  ctx.beginPath();
  ctx.roundRect(-bw / 2, -bh / 2, bw, bh, size * 0.05);
  ctx.stroke();
  ctx.fillStyle = C.black;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NO', 0, bh * 0.05);
  ctx.restore();
}

// Texto impreso en tinta dentro de su cuadrado, lo más grande que quepa.
function drawText(ctx, text, x, y, size) {
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3);
  const short = text.length <= 7;
  const pad = size * 0.09;
  const maxW = size - pad * 2;
  let px = short ? Math.round(size * 0.42) : 40;
  let lines;
  for (;;) {
    if (short) font(ctx, 900, px, NUM, true);
    else font(ctx, 700, px, TEXT);
    lines = wrap(ctx, short ? text.toUpperCase() : text, maxW);
    const fits = lines.length * px * 1.1 <= size - pad * 2 && lines.every((l) => ctx.measureText(l).width <= maxW);
    if (fits || px <= 16) break;
    px -= 2;
  }
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lh = px * 1.1;
  const top = y + size / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, n) => ctx.fillText(l, x + size / 2, top + n * lh + (short ? px * 0.06 : 0)));
}

function readable(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35 ? C.black : C.paper;
}

export async function renderBoard(state, year) {
  await Promise.all([
    document.fonts.load(`900 100px 'Archivo Variable'`),
    document.fonts.load(`700 30px 'Atkinson Hyperlegible Next'`),
  ]).catch(() => {});

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Fondo: tinta del cartón.
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, W, H);

  // Título: «El cartón de» + nombre.
  ctx.fillStyle = C.onInkSoft;
  font(ctx, 900, 56, NUM, true);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillText('EL CARTÓN DE', 40, 96);

  const name = (state.name || '').trim().toUpperCase() || 'ALGUIEN DE LA FAMILIA';
  let px = 132;
  font(ctx, 900, px, NUM, true);
  while (ctx.measureText(name).width > W - 80 && px > 56) {
    px -= 4;
    font(ctx, 900, px, NUM, true);
  }
  ctx.fillStyle = C.paper;
  ctx.fillText(name, 38, 96 + px * 0.9);

  // Cartón, con el borde de arriba troquelado.
  const card = { x: 32, y: 262, w: W - 64, h: 1226 };
  ctx.save();
  ctx.shadowColor = 'rgba(6, 12, 48, 0.45)';
  ctx.shadowOffsetY = 14;
  ctx.shadowBlur = 30;
  ctx.fillStyle = C.paper;
  ctx.beginPath();
  ctx.roundRect(card.x, card.y, card.w, card.h, [8, 8, 16, 16]);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = C.ink;
  for (let x = card.x + 18; x < card.x + card.w; x += 36) {
    ctx.beginPath();
    ctx.arc(x, card.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  const pad = 26;
  const gx = card.x + pad;
  const gy = card.y + pad + 8;
  const gw = card.w - pad * 2;
  const gh = card.h - pad * 2 - 8;
  const cw = gw / 3;
  const ch = gh / 3;

  const images = await Promise.all(
    CELLS.map((c) =>
      c.kind === 'color' ? [] : Promise.all(state.cells[c.id].map((it) => (it.text ? null : loadImg(it.src).catch(() => null)))),
    ),
  );

  CELLS.forEach((cell, i) => {
    const x = gx + (i % 3) * cw;
    const y = gy + Math.floor(i / 3) * ch;
    const inset = 12;
    const face = cw - inset * 2;
    const gap = 6;
    const qs = (face - gap) / 2;
    const fx = x + inset;
    const fy = y + inset;
    const quad = (k) => [fx + (k % 2) * (qs + gap), fy + Math.floor(k / 2) * (qs + gap)];
    const items = state.cells[cell.id];

    // Cuadrante 0: número impreso, con el marcador encima si la casilla está hecha.
    const [nx, ny] = quad(0);
    ctx.fillStyle = C.ink;
    font(ctx, 900, Math.round(qs * 0.8), NUM, true);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), nx + qs / 2, ny + qs / 2 + qs * 0.05);
    if (items.length) dauber(ctx, nx + qs / 2, ny + qs / 2, qs * 0.42);

    // Cuadrantes 1–3: fotos o colores, todos a la misma escala.
    // Orden de llenado: arriba derecha, abajo derecha, abajo izquierda.
    const SLOT = [1, 3, 2];
    for (let k = 0; k < MAX_PER_CELL; k++) {
      const [qx, qy] = quad(SLOT[k]);
      const it = items[k];
      if (!it) {
        // Cuadrante libre: papel en blanco.
      } else if (cell.kind === 'color') {
        ctx.fillStyle = it.hex;
        ctx.fillRect(qx, qy, qs, qs);
        ctx.strokeStyle = 'rgba(34,52,168,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(qx + 1, qy + 1, qs - 2, qs - 2);
        ctx.fillStyle = readable(it.hex);
        font(ctx, 800, 30, NUM, true);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        const lines = wrap(ctx, it.name.toUpperCase(), qs - 16).slice(0, 2);
        lines.forEach((l, n) => ctx.fillText(l, qx + qs / 2, qy + qs - 14 - (lines.length - 1 - n) * 30));
      } else if (it.text) {
        drawText(ctx, it.text, qx, qy, qs);
      } else {
        const img = images[i][k];
        if (img) drawCover(ctx, img, qx, qy, qs, qs);
      }
    }
    if (cell.id === 'no' && items.length) {
      // El sello cae sobre las fotos que hay, nunca sobre el número.
      const [sx, sy, ss] = [[0.75, 0.25, 0.45], [0.75, 0.5, 0.65], [0.6, 0.6, 0.8]][items.length - 1];
      stampNo(ctx, fx + face * sx, fy + face * sy, face * ss);
    }

    // Nombre de la casilla.
    ctx.fillStyle = C.ink;
    font(ctx, 700, 26, TEXT);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const lines = wrap(ctx, cell.short, cw - 24).slice(0, 2);
    const top = fy + face + (lines.length === 1 ? 44 : 32);
    lines.forEach((l, n) => ctx.fillText(l, x + cw / 2, top + n * 30));
  });

  // Rejilla impresa, con doble filete exterior.
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  for (let k = 1; k < 3; k++) {
    ctx.beginPath();
    ctx.moveTo(gx + cw * k, gy);
    ctx.lineTo(gx + cw * k, gy + gh);
    ctx.moveTo(gx, gy + ch * k);
    ctx.lineTo(gx + gw, gy + ch * k);
    ctx.stroke();
  }
  ctx.lineWidth = 5;
  ctx.strokeRect(gx, gy, gw, gh);
  ctx.lineWidth = 2;
  ctx.strokeRect(gx - 9, gy - 9, gw + 18, gh + 18);

  // Pie.
  ctx.fillStyle = C.onInkSoft;
  font(ctx, 700, 30, TEXT);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`Amigo invisible · Navidad ${year}`, 40, H - 26);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
}
