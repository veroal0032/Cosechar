export const translations = {
  es: {
    appName: 'Cosechar',
    appSubtitle: 'Frutas y verduras de temporada en Argentina',
    seasons: {
      verano:    { label: 'Verano',    dates: 'Dic–Feb' },
      otoño:     { label: 'Otoño',     dates: 'Mar–May' },
      invierno:  { label: 'Invierno',  dates: 'Jun–Ago' },
      primavera: { label: 'Primavera', dates: 'Sep–Nov' },
    },
    filters: {
      todo:    'Todo',
      fruta:   'Frutas',
      verdura: 'Verduras',
    },
    tipos: {
      fruta:   'Fruta',
      verdura: 'Verdura',
    },
    inSeason: (n) => `${n} ${n === 1 ? 'producto' : 'productos'} en temporada`,
    nav: {
      home:   'Inicio',
      search: 'Buscar',
      about:  'Info',
    },
    recipesTitle: 'Recetas',
    kcal: 'kcal',
    // Onboarding
    onboarding: {
      subtitle:   'Temporada argentina',
      prompt:     'Elige tu idioma',
    },
  },
  en: {
    appName: 'Cosechar',
    appSubtitle: 'Seasonal fruits & vegetables in Argentina',
    seasons: {
      verano:    { label: 'Summer', dates: 'Dec–Feb' },
      otoño:     { label: 'Autumn', dates: 'Mar–May' },
      invierno:  { label: 'Winter', dates: 'Jun–Aug' },
      primavera: { label: 'Spring', dates: 'Sep–Nov' },
    },
    filters: {
      todo:    'All',
      fruta:   'Fruits',
      verdura: 'Vegetables',
    },
    tipos: {
      fruta:   'Fruit',
      verdura: 'Vegetable',
    },
    inSeason: (n) => `${n} ${n === 1 ? 'product' : 'products'} in season`,
    nav: {
      home:   'Home',
      search: 'Search',
      about:  'Info',
    },
    recipesTitle: 'Recipes',
    kcal: 'kcal',
    // Onboarding
    onboarding: {
      subtitle:   'Argentine seasons',
      prompt:     'Choose your language',
    },
  },
};
