export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  center: [number, number];
  zoom: number;
  currency: string;
  summary: string;
  investmentHighlights: string[];
  scores: {
    easeOfPurchase: number;
    rentalFriendliness: number;
    marketLiquidity: number;
    taxFavorability: number;
  };
}

export interface City {
  id: string;
  countryId: string;
  name: string;
  coordinates: [number, number];
  population: number;
  averagePricePerSqm: number;
  averageMonthlyRentPerSqm: number;
  grossYield: number;
  netYield: number;
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
  description: string;
  tourismScore: number;
  imageUrl: string;
}

export type PropertyType = 'apartment' | 'studio' | 'house' | 'commercial';

export interface PropertyListing {
  id: string;
  cityId: string;
  title: string;
  type: PropertyType;
  price: number;
  areaSqm: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  yearBuilt: number;
  coordinates: [number, number];
  imageUrl: string;
  estimatedMonthlyRent: number;
  grossYield: number;
  features: string[];
}

export interface ListingFilters {
  countryId?: string;
  countryIds?: string[];
  cityId?: string;
  cityIds?: string[];
  priceRange?: [number, number];
  areaRange?: [number, number];
  yieldMin?: number;
  propertyTypes?: PropertyType[];
  roomsMin?: number;
  yearBuiltRange?: [number, number];
  features?: string[];
  sortBy: 'price-asc' | 'price-desc' | 'yield-desc' | 'area-desc';
}

export interface Regulation {
  countryId: string;
  lastUpdated: string;
  disclaimer: string;
  sections: RegulationSection[];
}

export interface RegulationSection {
  id: string;
  title: string;
  icon: string;
  items: RegulationItem[];
}

export interface RegulationItem {
  label: string;
  value: string;
  details?: string;
  severity?: 'favorable' | 'neutral' | 'restrictive';
}

// AI Chat
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// Portfolio
export interface SavedProperty {
  listingId: string;
  savedAt: number;
  notes: string;
  tags: string[];
}

export interface Portfolio {
  id: string;
  name: string;
  properties: SavedProperty[];
  createdAt: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: ListingFilters;
  createdAt: number;
}

// Neighborhood & Market
export interface NeighborhoodScores {
  cityId: string;
  walkability: number;
  safety: number;
  amenities: number;
  transport: number;
  nightlife: number;
  familyFriendly: number;
}

export interface MarketTrend {
  year: number;
  avgPricePerSqm: number;
  avgYield: number;
  transactionVolume: number;
}

export interface CityMarketData {
  cityId: string;
  trends: MarketTrend[];
  forecast: 'bullish' | 'neutral' | 'bearish';
  hotMarket: boolean;
}

// ROI
export interface ROIProjection {
  year: number;
  propertyValue: number;
  cumulativeRent: number;
  cumulativeCosts: number;
  netCashFlow: number;
  totalReturn: number;
  totalROIPercent: number;
}

export interface ROIParams {
  purchasePrice: number;
  monthlyRent: number;
  appreciationRate: number;
  inflationRate: number;
  annualCostsPct: number;
  countryId: string;
  holdingPeriodYears: number;
  mortgageLTV: number;
  mortgageRate: number;
  mortgageTermYears: number;
}

// AI Analysis
export interface PropertyAnalysis {
  summary: string;
  pros: string[];
  cons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  riskExplanation: string;
  comparableAnalysis: string;
  neighborhoodInsight: string;
  regulatoryNotes: string;
  investmentVerdict: string;
}

export interface MarketReport {
  cityId: string;
  generatedAt: number;
  summary: string;
  priceAnalysis: string;
  yieldAnalysis: string;
  demandDrivers: string[];
  riskFactors: string[];
  regulatoryEnvironment: string;
  outlook: 'bullish' | 'neutral' | 'bearish';
  outlookExplanation: string;
  recommendedStrategy: string;
}
