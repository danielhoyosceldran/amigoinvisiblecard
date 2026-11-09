// Copia las fotos al móvil como JPEG cuadrado de 480px. Así el cartón se
// guarda entre visitas y la imagen final se puede dibujar (las fotos de otras
// webs no se dejan dibujar en un canvas si no pasan por un proxy con CORS).

const SIZE = 480;

const proxied = (url) =>
  `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${SIZE}&h=${SIZE}&fit=cover&a=attention&output=jpg&q=82`;

function loadImage(src, cors = true) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    const t = setTimeout(() => reject(new Error('timeout')), 15000);
    img.onload = () => {
      clearTimeout(t);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(t);
      reject(new Error('load'));
    };
    img.src = src;
  });
}

function squareJpeg(img) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const side = Math.min(w, h);
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, SIZE, SIZE);
  return canvas.toDataURL('image/jpeg', 0.82);
}

export async function importFromWeb(hit) {
  const tries = [proxied(hit.src), hit.thumb && hit.thumb !== hit.src ? proxied(hit.thumb) : null, hit.src].filter(Boolean);
  for (const src of tries) {
    try {
      const img = await loadImage(src);
      return squareJpeg(img);
    } catch {
      // probamos la siguiente
    }
  }
  throw new Error('import');
}

export async function importFromFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url, false);
    return squareJpeg(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}
