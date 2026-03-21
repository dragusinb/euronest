import type { Country } from '../types';

export const countries: Country[] = [
  {
    id: 'greece',
    name: 'Greece',
    code: 'GR',
    flag: '\u{1F1EC}\u{1F1F7}',
    center: [38.5, 23.8],
    zoom: 7,
    currency: 'EUR',
    summary: 'Greece offers attractive yields driven by strong tourism demand, a Golden Visa program, and relatively low property prices compared to Western Europe. Islands and Athens are hotspots for short-term rentals.',
    investmentHighlights: [
      'Golden Visa program (min \u20AC250k investment)',
      'Strong tourism-driven rental demand',
      'Lower property prices than Western Europe',
      'Flat 15% tax on short-term rental income',
      'Growing digital nomad scene'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 4
    }
  },
  {
    id: 'france',
    name: 'France',
    code: 'FR',
    flag: '\u{1F1EB}\u{1F1F7}',
    center: [46.6, 2.3],
    zoom: 6,
    currency: 'EUR',
    summary: 'France is the world\'s most visited country with a stable, mature property market. Strong tenant protections mean long-term rentals are secure but less flexible. Paris and Riviera command premium prices.',
    investmentHighlights: [
      'World\'s largest tourism market',
      'Stable and liquid property market',
      'LMNP tax regime for furnished rentals',
      'Strong legal protections for property owners',
      'EU freedom of movement for purchases'
    ],
    scores: {
      easeOfPurchase: 5,
      rentalFriendliness: 3,
      marketLiquidity: 5,
      taxFavorability: 3
    }
  },
  {
    id: 'finland',
    name: 'Finland',
    code: 'FI',
    flag: '\u{1F1EB}\u{1F1EE}',
    center: [64.0, 26.0],
    zoom: 5,
    currency: 'EUR',
    summary: 'Finland offers a transparent, well-regulated property market with no restrictions on foreign buyers. Helsinki provides steady rental demand from a growing population and strong tech sector employment.',
    investmentHighlights: [
      'No restrictions on foreign property ownership',
      'Highly transparent and corruption-free market',
      'Strong rental demand in Helsinki metro area',
      'Housing company (asunto-osakeyhti\u00F6) system simplifies ownership',
      'Stable economy and rule of law'
    ],
    scores: {
      easeOfPurchase: 5,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 3
    }
  }
];

export function getCountry(id: string): Country | undefined {
  return countries.find(c => c.id === id);
}
