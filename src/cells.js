// Las nueve casillas, en el orden fijo del cartón (izquierda a derecha, arriba abajo).
// `short` se imprime en la casilla; `title` encabeza el buscador.
export const CELLS = [
  {
    id: 'hobby',
    short: 'Hobby',
    title: 'Hobby',
    hint: '¿Qué te gusta hacer en tu tiempo libre?',
    ideas: ['jardinería', 'pintar acuarela', 'pescar', 'hacer punto', 'fotografía', 'puzles', 'bricolaje', 'senderismo'],
  },
  {
    id: 'ropa',
    short: 'Ropa y accesorios',
    title: 'Estilo de ropa y accesorios',
    hint: '¿Cómo te gusta vestir? ¿Qué accesorios usas?',
    ideas: ['ropa deportiva', 'estilo clásico', 'bufanda de lana', 'reloj de pulsera', 'pendientes', 'gorra', 'bolso de piel', 'ropa cómoda de casa'],
  },
  {
    id: 'genero',
    short: 'Libros, pelis, series',
    title: 'Género de libros, pelis o series',
    hint: '¿Qué te gusta leer o ver?',
    ideas: ['novela negra', 'comedia', 'ciencia ficción', 'documentales', 'novela histórica', 'cómic', 'romántica', 'terror'],
  },
  {
    id: 'musica',
    short: 'Música',
    title: 'Género de música',
    hint: '¿Qué música escuchas?',
    ideas: ['flamenco', 'rock', 'música clásica', 'pop español', 'jazz', 'copla', 'reguetón', 'cantautores'],
  },
  {
    id: 'lujo',
    short: 'Pequeño lujo diario',
    title: 'Pequeño lujo diario',
    hint: 'Ese capricho pequeño que te alegra el día.',
    ideas: ['café de especialidad', 'chocolate negro', 'velas aromáticas', 'té', 'crema de manos', 'flores frescas', 'pastelería', 'baño de espuma'],
  },
  {
    id: 'aventura',
    short: 'Aventura y entorno',
    title: 'Tipo de aventura o entorno',
    hint: '¿Dónde te gusta estar? ¿Qué plan te apetece?',
    ideas: ['playa', 'montaña', 'casa rural', 'escapada a la ciudad', 'camping', 'spa', 'crucero', 'ruta en bici'],
  },
  {
    id: 'comida',
    short: 'Cocina y comida',
    title: 'Tipo de cocina o comida',
    hint: '¿Qué te gusta comer?',
    ideas: ['paella', 'sushi', 'tapas', 'cocina italiana', 'comida mexicana', 'jamón ibérico', 'repostería', 'quesos'],
  },
  {
    id: 'no',
    short: 'Lo que NO regalarme',
    title: 'Lo que NO regalarme',
    hint: 'Lo que prefieres no recibir. Sus fotos saldrán tachadas con un NO.',
    ideas: ['colonia', 'calcetines', 'figuras decorativas', 'tazas', 'corbatas', 'chocolate', 'libros de autoayuda', 'pijamas'],
  },
  {
    id: 'color',
    short: 'Color favorito',
    title: 'Color o tono favorito',
    hint: 'Elige hasta tres colores o tonos que te gusten.',
    kind: 'color',
  },
];

export const MAX_PER_CELL = 3;

// Tonos con nombre: más fáciles de elegir que un selector libre.
export const SWATCHES = [
  { hex: '#c8102e', name: 'Rojo' },
  { hex: '#7b1e3a', name: 'Granate' },
  { hex: '#f28ab2', name: 'Rosa' },
  { hex: '#e8613c', name: 'Coral' },
  { hex: '#f08a00', name: 'Naranja' },
  { hex: '#f5c400', name: 'Amarillo' },
  { hex: '#c8a96a', name: 'Dorado' },
  { hex: '#6f8f3a', name: 'Verde oliva' },
  { hex: '#1f7a4d', name: 'Verde' },
  { hex: '#2bb3a3', name: 'Turquesa' },
  { hex: '#8cc6e8', name: 'Azul cielo' },
  { hex: '#1d4fa3', name: 'Azul' },
  { hex: '#1b2a4a', name: 'Azul marino' },
  { hex: '#6a3d9a', name: 'Morado' },
  { hex: '#b9a3d6', name: 'Lila' },
  { hex: '#8a5a3b', name: 'Marrón' },
  { hex: '#d9c3a5', name: 'Beis' },
  { hex: '#9aa0a6', name: 'Gris' },
  { hex: '#111111', name: 'Negro' },
  { hex: '#ffffff', name: 'Blanco' },
];
