import type { PropertyListing } from '../types';
import { cities } from './cities';

export const listings: PropertyListing[] = [
  // Athens
  { id: 'gr-ath-1', cityId: 'athens', title: '2-Bed Apartment in Koukaki, Near Acropolis', type: 'apartment', price: 185000, areaSqm: 65, rooms: 2, bathrooms: 1, floor: 3, yearBuilt: 2005, coordinates: [37.9631, 23.7261], imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', estimatedMonthlyRent: 1050, grossYield: 6.8, features: ['Renovated', 'Balcony', 'Near Metro', 'Airbnb-ready'] },
  { id: 'gr-ath-2', cityId: 'athens', title: 'Studio in Plaka, Historic Center', type: 'studio', price: 120000, areaSqm: 38, rooms: 1, bathrooms: 1, floor: 2, yearBuilt: 1985, coordinates: [37.9725, 23.7300], imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', estimatedMonthlyRent: 750, grossYield: 7.5, features: ['Central Location', 'Furnished', 'Tourist Area', 'Renovated 2023'] },
  { id: 'gr-ath-3', cityId: 'athens', title: '3-Bed Apartment in Pagrati', type: 'apartment', price: 240000, areaSqm: 95, rooms: 3, bathrooms: 2, floor: 4, yearBuilt: 2010, coordinates: [37.9674, 23.7467], imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', estimatedMonthlyRent: 1300, grossYield: 6.5, features: ['Elevator', 'Parking', 'Storage', 'Near Park'] },

  // Thessaloniki
  { id: 'gr-thes-1', cityId: 'thessaloniki', title: '2-Bed near Aristotelous Square', type: 'apartment', price: 130000, areaSqm: 72, rooms: 2, bathrooms: 1, floor: 3, yearBuilt: 2000, coordinates: [40.6325, 22.9411], imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400', estimatedMonthlyRent: 800, grossYield: 7.4, features: ['Sea View', 'Central', 'Renovated', 'Balcony'] },
  { id: 'gr-thes-2', cityId: 'thessaloniki', title: 'Studio near University Campus', type: 'studio', price: 75000, areaSqm: 35, rooms: 1, bathrooms: 1, floor: 1, yearBuilt: 1995, coordinates: [40.6342, 22.9529], imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400', estimatedMonthlyRent: 480, grossYield: 7.7, features: ['Student Area', 'Low Entry Cost', 'Near Transport'] },

  // Heraklion
  { id: 'gr-her-1', cityId: 'heraklion', title: '2-Bed near Venetian Harbor', type: 'apartment', price: 165000, areaSqm: 68, rooms: 2, bathrooms: 1, floor: 2, yearBuilt: 2008, coordinates: [35.3420, 25.1345], imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', estimatedMonthlyRent: 950, grossYield: 6.9, features: ['Near Beach', 'Tourist Area', 'Furnished', 'Terrace'] },

  // Rhodes
  { id: 'gr-rho-1', cityId: 'rhodes', title: 'Studio in Rhodes Old Town', type: 'studio', price: 110000, areaSqm: 40, rooms: 1, bathrooms: 1, floor: 1, yearBuilt: 1970, coordinates: [36.4440, 28.2240], imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', estimatedMonthlyRent: 850, grossYield: 9.3, features: ['UNESCO Area', 'Stone Building', 'Character Property', 'High Season Demand'] },

  // Paris
  { id: 'fr-par-1', cityId: 'paris', title: 'Studio in 11th Arrondissement, Bastille', type: 'studio', price: 280000, areaSqm: 25, rooms: 1, bathrooms: 1, floor: 4, yearBuilt: 1920, coordinates: [48.8534, 2.3688], imageUrl: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400', estimatedMonthlyRent: 900, grossYield: 3.9, features: ['Haussmann Building', 'Near Metro', 'Furnished', 'High Demand Area'] },
  { id: 'fr-par-2', cityId: 'paris', title: '2-Bed in 18th Arr., Montmartre Area', type: 'apartment', price: 420000, areaSqm: 45, rooms: 2, bathrooms: 1, floor: 5, yearBuilt: 1900, coordinates: [48.8867, 2.3431], imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', estimatedMonthlyRent: 1350, grossYield: 3.9, features: ['Rooftop View', 'Character Building', 'Tourist Area', 'Walk-up'] },
  { id: 'fr-par-3', cityId: 'paris', title: '1-Bed in 10th Arr., Canal Saint-Martin', type: 'apartment', price: 350000, areaSqm: 35, rooms: 1, bathrooms: 1, floor: 3, yearBuilt: 1910, coordinates: [48.8722, 2.3656], imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18f6b0128?w=400', estimatedMonthlyRent: 1100, grossYield: 3.8, features: ['Trendy Area', 'Near Canal', 'Renovated', 'Young Professional Area'] },

  // Lyon
  { id: 'fr-lyo-1', cityId: 'lyon', title: '2-Bed in Presqu\u2019\u00EEle, Central Lyon', type: 'apartment', price: 295000, areaSqm: 58, rooms: 2, bathrooms: 1, floor: 3, yearBuilt: 1930, coordinates: [45.7580, 4.8340], imageUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400', estimatedMonthlyRent: 1000, grossYield: 4.1, features: ['Historic Center', 'Renovated', 'Near Transport', 'Cellar'] },
  { id: 'fr-lyo-2', cityId: 'lyon', title: 'Studio near Part-Dieu Business District', type: 'studio', price: 150000, areaSqm: 28, rooms: 1, bathrooms: 1, floor: 6, yearBuilt: 1975, coordinates: [45.7610, 4.8590], imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400', estimatedMonthlyRent: 550, grossYield: 4.4, features: ['Business District', 'TGV Station', 'Elevator', 'Student Demand'] },

  // Marseille
  { id: 'fr-mar-1', cityId: 'marseille', title: '2-Bed in Le Panier, Old Port Area', type: 'apartment', price: 195000, areaSqm: 55, rooms: 2, bathrooms: 1, floor: 2, yearBuilt: 2000, coordinates: [43.2990, 5.3680], imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400', estimatedMonthlyRent: 900, grossYield: 5.5, features: ['Sea Proximity', 'Renovated Area', 'Character', 'Growing Area'] },

  // Nice
  { id: 'fr-nic-1', cityId: 'nice', title: '1-Bed near Promenade des Anglais', type: 'apartment', price: 260000, areaSqm: 42, rooms: 1, bathrooms: 1, floor: 4, yearBuilt: 1960, coordinates: [43.6950, 7.2700], imageUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400', estimatedMonthlyRent: 950, grossYield: 4.4, features: ['Sea View', 'Balcony', 'Tourist Area', 'Year-round Demand'] },

  // Bordeaux
  { id: 'fr-bor-1', cityId: 'bordeaux', title: '2-Bed in Saint-Michel Quarter', type: 'apartment', price: 240000, areaSqm: 52, rooms: 2, bathrooms: 1, floor: 2, yearBuilt: 1890, coordinates: [44.8340, -0.5700], imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400', estimatedMonthlyRent: 850, grossYield: 4.3, features: ['UNESCO Center', 'Stone Building', 'Near Tram', 'Student Area'] },

  // Helsinki
  { id: 'fi-hel-1', cityId: 'helsinki', title: '2-Bed in Kallio, Trendy District', type: 'apartment', price: 285000, areaSqm: 52, rooms: 2, bathrooms: 1, floor: 4, yearBuilt: 1935, coordinates: [60.1840, 24.9500], imageUrl: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400', estimatedMonthlyRent: 1250, grossYield: 5.3, features: ['Art Nouveau Building', 'Near Metro', 'Popular Area', 'Sauna'] },
  { id: 'fi-hel-2', cityId: 'helsinki', title: 'Studio in Kamppi, City Center', type: 'studio', price: 195000, areaSqm: 28, rooms: 1, bathrooms: 1, floor: 7, yearBuilt: 2015, coordinates: [60.1680, 24.9310], imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7c5a38?w=400', estimatedMonthlyRent: 850, grossYield: 5.2, features: ['New Build', 'City Center', 'Elevator', 'Furnished'] },
  { id: 'fi-hel-3', cityId: 'helsinki', title: '1-Bed in Lauttasaari, Near New Metro', type: 'apartment', price: 250000, areaSqm: 42, rooms: 1, bathrooms: 1, floor: 3, yearBuilt: 1970, coordinates: [60.1600, 24.8750], imageUrl: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400', estimatedMonthlyRent: 1050, grossYield: 5.0, features: ['Island Location', 'Metro Access', 'Sea Proximity', 'Renovated'] },

  // Tampere
  { id: 'fi-tam-1', cityId: 'tampere', title: '2-Bed near Tampere University', type: 'apartment', price: 165000, areaSqm: 55, rooms: 2, bathrooms: 1, floor: 3, yearBuilt: 2000, coordinates: [61.4945, 23.7800], imageUrl: 'https://images.unsplash.com/photo-1600047508788-786f3865b4b9?w=400', estimatedMonthlyRent: 850, grossYield: 6.2, features: ['University Area', 'Near Tram', 'Balcony', 'Storage'] },
  { id: 'fi-tam-2', cityId: 'tampere', title: 'Studio in Keskusta (City Center)', type: 'studio', price: 95000, areaSqm: 28, rooms: 1, bathrooms: 1, floor: 2, yearBuilt: 1980, coordinates: [61.4978, 23.7600], imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400', estimatedMonthlyRent: 520, grossYield: 6.6, features: ['Central', 'Low Entry Cost', 'Good Transport', 'Student Demand'] },

  // Turku
  { id: 'fi-tur-1', cityId: 'turku', title: '2-Bed near Market Square', type: 'apartment', price: 155000, areaSqm: 58, rooms: 2, bathrooms: 1, floor: 3, yearBuilt: 1995, coordinates: [60.4510, 22.2680], imageUrl: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400', estimatedMonthlyRent: 800, grossYield: 6.2, features: ['Central', 'River Proximity', 'Renovated', 'Good Condition'] },

  // Oulu
  { id: 'fi-oul-1', cityId: 'oulu', title: '2-Bed near Oulu University', type: 'apartment', price: 125000, areaSqm: 55, rooms: 2, bathrooms: 1, floor: 2, yearBuilt: 1990, coordinates: [65.0590, 25.4660], imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400', estimatedMonthlyRent: 720, grossYield: 6.9, features: ['University Area', 'Affordable', 'Good Yield', 'Parking'] }
];

// Build a lookup from cityId -> countryId using the cities data
const cityCountryMap = new Map<string, string>();
for (const city of cities) {
  cityCountryMap.set(city.id, city.countryId);
}

function getCityCountryId(cityId: string): string | undefined {
  return cityCountryMap.get(cityId);
}

export function getListings(filters?: Partial<import('../types').ListingFilters>): PropertyListing[] {
  let result = [...listings];

  if (filters?.cityId) {
    result = result.filter(l => l.cityId === filters.cityId);
  }
  if (filters?.cityIds?.length) {
    const citySet = new Set(filters.cityIds);
    result = result.filter(l => citySet.has(l.cityId));
  }
  if (filters?.countryId) {
    result = result.filter(l => getCityCountryId(l.cityId) === filters.countryId);
  }
  if (filters?.countryIds?.length) {
    const countrySet = new Set(filters.countryIds);
    result = result.filter(l => {
      const cid = getCityCountryId(l.cityId);
      return cid !== undefined && countrySet.has(cid);
    });
  }
  if (filters?.priceRange) {
    result = result.filter(l => l.price >= filters.priceRange![0] && l.price <= filters.priceRange![1]);
  }
  if (filters?.areaRange) {
    result = result.filter(l => l.areaSqm >= filters.areaRange![0] && l.areaSqm <= filters.areaRange![1]);
  }
  if (filters?.yieldMin) {
    result = result.filter(l => l.grossYield >= filters.yieldMin!);
  }
  if (filters?.propertyTypes?.length) {
    result = result.filter(l => filters.propertyTypes!.includes(l.type));
  }
  if (filters?.roomsMin) {
    result = result.filter(l => l.rooms >= filters.roomsMin!);
  }
  if (filters?.yearBuiltRange) {
    result = result.filter(l => l.yearBuilt >= filters.yearBuiltRange![0] && l.yearBuilt <= filters.yearBuiltRange![1]);
  }
  if (filters?.features?.length) {
    const requiredFeatures = filters.features.map(f => f.toLowerCase());
    result = result.filter(l => {
      const listingFeatures = l.features.map(f => f.toLowerCase());
      return requiredFeatures.every(rf => listingFeatures.some(lf => lf.includes(rf)));
    });
  }

  const sortBy = filters?.sortBy || 'yield-desc';
  switch (sortBy) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'yield-desc': result.sort((a, b) => b.grossYield - a.grossYield); break;
    case 'area-desc': result.sort((a, b) => b.areaSqm - a.areaSqm); break;
  }

  return result;
}
