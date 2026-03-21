import { listings as staticListings } from '../data/listings';
import type { PropertyListing, ListingFilters } from '../types';
import { cities } from '../data/cities';

const API_BASE = import.meta.env.BASE_URL + 'api';

interface ApiMeta {
  cities: Record<string, { lastUpdated: string; count: number; sources: string[] }>;
  lastFullUpdate: string | null;
}

let cachedListings: PropertyListing[] | null = null;
let cachedMeta: ApiMeta | null = null;
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchLiveListings(): Promise<PropertyListing[]> {
  // Return cache if fresh
  if (cachedListings && Date.now() - lastFetch < CACHE_TTL) {
    return cachedListings;
  }

  try {
    const response = await fetch(`${API_BASE}/listings.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      cachedListings = data;
      lastFetch = Date.now();
      return data;
    }
  } catch (e) {
    console.warn('Failed to fetch live listings, using static data:', e);
  }

  // Fallback to static data
  return staticListings;
}

export async function fetchMeta(): Promise<ApiMeta | null> {
  if (cachedMeta && Date.now() - lastFetch < CACHE_TTL) {
    return cachedMeta;
  }

  try {
    const response = await fetch(`${API_BASE}/meta.json`);
    if (!response.ok) return null;
    cachedMeta = await response.json();
    return cachedMeta;
  } catch {
    return null;
  }
}

export async function fetchCityListings(cityId: string): Promise<PropertyListing[]> {
  try {
    const response = await fetch(`${API_BASE}/cities/${cityId}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // Fall through to static
  }

  // Fallback: filter static listings
  return staticListings.filter(l => l.cityId === cityId);
}

export function filterListings(allListings: PropertyListing[], filters?: Partial<ListingFilters>): PropertyListing[] {
  let result = [...allListings];
  const cityCountryMap: Record<string, string> = {};
  for (const city of cities) {
    cityCountryMap[city.id] = city.countryId;
  }

  if (filters?.cityId) {
    result = result.filter(l => l.cityId === filters.cityId);
  }
  if (filters?.cityIds?.length) {
    result = result.filter(l => filters.cityIds!.includes(l.cityId));
  }
  if (filters?.countryId) {
    result = result.filter(l => cityCountryMap[l.cityId] === filters.countryId);
  }
  if (filters?.countryIds?.length) {
    result = result.filter(l => filters.countryIds!.includes(cityCountryMap[l.cityId]));
  }
  if (filters?.priceRange) {
    result = result.filter(l => l.price >= filters.priceRange![0] && l.price <= filters.priceRange![1]);
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

  const sortBy = filters?.sortBy || 'yield-desc';
  switch (sortBy) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'yield-desc': result.sort((a, b) => b.grossYield - a.grossYield); break;
    case 'area-desc': result.sort((a, b) => b.areaSqm - a.areaSqm); break;
  }

  return result;
}

export function invalidateCache() {
  cachedListings = null;
  cachedMeta = null;
  lastFetch = 0;
}
