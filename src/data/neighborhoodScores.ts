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
];

export function getNeighborhoodScores(cityId: string): NeighborhoodScores | undefined {
  return neighborhoodScores.find(s => s.cityId === cityId);
}
