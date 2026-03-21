import type { NeighborhoodScores } from '../types';

export const neighborhoodScores: NeighborhoodScores[] = [
  // Greece
  { cityId: 'athens', walkability: 8, safety: 6, amenities: 8, transport: 7, nightlife: 9, familyFriendly: 6 },
  { cityId: 'thessaloniki', walkability: 7, safety: 6, amenities: 7, transport: 6, nightlife: 8, familyFriendly: 6 },
  { cityId: 'heraklion', walkability: 6, safety: 7, amenities: 6, transport: 5, nightlife: 6, familyFriendly: 7 },
  { cityId: 'rhodes', walkability: 7, safety: 8, amenities: 5, transport: 4, nightlife: 6, familyFriendly: 7 },
  // France
  { cityId: 'paris', walkability: 9, safety: 6, amenities: 10, transport: 10, nightlife: 10, familyFriendly: 7 },
  { cityId: 'lyon', walkability: 8, safety: 7, amenities: 8, transport: 8, nightlife: 8, familyFriendly: 8 },
  { cityId: 'marseille', walkability: 7, safety: 5, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 6 },
  { cityId: 'nice', walkability: 8, safety: 7, amenities: 8, transport: 7, nightlife: 7, familyFriendly: 8 },
  { cityId: 'bordeaux', walkability: 8, safety: 7, amenities: 8, transport: 7, nightlife: 7, familyFriendly: 8 },
  // Finland
  { cityId: 'helsinki', walkability: 8, safety: 9, amenities: 8, transport: 9, nightlife: 7, familyFriendly: 9 },
  { cityId: 'tampere', walkability: 7, safety: 9, amenities: 7, transport: 7, nightlife: 6, familyFriendly: 9 },
  { cityId: 'turku', walkability: 7, safety: 9, amenities: 6, transport: 6, nightlife: 5, familyFriendly: 8 },
  { cityId: 'oulu', walkability: 6, safety: 9, amenities: 5, transport: 5, nightlife: 4, familyFriendly: 8 },

  // Spain
  { cityId: 'madrid', walkability: 9, safety: 7, amenities: 9, transport: 9, nightlife: 10, familyFriendly: 7 },
  { cityId: 'barcelona', walkability: 9, safety: 6, amenities: 9, transport: 9, nightlife: 10, familyFriendly: 7 },
  { cityId: 'valencia', walkability: 8, safety: 7, amenities: 8, transport: 8, nightlife: 8, familyFriendly: 8 },
  { cityId: 'malaga', walkability: 8, safety: 7, amenities: 7, transport: 7, nightlife: 8, familyFriendly: 7 },
  { cityId: 'seville', walkability: 9, safety: 7, amenities: 8, transport: 7, nightlife: 9, familyFriendly: 7 },

  // Portugal
  { cityId: 'lisbon', walkability: 8, safety: 7, amenities: 8, transport: 8, nightlife: 9, familyFriendly: 7 },
  { cityId: 'porto', walkability: 8, safety: 8, amenities: 7, transport: 7, nightlife: 8, familyFriendly: 7 },
  { cityId: 'faro', walkability: 7, safety: 8, amenities: 5, transport: 5, nightlife: 6, familyFriendly: 7 },

  // Italy
  { cityId: 'rome', walkability: 8, safety: 6, amenities: 9, transport: 7, nightlife: 9, familyFriendly: 7 },
  { cityId: 'milan', walkability: 8, safety: 7, amenities: 9, transport: 9, nightlife: 9, familyFriendly: 7 },
  { cityId: 'florence', walkability: 9, safety: 7, amenities: 8, transport: 6, nightlife: 8, familyFriendly: 7 },
  { cityId: 'naples', walkability: 7, safety: 5, amenities: 7, transport: 6, nightlife: 8, familyFriendly: 6 },
  { cityId: 'bologna', walkability: 9, safety: 7, amenities: 8, transport: 8, nightlife: 8, familyFriendly: 8 },

  // Germany
  { cityId: 'berlin', walkability: 8, safety: 7, amenities: 9, transport: 9, nightlife: 10, familyFriendly: 7 },
  { cityId: 'munich', walkability: 8, safety: 9, amenities: 9, transport: 9, nightlife: 8, familyFriendly: 9 },
  { cityId: 'frankfurt', walkability: 7, safety: 7, amenities: 8, transport: 9, nightlife: 7, familyFriendly: 7 },
  { cityId: 'hamburg', walkability: 8, safety: 7, amenities: 8, transport: 9, nightlife: 9, familyFriendly: 8 },
  { cityId: 'dusseldorf', walkability: 8, safety: 8, amenities: 8, transport: 9, nightlife: 7, familyFriendly: 8 },

  // Netherlands
  { cityId: 'amsterdam', walkability: 9, safety: 8, amenities: 9, transport: 9, nightlife: 9, familyFriendly: 7 },
  { cityId: 'rotterdam', walkability: 8, safety: 7, amenities: 8, transport: 9, nightlife: 8, familyFriendly: 7 },
  { cityId: 'the-hague', walkability: 8, safety: 8, amenities: 8, transport: 9, nightlife: 7, familyFriendly: 8 },

  // Belgium
  { cityId: 'brussels', walkability: 8, safety: 6, amenities: 8, transport: 9, nightlife: 8, familyFriendly: 7 },
  { cityId: 'antwerp', walkability: 8, safety: 7, amenities: 8, transport: 8, nightlife: 8, familyFriendly: 7 },
  { cityId: 'ghent', walkability: 9, safety: 8, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 8 },

  // Austria
  { cityId: 'vienna', walkability: 9, safety: 9, amenities: 9, transport: 10, nightlife: 8, familyFriendly: 9 },
  { cityId: 'graz', walkability: 8, safety: 9, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 8 },
  { cityId: 'salzburg', walkability: 9, safety: 9, amenities: 7, transport: 7, nightlife: 6, familyFriendly: 8 },

  // Ireland
  { cityId: 'dublin', walkability: 8, safety: 7, amenities: 8, transport: 7, nightlife: 8, familyFriendly: 7 },
  { cityId: 'cork', walkability: 7, safety: 8, amenities: 7, transport: 6, nightlife: 7, familyFriendly: 8 },

  // Poland
  { cityId: 'warsaw', walkability: 7, safety: 8, amenities: 8, transport: 8, nightlife: 8, familyFriendly: 7 },
  { cityId: 'krakow', walkability: 9, safety: 8, amenities: 8, transport: 8, nightlife: 9, familyFriendly: 7 },
  { cityId: 'wroclaw', walkability: 8, safety: 8, amenities: 7, transport: 7, nightlife: 8, familyFriendly: 7 },
  { cityId: 'gdansk', walkability: 8, safety: 8, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 8 },

  // Czechia
  { cityId: 'prague', walkability: 9, safety: 8, amenities: 8, transport: 9, nightlife: 9, familyFriendly: 7 },
  { cityId: 'brno', walkability: 8, safety: 8, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 7 },

  // Hungary
  { cityId: 'budapest', walkability: 8, safety: 7, amenities: 8, transport: 8, nightlife: 9, familyFriendly: 7 },
  { cityId: 'debrecen', walkability: 7, safety: 8, amenities: 6, transport: 6, nightlife: 6, familyFriendly: 7 },

  // Romania
  { cityId: 'bucharest', walkability: 6, safety: 6, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 6 },
  { cityId: 'cluj-napoca', walkability: 7, safety: 8, amenities: 7, transport: 6, nightlife: 7, familyFriendly: 7 },
  { cityId: 'timisoara', walkability: 7, safety: 8, amenities: 6, transport: 6, nightlife: 6, familyFriendly: 7 },

  // Croatia
  { cityId: 'zagreb', walkability: 7, safety: 8, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 7 },
  { cityId: 'split', walkability: 8, safety: 8, amenities: 6, transport: 5, nightlife: 7, familyFriendly: 7 },
  { cityId: 'dubrovnik', walkability: 8, safety: 9, amenities: 5, transport: 4, nightlife: 6, familyFriendly: 7 },

  // Denmark
  { cityId: 'copenhagen', walkability: 9, safety: 9, amenities: 9, transport: 9, nightlife: 8, familyFriendly: 9 },
  { cityId: 'aarhus', walkability: 8, safety: 9, amenities: 7, transport: 7, nightlife: 7, familyFriendly: 9 },

  // Sweden
  { cityId: 'stockholm', walkability: 8, safety: 8, amenities: 9, transport: 9, nightlife: 8, familyFriendly: 9 },
  { cityId: 'gothenburg', walkability: 8, safety: 8, amenities: 8, transport: 8, nightlife: 7, familyFriendly: 9 },
  { cityId: 'malmo', walkability: 8, safety: 7, amenities: 7, transport: 8, nightlife: 7, familyFriendly: 8 },

  // Norway
  { cityId: 'oslo', walkability: 8, safety: 9, amenities: 8, transport: 9, nightlife: 7, familyFriendly: 9 },
  { cityId: 'bergen', walkability: 7, safety: 9, amenities: 7, transport: 7, nightlife: 6, familyFriendly: 8 },

  // Estonia
  { cityId: 'tallinn', walkability: 8, safety: 8, amenities: 7, transport: 7, nightlife: 8, familyFriendly: 7 },
  { cityId: 'tartu', walkability: 8, safety: 9, amenities: 6, transport: 5, nightlife: 6, familyFriendly: 8 },

  // Latvia
  { cityId: 'riga', walkability: 8, safety: 7, amenities: 7, transport: 7, nightlife: 8, familyFriendly: 7 },

  // Lithuania
  { cityId: 'vilnius', walkability: 8, safety: 8, amenities: 7, transport: 7, nightlife: 8, familyFriendly: 7 },
  { cityId: 'kaunas', walkability: 7, safety: 8, amenities: 6, transport: 6, nightlife: 6, familyFriendly: 7 },

  // Cyprus
  { cityId: 'limassol', walkability: 6, safety: 8, amenities: 7, transport: 5, nightlife: 7, familyFriendly: 7 },
  { cityId: 'paphos', walkability: 5, safety: 9, amenities: 5, transport: 4, nightlife: 5, familyFriendly: 8 },
  { cityId: 'nicosia', walkability: 6, safety: 8, amenities: 6, transport: 5, nightlife: 6, familyFriendly: 7 },
];

export function getNeighborhoodScores(cityId: string): NeighborhoodScores | undefined {
  return neighborhoodScores.find(s => s.cityId === cityId);
}
