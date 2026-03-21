import type { City } from '../types';

export const cities: City[] = [
  // Greece
  {
    id: 'athens',
    countryId: 'greece',
    name: 'Athens',
    coordinates: [37.9838, 23.7275],
    population: 3150000,
    averagePricePerSqm: 2200,
    averageMonthlyRentPerSqm: 12,
    grossYield: 6.5,
    netYield: 4.8,
    demandLevel: 'very-high',
    description: 'Capital city with booming short-term rental market. Neighborhoods like Koukaki, Plaka, and Exarcheia offer high Airbnb yields. Major urban regeneration underway.',
    tourismScore: 9,
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400'
  },
  {
    id: 'thessaloniki',
    countryId: 'greece',
    name: 'Thessaloniki',
    coordinates: [40.6401, 22.9444],
    population: 1030000,
    averagePricePerSqm: 1500,
    averageMonthlyRentPerSqm: 9,
    grossYield: 7.2,
    netYield: 5.3,
    demandLevel: 'high',
    description: 'Second largest city, university town with strong student rental demand. Lower entry prices than Athens with growing tourism. Excellent food scene attracting visitors.',
    tourismScore: 7,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'
  },
  {
    id: 'heraklion',
    countryId: 'greece',
    name: 'Heraklion (Crete)',
    coordinates: [35.3387, 25.1442],
    population: 210000,
    averagePricePerSqm: 1800,
    averageMonthlyRentPerSqm: 10,
    grossYield: 6.7,
    netYield: 4.9,
    demandLevel: 'high',
    description: 'Crete\'s capital and gateway to Greece\'s largest island. Strong seasonal tourism with potential for year-round rentals. Archaeological sites and beaches drive demand.',
    tourismScore: 9,
    imageUrl: 'https://images.unsplash.com/photo-1586861256632-6ea4b3854708?w=400'
  },
  {
    id: 'rhodes',
    countryId: 'greece',
    name: 'Rhodes',
    coordinates: [36.4341, 28.2176],
    population: 50000,
    averagePricePerSqm: 2000,
    averageMonthlyRentPerSqm: 14,
    grossYield: 8.4,
    netYield: 6.1,
    demandLevel: 'high',
    description: 'UNESCO old town, major cruise port. Extremely strong summer season yields. Properties in old town are premium but high-demand. Near border zone \u2013 check purchase rules.',
    tourismScore: 10,
    imageUrl: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=400'
  },

  // France
  {
    id: 'paris',
    countryId: 'france',
    name: 'Paris',
    coordinates: [48.8566, 2.3522],
    population: 11000000,
    averagePricePerSqm: 10500,
    averageMonthlyRentPerSqm: 32,
    grossYield: 3.7,
    netYield: 2.4,
    demandLevel: 'very-high',
    description: 'World\'s most visited city. Extremely high demand but strict short-term rental limits (120 days/year for primary residence). Strong long-term rental market. Arrondissements 10, 11, 18, 19 offer better yields.',
    tourismScore: 10,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400'
  },
  {
    id: 'lyon',
    countryId: 'france',
    name: 'Lyon',
    coordinates: [45.7640, 4.8357],
    population: 1700000,
    averagePricePerSqm: 4800,
    averageMonthlyRentPerSqm: 16,
    grossYield: 4.0,
    netYield: 2.8,
    demandLevel: 'high',
    description: 'France\'s gastronomic capital and a major tech hub. Growing population and student demand. UNESCO-listed old town. More affordable than Paris with strong rental market.',
    tourismScore: 7,
    imageUrl: 'https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=400'
  },
  {
    id: 'marseille',
    countryId: 'france',
    name: 'Marseille',
    coordinates: [43.2965, 5.3698],
    population: 1600000,
    averagePricePerSqm: 3200,
    averageMonthlyRentPerSqm: 14,
    grossYield: 5.3,
    netYield: 3.6,
    demandLevel: 'high',
    description: 'France\'s second city undergoing major regeneration (Eurom\u00E9diterran\u00E9e project). Best yields among large French cities. Mediterranean climate attracts year-round tourists. Emerging tech scene.',
    tourismScore: 7,
    imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=400'
  },
  {
    id: 'nice',
    countryId: 'france',
    name: 'Nice',
    coordinates: [43.7102, 7.2620],
    population: 940000,
    averagePricePerSqm: 5200,
    averageMonthlyRentPerSqm: 18,
    grossYield: 4.2,
    netYield: 2.9,
    demandLevel: 'high',
    description: 'C\u00F4te d\'Azur capital with year-round tourism appeal. Strong seasonal demand plus steady retiree market. Airport with international connections. Premium location commands premium rents.',
    tourismScore: 9,
    imageUrl: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=400'
  },
  {
    id: 'bordeaux',
    countryId: 'france',
    name: 'Bordeaux',
    coordinates: [44.8378, -0.5792],
    population: 800000,
    averagePricePerSqm: 4400,
    averageMonthlyRentPerSqm: 15,
    grossYield: 4.1,
    netYield: 2.8,
    demandLevel: 'high',
    description: 'Wine capital with TGV connection to Paris (2h). Major urban renewal has driven price growth. UNESCO-listed center. Strong student population (University of Bordeaux).',
    tourismScore: 8,
    imageUrl: 'https://images.unsplash.com/photo-1565018054866-968e244671af?w=400'
  },

  // Finland
  {
    id: 'helsinki',
    countryId: 'finland',
    name: 'Helsinki',
    coordinates: [60.1699, 24.9384],
    population: 1300000,
    averagePricePerSqm: 5100,
    averageMonthlyRentPerSqm: 22,
    grossYield: 5.2,
    netYield: 3.5,
    demandLevel: 'very-high',
    description: 'Capital and economic hub. Strong tech sector (Supercell, Rovio, Nokia) drives rental demand. New metro line expanding to western suburbs. Housing company (As Oy) system is unique to Finland.',
    tourismScore: 7,
    imageUrl: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=400'
  },
  {
    id: 'tampere',
    countryId: 'finland',
    name: 'Tampere',
    coordinates: [61.4978, 23.7610],
    population: 370000,
    averagePricePerSqm: 2800,
    averageMonthlyRentPerSqm: 14,
    grossYield: 6.0,
    netYield: 4.1,
    demandLevel: 'high',
    description: 'Finland\'s fastest growing city. Major university town (2 universities). New tramway boosting certain neighborhoods. Lower entry price than Helsinki with strong yields.',
    tourismScore: 5,
    imageUrl: 'https://images.unsplash.com/photo-1569949237615-e2defbfc3906?w=400'
  },
  {
    id: 'turku',
    countryId: 'finland',
    name: 'Turku',
    coordinates: [60.4518, 22.2666],
    population: 330000,
    averagePricePerSqm: 2500,
    averageMonthlyRentPerSqm: 13,
    grossYield: 6.2,
    netYield: 4.3,
    demandLevel: 'medium',
    description: 'Former capital and oldest city. University city with steady student demand. Shipyard and tech industries. Gateway to the Archipelago Sea \u2013 growing tourism potential.',
    tourismScore: 6,
    imageUrl: 'https://images.unsplash.com/photo-1570103505249-e4a5497c01fb?w=400'
  },
  {
    id: 'oulu',
    countryId: 'finland',
    name: 'Oulu',
    coordinates: [65.0121, 25.4651],
    population: 210000,
    averagePricePerSqm: 2100,
    averageMonthlyRentPerSqm: 12,
    grossYield: 6.9,
    netYield: 4.8,
    demandLevel: 'medium',
    description: 'Northern tech hub (\"Silicon Valley of Finland\"). University of Oulu drives demand. Lowest entry prices among major Finnish cities. Good yields but limited liquidity.',
    tourismScore: 4,
    imageUrl: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=400'
  }
];

export function getCitiesByCountry(countryId: string): City[] {
  return cities.filter(c => c.countryId === countryId);
}

export function getCity(id: string): City | undefined {
  return cities.find(c => c.id === id);
}
