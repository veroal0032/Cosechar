import produce from '@/data/produce.json';

export const SEASON_ORDER = ['verano', 'otoño', 'invierno', 'primavera'];

// Background colors for the full-screen carousel
export const SEASON_BG = {
  verano:    '#CC4444', // bright warm coral
  otoño:     '#C1440E', // deep terracotta
  invierno:  '#3F6E8C', // muted slate-blue
  primavera: '#3D7A4E', // soft forest green
};

export const SEASON_EMOJI = {
  verano: '🌞',
  otoño:  '🍂',
  invierno: '❄️',
  primavera: '🌸',
};

// Normalize Spanish name to URL slug
export function slugify(nameEs) {
  return nameEs
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

// All items ordered by primary season for the carousel
// Each item appears exactly once, grouped by estacion[0]
export const allCarouselItems = SEASON_ORDER.flatMap(season =>
  produce.filter(item => item.estacion[0] === season)
);
