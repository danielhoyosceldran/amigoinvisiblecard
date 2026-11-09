import { CELLS } from './cells.js';

const KEY = 'amigo-invisible:v1';

function empty() {
  return { name: '', cells: Object.fromEntries(CELLS.map((c) => [c.id, []])) };
}

export function load() {
  const base = empty();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!saved) return base;
    base.name = typeof saved.name === 'string' ? saved.name : '';
    for (const c of CELLS) {
      if (!Array.isArray(saved.cells?.[c.id])) continue;
      const ok = (it) =>
        it &&
        (c.kind === 'color'
          ? /^#[0-9a-f]{6}$/i.test(it.hex) && typeof it.name === 'string'
          : typeof it.text === 'string' || (typeof it.src === 'string' && it.src.startsWith('data:image/')));
      base.cells[c.id] = saved.cells[c.id].filter(ok).slice(0, 3);
    }
  } catch {
    // Sin almacenamiento disponible: se empieza en blanco.
  }
  return base;
}

// Devuelve false si el móvil no deja guardar (sin espacio o modo privado).
export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function reset() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nada que borrar
  }
  return empty();
}
