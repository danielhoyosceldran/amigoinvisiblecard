# Cartón del amigo invisible

Web de una sola página para que cada persona de la familia rellene su cartón de gustos (3×3) y lo comparta como imagen en el grupo.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ para cualquier hosting estático
```

## Activar la búsqueda de Google

Mientras no se configure, el buscador usa fotos libres de Wikimedia Commons, y siempre se puede subir una foto del móvil.

1. Entra en <https://programmablesearchengine.google.com/> con tu cuenta de Google y crea un buscador.
2. Que busque en **toda la web** y con **Búsqueda de imágenes** activada (y SafeSearch activado).
3. Copia el **ID del buscador** (cx) y pégalo en `src/config.js`, en `GOOGLE_CSE_ID`.
4. En la configuración del buscador, si pide dominios permitidos, añade el dominio donde publiques la web.

No hace falta clave de API: se usa el elemento de búsqueda de Google y sus resultados se pintan con el diseño del cartón.

## Cómo funciona

- **Casillas**: `src/cells.js` (orden fijo, textos, ideas de búsqueda y colores con nombre).
- **Fotos**: al elegir una, se descarga ya recortada en cuadrado (480 px) a través de `wsrv.nl`, un proxy de imágenes gratuito. Así se guarda en el móvil y se puede dibujar en la imagen final; las fotos de otras webs no se dejan dibujar en un canvas sin ese paso.
- **Guardado**: todo queda en el propio móvil (`localStorage`). No hay servidor ni cuentas.
- **Imagen final**: `src/export.js` dibuja un JPG de 1080×1440 con el nombre y las nueve casillas. En móviles se comparte directamente (WhatsApp, etc.); si el navegador no lo permite, se descarga.

## Estructura

```
src/
  main.js      pantalla, editor de casillas, compartir
  cells.js     casillas, ideas y colores
  search.js    Google (si hay cx) o Wikimedia Commons
  images.js    copia y recorte de fotos
  export.js    imagen para compartir
  store.js     guardado en el móvil
  config.js    ID del buscador de Google
  styles.css   estilos
```
