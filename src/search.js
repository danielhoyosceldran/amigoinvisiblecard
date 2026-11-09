import { GOOGLE_CSE_ID } from './config.js';

// Cada proveedor devuelve [{ src, thumb, title }].

// --- Google (Programmable Search Element, sin clave de API) ----------------

let google = null;

function loadGoogle(cx) {
  if (google) return google;
  google = new Promise((resolve, reject) => {
    const host = document.createElement('div');
    host.id = 'gcse-host';
    host.hidden = true;
    document.body.append(host);

    let waiting = null;
    const timeout = setTimeout(() => reject(new Error('google-timeout')), 12000);

    window.__gcse = {
      parsetags: 'explicit',
      initializationCallback() {
        clearTimeout(timeout);
        window.google.search.cse.element.render({
          div: 'gcse-host',
          tag: 'searchresults-only',
          gname: 'amigo',
          attributes: {
            defaultToImageSearch: true,
            enableImageSearch: true,
            disableWebSearch: true,
            imageSearchResultSetSize: 'large',
            safeSearch: 'active',
            enableHistory: false,
          },
        });
        const element = window.google.search.cse.element.getElement('amigo');
        resolve({
          search(query) {
            return new Promise((ok, fail) => {
              const t = setTimeout(() => fail(new Error('google-timeout')), 12000);
              waiting = (results) => {
                clearTimeout(t);
                ok(results);
              };
              element.execute(query);
            });
          },
        });
      },
      searchCallbacks: {
        image: {
          // Devolver true evita que Google pinte sus propios resultados.
          ready(_name, _query, _promos, results) {
            const hits = (results || [])
              .map((r) => {
                const src = r.image?.url || r.unescapedUrl || r.url;
                return {
                  src,
                  thumb: r.thumbnailImage?.url || r.tbUrl || src,
                  title: r.titleNoFormatting || r.contentNoFormatting || '',
                };
              })
              .filter((h) => h.src);
            waiting?.(hits);
            waiting = null;
            return true;
          },
        },
      },
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(cx)}`;
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('google-load'));
    };
    document.head.append(script);
  });
  google.catch(() => {
    google = null;
  });
  return google;
}

// --- Wikimedia Commons (fotos libres, sin configuración) -------------------

// Commons no tiene búsqueda segura: excluimos a mano lo que no pinta en un
// juego familiar.
const NOT_FOR_FAMILY = '-nude -naked -nudity -nudism -naturism -erotic -erotica -sex -sexual -topless -desnudo -desnuda -lingerie -porn';

async function commons(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query} ${NOT_FOR_FAMILY}`,
    gsrnamespace: '6',
    gsrlimit: '30',
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '400',
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!res.ok) throw new Error(`commons-${res.status}`);
  const data = await res.json();
  return Object.values(data.query?.pages || {})
    .sort((a, b) => a.index - b.index)
    .map((p) => {
      const info = p.imageinfo?.[0] || {};
      return {
        src: info.responsiveUrls?.['2'] || info.thumburl,
        thumb: info.thumburl,
        title: (p.title || '').replace(/^File:/, '').replace(/\.[a-z]+$/i, ''),
      };
    })
    .filter((h) => h.src && h.thumb);
}

export const providerLabel = GOOGLE_CSE_ID ? 'Fotos de Google' : 'Fotos libres de Wikimedia Commons';

export async function searchImages(query) {
  if (GOOGLE_CSE_ID) {
    const g = await loadGoogle(GOOGLE_CSE_ID);
    return g.search(query);
  }
  return commons(query);
}
