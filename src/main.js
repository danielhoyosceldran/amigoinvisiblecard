import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/atkinson-hyperlegible-next/400.css';
import '@fontsource/atkinson-hyperlegible-next/700.css';
import './styles.css';

import { CELLS, MAX_PER_CELL, SWATCHES } from './cells.js';
import { load, save, reset } from './store.js';
import { searchImages, providerLabel } from './search.js';
import { importFromWeb, importFromFile } from './images.js';
import { renderBoard as composeImage } from './export.js';
import { icon } from './icons.js';

const now = new Date();
const YEAR = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

let state = load();

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

const filledCount = () => CELLS.filter((c) => state.cells[c.id].length > 0).length;
const nextEmpty = () => CELLS.find((c) => state.cells[c.id].length === 0);
const cellIndex = (id) => CELLS.findIndex((c) => c.id === id);

// ---------------------------------------------------------------------------
// Esqueleto

const app = document.querySelector('#app');
app.innerHTML = `
  <header class="band">
    <div class="band-row">
      <h1 class="title">Amigo invisible <span class="title-year">Navidad ${YEAR}</span></h1>
      <p class="count" id="count"></p>
    </div>
    <div class="call" id="call"></div>
  </header>

  <main class="sheet">
    <section class="carton" aria-labelledby="carton-label">
      <div class="carton-head">
        <label id="carton-label" for="name">Cartón de</label>
        <input id="name" class="carton-name" type="text" maxlength="40" autocomplete="given-name"
          autocapitalize="words" enterkeyhint="done" placeholder="tu nombre" />
      </div>
      <ol class="grid" id="grid"></ol>
    </section>
    <p class="how" id="how"></p>
  </main>

  <footer class="foot">
    <p>Lo que eliges se guarda solo en este móvil.</p>
    <button type="button" class="link" id="reset">Empezar de nuevo</button>
  </footer>

  <dialog id="editor" class="editor" aria-labelledby="ed-title"></dialog>
  <dialog id="share" class="sheet-dialog" aria-labelledby="share-title"></dialog>
  <dialog id="confirm" class="sheet-dialog confirm" aria-labelledby="confirm-title"></dialog>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

const $ = (sel, root = document) => root.querySelector(sel);
const grid = $('#grid');
const call = $('#call');
const count = $('#count');
const how = $('#how');
const nameInput = $('#name');
const editor = $('#editor');
const share = $('#share');
const confirmDlg = $('#confirm');
const toastEl = $('#toast');

function persist() {
  if (!save(state)) toast('El móvil no deja guardar más fotos. Quita alguna o usa menos fotos por casilla.');
}

let toastTimer;
function toast(msg) {
  // Dentro del diálogo abierto, para que no quede detrás de él.
  (openDlg || document.body).append(toastEl);
  toastEl.textContent = msg;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 4200);
}

// ---------------------------------------------------------------------------
// Cartón

function faceHTML(cell, i) {
  const items = state.cells[cell.id];
  if (!items.length) return `<span class="num-big" aria-hidden="true">${i + 1}</span>`;

  // 2×2 de cuadrados iguales: el número impreso (con el marcador encima) y hasta tres fotos o colores,
  // que se colocan arriba a la derecha, abajo a la derecha y abajo a la izquierda.
  const quads = [];
  for (let k = 0; k < MAX_PER_CELL; k++) {
    const it = items[k];
    if (!it) quads.push('<span class="q q-free"></span>');
    else if (cell.kind === 'color') quads.push(`<span class="q" style="background:${esc(it.hex)}"></span>`);
    else if (it.text) quads.push(`<span class="q q-text" data-len="${textSize(it.text)}"><span>${esc(it.text)}</span></span>`);
    else quads.push(`<span class="q"><img src="${it.src}" alt="" /></span>`);
  }
  return `<span class="quads" aria-hidden="true">
    <span class="q q-num"><span class="num">${i + 1}</span><span class="dot"></span></span>
    ${quads.join('')}
  </span>${cell.id === 'no' ? `<span class="stamp" data-n="${items.length}" aria-hidden="true">NO</span>` : ''}`;
}

// Color de texto legible sobre un color elegido.
function inkOn(hex) {
  const n = parseInt(hex.slice(1), 16);
  const lum = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    })
    .reduce((acc, v, k) => acc + v * [0.2126, 0.7152, 0.0722][k], 0);
  return lum > 0.35 ? '#141414' : '#ffffff';
}

// Los textos cortos se imprimen más grandes en su cuadrado.
const textSize = (t) => (t.length <= 7 ? 'l' : t.length <= 16 ? 'm' : 's');

const TEXT_MAX = 40;

function cellLabel(cell, i) {
  const items = state.cells[cell.id];
  let status = 'Vacía. Toca para elegir.';
  if (items.length && cell.kind === 'color') {
    status = `${items.map((c) => c.name).join(', ')}. Toca para cambiar.`;
  } else if (items.length) {
    const photos = items.filter((it) => !it.text).length;
    const texts = items.filter((it) => it.text).map((it) => `«${it.text}»`);
    const parts = [];
    if (photos) parts.push(`${photos} foto${photos > 1 ? 's' : ''}`);
    if (texts.length) parts.push(texts.join(', '));
    status = `${parts.join(' y ')}. Toca para cambiar.`;
  }
  return `${i + 1}. ${cell.title}. ${status}`;
}

function renderBoard({ stamp } = {}) {
  const next = nextEmpty();
  grid.innerHTML = CELLS.map((cell, i) => {
    const filled = state.cells[cell.id].length > 0;
    const cls = [
      'cell',
      filled ? 'is-filled' : 'is-empty',
      next?.id === cell.id ? 'is-next' : '',
      cell.id === 'no' ? 'is-no' : '',
      stamp === cell.id ? 'is-stamping' : '',
    ].join(' ');
    return `<li class="${cls}">
      <button type="button" class="cell-btn" data-cell="${cell.id}" aria-label="${esc(cellLabel(cell, i))}">
        <span class="cell-face">${faceHTML(cell, i)}</span>
        <span class="cell-label">${esc(cell.short)}</span>
      </button>
    </li>`;
  }).join('');

  const n = filledCount();
  how.textContent = next
    ? 'Toca cada casilla y elige hasta tres fotos de lo que te gusta. Cuando estén las nueve, aparecerá el botón ¡Bingo! para crear tu imagen y mandarla a la familia.'
    : '¡Cartón completo! Toca ¡Bingo! para crear tu imagen y mandarla a la familia. Puedes seguir cambiando casillas cuando quieras.';
  count.innerHTML = `<b>${n}</b> de 9`;
  count.setAttribute('aria-label', `${n} de 9 casillas completas`);

  const wasBingo = call.dataset.state === 'bingo';
  if (next) {
    const i = cellIndex(next.id);
    call.dataset.state = 'next';
    call.innerHTML = `<button type="button" class="next-sign" data-cell="${next.id}">
      <span class="next-text">${n === 0 ? 'Empieza por la casilla' : 'Ahora toca la casilla'}</span>
      <span class="next-num">${i + 1}</span>
      <span class="next-name">${esc(next.short)}</span>
      ${icon('arrow', 'icon next-arrow')}
    </button>`;
  } else {
    call.dataset.state = 'bingo';
    call.innerHTML = `<button type="button" class="bingo ${wasBingo ? '' : 'is-arriving'}" id="bingo">
      <span class="bingo-word">¡Bingo!</span>
      <span class="bingo-sub">Crear mi imagen</span>
    </button>`;
  }
}

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cell]');
  if (btn) openEditor(btn.dataset.cell);
});
call.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cell]');
  if (btn) openEditor(btn.dataset.cell);
  if (e.target.closest('#bingo')) openShare();
});

nameInput.value = state.name;
nameInput.addEventListener('input', () => {
  state.name = nameInput.value;
  persist();
});
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') nameInput.blur();
});

// ---------------------------------------------------------------------------
// Diálogos: el botón "atrás" del móvil cierra el diálogo en vez de salir.

let openDlg = null;

function openDialog(dlg) {
  openDlg = dlg;
  dlg.showModal();
  document.documentElement.classList.add('has-dialog');
  history.pushState({ dlg: dlg.id }, '');
}

function requestClose() {
  if (!openDlg) return;
  if (history.state?.dlg) history.back();
  else finishClose();
}

function finishClose() {
  const dlg = openDlg;
  if (!dlg) return;
  openDlg = null;
  dlg.close();
  document.documentElement.classList.remove('has-dialog');
  dlg.dispatchEvent(new CustomEvent('closed'));
}

window.addEventListener('popstate', () => {
  if (openDlg) finishClose();
});

for (const dlg of [editor, share, confirmDlg]) {
  dlg.addEventListener('cancel', (e) => {
    e.preventDefault();
    requestClose();
  });
  dlg.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) requestClose();
  });
}

// ---------------------------------------------------------------------------
// Editor de casilla

let ed = null; // { cell, wasFilled, results, status, query, busy:Set }

function openEditor(id) {
  const cell = CELLS.find((c) => c.id === id);
  ed = { cell, wasFilled: state.cells[id].length > 0, results: [], status: 'idle', query: '', busy: new Set() };
  editor.classList.toggle('is-color', cell.kind === 'color');
  editor.innerHTML = cell.kind === 'color' ? colorEditorHTML() : photoEditorHTML();
  renderPicked();
  if (cell.kind === 'color') renderSwatches();
  else renderResults();
  openDialog(editor);
  $('.ed-scroll', editor).scrollTop = 0;
}

editor.addEventListener('closed', () => {
  if (!ed) return;
  const id = ed.cell.id;
  const nowFilled = state.cells[id].length > 0;
  renderBoard({ stamp: !ed.wasFilled && nowFilled ? id : undefined });
  const btn = grid.querySelector(`[data-cell="${id}"]`);
  btn?.focus({ preventScroll: true });
  btn?.closest('.cell')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  ed = null;
});

function edHead() {
  const i = cellIndex(ed.cell.id);
  return `
    <div class="ed-bar">
      <button type="button" class="ed-back" data-close>${icon('back')}<span>Volver al cartón</span></button>
    </div>
    <div class="ed-head">
      <span class="ed-num" aria-hidden="true">${i + 1}</span>
      <div>
        <h2 id="ed-title" class="ed-title">${esc(ed.cell.title)}</h2>
        <p class="ed-hint">${esc(ed.cell.hint)}</p>
      </div>
    </div>`;
}

function photoEditorHTML() {
  const ideas = ed.cell.ideas.map((t) => `<li><button type="button" class="idea" data-idea="${esc(t)}">${esc(t)}</button></li>`).join('');
  const textIdeas = ed.cell.ideas.map((t) => `<li><button type="button" class="idea" data-idea-text="${esc(t)}">${icon('plus')}${esc(t)}</button></li>`).join('');
  return `
    <div class="ed">
      <div class="ed-scroll">
        ${edHead()}
        <section class="picked" aria-labelledby="picked-title">
          <h3 class="picked-title" id="picked-title"></h3>
          <ul class="slots" id="slots"></ul>
        </section>

        <div class="modes" role="group" aria-label="Qué quieres poner">
          <button type="button" class="mode" data-mode="photo" aria-pressed="true">${icon('search')}<span>Buscar una foto</span></button>
          <button type="button" class="mode" data-mode="text" aria-pressed="false">${icon('edit')}<span>Escribir un texto</span></button>
        </div>

        <div class="panel-text" id="panel-text" hidden>
          <form class="finder" id="writer">
            <label class="finder-label" for="t">Escríbelo con tus palabras</label>
            <div class="finder-row">
              <input id="t" class="finder-input" type="text" maxlength="${TEXT_MAX}" enterkeyhint="done" autocomplete="off"
                autocapitalize="sentences" placeholder="Por ejemplo: ${esc(ed.cell.ideas[1])}" />
              <button type="submit" class="btn btn-ink finder-go">${icon('plus')}<span>Poner</span></button>
            </div>
            <p class="writer-help">Hasta ${TEXT_MAX} letras. Saldrá escrito en tu casilla.</p>
          </form>
          <div class="ideas">
            <p class="ideas-title">O toca una idea para ponerla tal cual:</p>
            <ul class="ideas-list">${textIdeas}</ul>
          </div>
        </div>

        <div class="panel-photo" id="panel-photo">
        <form class="finder" id="finder" role="search">
          <label class="finder-label" for="q">Busca fotos</label>
          <div class="finder-row">
            <input id="q" class="finder-input" type="search" enterkeyhint="search" autocomplete="off"
              placeholder="Por ejemplo: ${esc(ed.cell.ideas[0])}" />
            <button type="submit" class="btn btn-ink finder-go">${icon('search')}<span>Buscar</span></button>
          </div>
        </form>

        <div class="ideas">
          <p class="ideas-title">O toca una idea:</p>
          <ul class="ideas-list">${ideas}</ul>
        </div>

        <div class="results" id="results" aria-live="polite"></div>

        <div class="own">
          <p class="own-text">¿Tienes la foto en el móvil?</p>
          <label class="btn btn-line own-btn">
            ${icon('camera')}<span>Usar una foto de mi móvil</span>
            <input type="file" accept="image/*" class="own-input" id="own" />
          </label>
        </div>
        </div>
      </div>
      <div class="ed-foot">
        <button type="button" class="btn btn-ink btn-big" data-close>${icon('check')}<span>Listo</span></button>
      </div>
    </div>`;
}

function colorEditorHTML() {
  return `
    <div class="ed">
      <div class="ed-scroll">
        ${edHead()}
        <section class="picked" aria-labelledby="picked-title">
          <h3 class="picked-title" id="picked-title"></h3>
          <ul class="slots slots-color" id="slots"></ul>
        </section>
        <ul class="swatches" id="swatches" aria-label="Colores"></ul>
        <div class="own">
          <p class="own-text">¿No está tu tono?</p>
          <label class="btn btn-line own-btn">
            ${icon('palette')}<span>Elegir otro color</span>
            <input type="color" class="own-input" id="custom" value="#2234a8" />
          </label>
        </div>
      </div>
      <div class="ed-foot">
        <button type="button" class="btn btn-ink btn-big" data-close>${icon('check')}<span>Listo</span></button>
      </div>
    </div>`;
}

function renderPicked() {
  const items = state.cells[ed.cell.id];
  const isColor = ed.cell.kind === 'color';
  const word = isColor ? 'colores' : 'fotos o textos';
  $('#picked-title', editor).textContent = items.length
    ? `Lo que has puesto: ${items.length} de ${MAX_PER_CELL}`
    : `Aún no hay nada. Puedes poner hasta ${MAX_PER_CELL} ${word}.`;

  const slots = [];
  for (let k = 0; k < MAX_PER_CELL; k++) {
    const it = items[k];
    if (!it) {
      slots.push(`<li class="slot is-free"><span>${k + 1}</span></li>`);
    } else if (isColor) {
      slots.push(`<li class="slot slot-color" style="--c:${esc(it.hex)};--on:${inkOn(it.hex)}">
        <span class="slot-name">${esc(it.name)}</span>
        <button type="button" class="slot-remove" data-remove="${k}" aria-label="Quitar ${esc(it.name)}">${icon('close')}<span>Quitar</span></button>
      </li>`);
    } else if (it.text) {
      slots.push(`<li class="slot slot-text" data-len="${textSize(it.text)}">
        <span class="slot-text-in">${esc(it.text)}</span>
        ${ed.cell.id === 'no' ? '<span class="stamp">NO</span>' : ''}
        <button type="button" class="slot-remove" data-remove="${k}" aria-label="Quitar «${esc(it.text)}»">${icon('close')}<span>Quitar</span></button>
      </li>`);
    } else {
      slots.push(`<li class="slot">
        <img src="${it.src}" alt="Foto ${k + 1}" />
        ${ed.cell.id === 'no' ? '<span class="stamp">NO</span>' : ''}
        <button type="button" class="slot-remove" data-remove="${k}" aria-label="Quitar foto ${k + 1}">${icon('close')}<span>Quitar</span></button>
      </li>`);
    }
  }
  $('#slots', editor).innerHTML = slots.join('');
}

function isPicked(hit) {
  return state.cells[ed.cell.id].some((it) => it.ref === hit.src);
}

function renderResults() {
  const box = $('#results', editor);
  if (!box) return;
  if (ed.status === 'idle') {
    box.innerHTML = '';
    return;
  }
  if (ed.status === 'loading') {
    box.innerHTML = `<p class="results-msg is-loading">${icon('search')}Buscando fotos de «${esc(ed.query)}»…</p>`;
    return;
  }
  if (ed.status === 'error') {
    box.innerHTML = `<div class="results-msg">
      <p>No hemos podido buscar. Revisa que tienes internet y vuelve a probar.</p>
      <button type="button" class="btn btn-line" data-retry>Volver a buscar</button>
    </div>`;
    return;
  }
  if (ed.status === 'empty') {
    box.innerHTML = `<p class="results-msg">No hay fotos para «${esc(ed.query)}». Prueba con otra palabra más sencilla.</p>`;
    return;
  }
  const full = state.cells[ed.cell.id].length >= MAX_PER_CELL;
  box.innerHTML = `
    <p class="results-head">Toca una foto para ponerla en tu casilla. ${full ? '<b>Ya tienes 3: quita una para poner otra.</b>' : ''}</p>
    <ul class="hits">${ed.results
      .map((hit, k) => {
        const on = isPicked(hit);
        const busy = ed.busy.has(k);
        return `<li><button type="button" class="hit ${on ? 'is-on' : ''} ${busy ? 'is-busy' : ''}" data-hit="${k}"
          aria-pressed="${on}" aria-label="${esc(hit.title || `Foto ${k + 1}`)}${on ? ', elegida' : ''}">
          <img src="${esc(hit.thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer" />
          <span class="hit-mark">${icon('check')}</span>
        </button></li>`;
      })
      .join('')}</ul>
    <p class="results-credit">${esc(providerLabel)}</p>`;

  box.querySelectorAll('.hit img').forEach((img) => {
    img.addEventListener('error', () => img.closest('li')?.remove(), { once: true });
  });
}

async function runSearch(query) {
  query = query.trim();
  if (!query) {
    $('#q', editor)?.focus();
    toast('Escribe primero qué quieres buscar.');
    return;
  }
  ed.query = query;
  ed.status = 'loading';
  ed.busy.clear();
  renderResults();
  const token = (ed.token = Symbol());
  try {
    const hits = await searchImages(query);
    if (!ed || ed.token !== token) return;
    ed.results = hits;
    ed.status = hits.length ? 'done' : 'empty';
  } catch {
    if (!ed || ed.token !== token) return;
    ed.status = 'error';
  }
  renderResults();
}

editor.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.id === 'writer') {
    const input = $('#t', editor);
    if (addText(input.value)) input.value = '';
    return;
  }
  const input = $('#q', editor);
  input.blur();
  runSearch(input.value);
});

function setMode(mode) {
  editor.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  $('#panel-photo', editor).hidden = mode !== 'photo';
  $('#panel-text', editor).hidden = mode !== 'text';
  if (mode === 'text') $('#t', editor).focus();
}

function addText(raw) {
  const text = raw.replace(/\s+/g, ' ').trim().slice(0, TEXT_MAX);
  const list = state.cells[ed.cell.id];
  if (!text) {
    $('#t', editor)?.focus();
    toast('Escribe primero lo que quieres poner.');
    return false;
  }
  if (list.some((it) => it.text?.toLowerCase() === text.toLowerCase())) {
    toast('Eso ya está en tu casilla.');
    return false;
  }
  if (list.length >= MAX_PER_CELL) {
    toast('Ya tienes 3 cosas en esta casilla. Quita una para poner otra.');
    return false;
  }
  list.push({ text, ref: `text:${text.toLowerCase()}` });
  persist();
  renderPicked();
  renderResults();
  renderBoard();
  $('.ed-scroll', editor).scrollTo({ top: 0, behavior: 'smooth' });
  return true;
}

editor.addEventListener('click', async (e) => {
  if (!ed) return;
  const mode = e.target.closest('[data-mode]');
  if (mode) {
    setMode(mode.dataset.mode);
    return;
  }
  const ideaText = e.target.closest('[data-idea-text]');
  if (ideaText) {
    addText(ideaText.dataset.ideaText);
    return;
  }
  const idea = e.target.closest('[data-idea]');
  if (idea) {
    $('#q', editor).value = idea.dataset.idea;
    runSearch(idea.dataset.idea);
    $('#results', editor).scrollIntoView({ block: 'start', behavior: 'smooth' });
    return;
  }
  if (e.target.closest('[data-retry]')) {
    runSearch(ed.query);
    return;
  }
  const rm = e.target.closest('[data-remove]');
  if (rm) {
    state.cells[ed.cell.id].splice(Number(rm.dataset.remove), 1);
    persist();
    renderPicked();
    if (ed.cell.kind === 'color') renderSwatches();
    else renderResults();
    renderBoard();
    return;
  }
  const hitBtn = e.target.closest('[data-hit]');
  if (hitBtn) await toggleHit(Number(hitBtn.dataset.hit));
  const sw = e.target.closest('[data-swatch]');
  if (sw) toggleColor(SWATCHES[Number(sw.dataset.swatch)]);
});

async function toggleHit(k) {
  const hit = ed.results[k];
  const list = state.cells[ed.cell.id];
  if (!hit || ed.busy.has(k)) return;
  const at = list.findIndex((it) => it.ref === hit.src);
  if (at >= 0) {
    list.splice(at, 1);
    persist();
    renderPicked();
    renderResults();
    renderBoard();
    return;
  }
  if (list.length + ed.busy.size >= MAX_PER_CELL) {
    toast('Ya tienes 3 cosas en esta casilla. Quita una para poner otra.');
    return;
  }
  const cellId = ed.cell.id;
  ed.busy.add(k);
  renderResults();
  try {
    const src = await importFromWeb(hit);
    const target = state.cells[cellId];
    if (target.length < MAX_PER_CELL) {
      target.push({ src, ref: hit.src });
      persist();
    }
  } catch {
    toast('Esa foto no se deja copiar. Prueba con otra.');
  }
  if (ed?.cell.id === cellId) {
    ed.busy.delete(k);
    renderPicked();
    renderResults();
  }
  renderBoard();
}

editor.addEventListener('change', async (e) => {
  if (!ed) return;
  if (e.target.id === 'own') {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const list = state.cells[ed.cell.id];
    if (list.length >= MAX_PER_CELL) {
      toast('Ya tienes 3 cosas en esta casilla. Quita una para poner otra.');
      return;
    }
    try {
      const src = await importFromFile(file);
      list.push({ src, ref: `file:${file.name}:${file.size}` });
      persist();
      renderPicked();
      renderResults();
      renderBoard();
    } catch {
      toast('No hemos podido abrir esa foto. Prueba con otra.');
    }
  }
  if (e.target.id === 'custom') {
    toggleColor({ hex: e.target.value, name: 'Mi tono' }, true);
  }
});

function renderSwatches() {
  const list = state.cells[ed.cell.id];
  $('#swatches', editor).innerHTML = SWATCHES.map((s, k) => {
    const on = list.some((c) => c.hex === s.hex);
    return `<li><button type="button" class="sw ${on ? 'is-on' : ''}" data-swatch="${k}" aria-pressed="${on}" style="--c:${s.hex}">
      <span class="sw-chip">${icon('check')}</span><span class="sw-name">${s.name}</span>
    </button></li>`;
  }).join('');
}

function toggleColor(sw, custom = false) {
  const list = state.cells[ed.cell.id];
  const at = list.findIndex((c) => c.hex.toLowerCase() === sw.hex.toLowerCase());
  if (at >= 0 && !custom) list.splice(at, 1);
  else if (at < 0) {
    if (list.length >= MAX_PER_CELL) {
      toast('Ya tienes 3 colores. Quita uno para poner otro.');
      return;
    }
    list.push({ hex: sw.hex, name: sw.name });
  }
  persist();
  renderPicked();
  renderSwatches();
  renderBoard();
}

// ---------------------------------------------------------------------------
// Imagen final

let shareUrl = null;
let shareFile = null;

function openShare() {
  if (!state.name.trim()) shareNameStep();
  else buildImage();
  openDialog(share);
}

share.addEventListener('closed', () => {
  if (shareUrl) URL.revokeObjectURL(shareUrl);
  shareUrl = null;
  shareFile = null;
});

function shareNameStep() {
  share.innerHTML = `
    <div class="sd">
      <h2 class="sd-title" id="share-title">¿Cómo te llamas?</h2>
      <p class="sd-text">Tu nombre saldrá en la imagen para que la familia sepa de quién es el cartón.</p>
      <form id="share-name" class="sd-form">
        <label class="finder-label" for="share-name-input">Tu nombre</label>
        <input id="share-name-input" class="finder-input" type="text" maxlength="40" autocomplete="given-name" autocapitalize="words" enterkeyhint="done" required />
        <button type="submit" class="btn btn-call btn-big">Crear mi imagen</button>
      </form>
      <button type="button" class="link sd-back" data-close>Volver al cartón</button>
    </div>`;
}

share.addEventListener('submit', (e) => {
  if (e.target.id !== 'share-name') return;
  e.preventDefault();
  const v = $('#share-name-input', share).value.trim();
  if (!v) {
    toast('Escribe tu nombre para seguir.');
    return;
  }
  state.name = v;
  nameInput.value = v;
  persist();
  buildImage();
});

async function buildImage() {
  share.innerHTML = `
    <div class="sd">
      <h2 class="sd-title" id="share-title">Preparando tu imagen…</h2>
      <div class="sd-preview is-loading" aria-hidden="true"></div>
    </div>`;
  try {
    const blob = await composeImage(state, YEAR);
    if (!openDlg) return;
    const slug = state.name.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'familia';
    shareFile = new File([blob], `carton-amigo-invisible-${slug}.jpg`, { type: 'image/jpeg' });
    shareUrl = URL.createObjectURL(blob);
    const canShare = !!navigator.canShare?.({ files: [shareFile] });
    share.innerHTML = `
      <div class="sd">
        <h2 class="sd-title" id="share-title">¡Bingo, ${esc(state.name.trim())}!</h2>
        <p class="sd-text">Esta es tu imagen. Mándala al grupo de la familia para que quien te toque sepa qué regalarte.</p>
        <img class="sd-preview" src="${shareUrl}" alt="Tu cartón del amigo invisible con las nueve casillas" />
        <div class="sd-actions">
          ${canShare ? `<button type="button" class="btn btn-call btn-big" id="do-share">${icon('share')}<span>Compartir</span></button>` : ''}
          <a class="btn ${canShare ? 'btn-line' : 'btn-call btn-big'}" id="do-save" href="${shareUrl}" download="${shareFile.name}">${icon('download')}<span>Guardar en el móvil</span></a>
        </div>
        <button type="button" class="link sd-back" data-close>Volver al cartón para cambiar algo</button>
      </div>`;
  } catch {
    share.innerHTML = `
      <div class="sd">
        <h2 class="sd-title" id="share-title">No se ha podido crear la imagen</h2>
        <p class="sd-text">Vuelve a intentarlo. Si sigue sin salir, cierra la página y ábrela otra vez: tu cartón está guardado.</p>
        <div class="sd-actions">
          <button type="button" class="btn btn-call btn-big" id="retry-image">Intentar otra vez</button>
        </div>
        <button type="button" class="link sd-back" data-close>Volver al cartón</button>
      </div>`;
  }
}

share.addEventListener('click', async (e) => {
  if (e.target.closest('#retry-image')) buildImage();
  if (e.target.closest('#do-share') && shareFile) {
    try {
      await navigator.share({ files: [shareFile], title: 'Mi cartón del amigo invisible' });
    } catch (err) {
      if (err?.name !== 'AbortError') toast('No se ha podido compartir. Usa «Guardar en el móvil» y mándala desde tus fotos.');
    }
  }
});

// ---------------------------------------------------------------------------
// Empezar de nuevo

$('#reset').addEventListener('click', () => {
  confirmDlg.innerHTML = `
    <div class="sd">
      <h2 class="sd-title" id="confirm-title">¿Borrar todo el cartón?</h2>
      <p class="sd-text">Se quitarán tu nombre, todas tus fotos y tus colores de este móvil. No se puede deshacer.</p>
      <div class="sd-actions">
        <button type="button" class="btn btn-danger btn-big" id="confirm-yes">Sí, borrar todo</button>
        <button type="button" class="btn btn-line" data-close>No, dejarlo como está</button>
      </div>
    </div>`;
  openDialog(confirmDlg);
});

confirmDlg.addEventListener('click', (e) => {
  if (!e.target.closest('#confirm-yes')) return;
  state = reset();
  nameInput.value = '';
  requestClose();
  renderBoard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  toast('Cartón en blanco. Puedes empezar de nuevo.');
});

renderBoard();
