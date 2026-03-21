import type { CityMarketData } from '../types';

export const marketTrends: CityMarketData[] = [
  // Athens - post-crisis recovery, rising prices, stable yields
  {
    cityId: 'athens',
    trends: [
      { year: 2022, avgPricePerSqm: 1650, avgYield: 6.1, transactionVolume: 12400 },
      { year: 2023, avgPricePerSqm: 1820, avgYield: 6.3, transactionVolume: 13800 },
      { year: 2024, avgPricePerSqm: 2000, avgYield: 6.4, transactionVolume: 15200 },
      { year: 2025, avgPricePerSqm: 2200, avgYield: 6.5, transactionVolume: 16500 },
      { year: 2026, avgPricePerSqm: 2420, avgYield: 6.4, transactionVolume: 17000 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Thessaloniki - strong price growth, improving yields, hot market
  {
    cityId: 'thessaloniki',
    trends: [
      { year: 2022, avgPricePerSqm: 1050, avgYield: 6.5, transactionVolume: 5200 },
      { year: 2023, avgPricePerSqm: 1180, avgYield: 6.8, transactionVolume: 6100 },
      { year: 2024, avgPricePerSqm: 1320, avgYield: 7.0, transactionVolume: 7300 },
      { year: 2025, avgPricePerSqm: 1500, avgYield: 7.2, transactionVolume: 8400 },
      { year: 2026, avgPricePerSqm: 1700, avgYield: 7.3, transactionVolume: 9200 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Heraklion - steady growth, seasonal tourism driven
  {
    cityId: 'heraklion',
    trends: [
      { year: 2022, avgPricePerSqm: 1400, avgYield: 6.2, transactionVolume: 2100 },
      { year: 2023, avgPricePerSqm: 1520, avgYield: 6.4, transactionVolume: 2400 },
      { year: 2024, avgPricePerSqm: 1650, avgYield: 6.5, transactionVolume: 2700 },
      { year: 2025, avgPricePerSqm: 1800, avgYield: 6.7, transactionVolume: 3000 },
      { year: 2026, avgPricePerSqm: 1950, avgYield: 6.6, transactionVolume: 3200 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Rhodes - seasonal but growing, high yields, hot market
  {
    cityId: 'rhodes',
    trends: [
      { year: 2022, avgPricePerSqm: 1500, avgYield: 7.5, transactionVolume: 950 },
      { year: 2023, avgPricePerSqm: 1650, avgYield: 7.9, transactionVolume: 1100 },
      { year: 2024, avgPricePerSqm: 1800, avgYield: 8.1, transactionVolume: 1250 },
      { year: 2025, avgPricePerSqm: 2000, avgYield: 8.4, transactionVolume: 1400 },
      { year: 2026, avgPricePerSqm: 2200, avgYield: 8.3, transactionVolume: 1500 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Paris - flat/slight decline, declining yields, neutral
  {
    cityId: 'paris',
    trends: [
      { year: 2022, avgPricePerSqm: 11200, avgYield: 3.2, transactionVolume: 42000 },
      { year: 2023, avgPricePerSqm: 10900, avgYield: 3.4, transactionVolume: 38500 },
      { year: 2024, avgPricePerSqm: 10600, avgYield: 3.5, transactionVolume: 36000 },
      { year: 2025, avgPricePerSqm: 10500, avgYield: 3.7, transactionVolume: 35200 },
      { year: 2026, avgPricePerSqm: 10550, avgYield: 3.6, transactionVolume: 35800 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Lyon - moderate growth, stable yields
  {
    cityId: 'lyon',
    trends: [
      { year: 2022, avgPricePerSqm: 4500, avgYield: 3.8, transactionVolume: 14200 },
      { year: 2023, avgPricePerSqm: 4550, avgYield: 3.9, transactionVolume: 13800 },
      { year: 2024, avgPricePerSqm: 4650, avgYield: 3.9, transactionVolume: 14000 },
      { year: 2025, avgPricePerSqm: 4800, avgYield: 4.0, transactionVolume: 14500 },
      { year: 2026, avgPricePerSqm: 4950, avgYield: 4.0, transactionVolume: 14800 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Marseille - strong growth (regeneration), good yields, hot market
  {
    cityId: 'marseille',
    trends: [
      { year: 2022, avgPricePerSqm: 2500, avgYield: 4.8, transactionVolume: 11500 },
      { year: 2023, avgPricePerSqm: 2700, avgYield: 5.0, transactionVolume: 12800 },
      { year: 2024, avgPricePerSqm: 2900, avgYield: 5.1, transactionVolume: 14200 },
      { year: 2025, avgPricePerSqm: 3200, avgYield: 5.3, transactionVolume: 15600 },
      { year: 2026, avgPricePerSqm: 3500, avgYield: 5.2, transactionVolume: 16400 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Nice - steady, premium market
  {
    cityId: 'nice',
    trends: [
      { year: 2022, avgPricePerSqm: 4800, avgYield: 4.0, transactionVolume: 7200 },
      { year: 2023, avgPricePerSqm: 4900, avgYield: 4.1, transactionVolume: 7000 },
      { year: 2024, avgPricePerSqm: 5050, avgYield: 4.1, transactionVolume: 7100 },
      { year: 2025, avgPricePerSqm: 5200, avgYield: 4.2, transactionVolume: 7300 },
      { year: 2026, avgPricePerSqm: 5350, avgYield: 4.1, transactionVolume: 7400 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Bordeaux - moderate growth post-TGV boom
  {
    cityId: 'bordeaux',
    trends: [
      { year: 2022, avgPricePerSqm: 4300, avgYield: 3.9, transactionVolume: 6800 },
      { year: 2023, avgPricePerSqm: 4250, avgYield: 4.0, transactionVolume: 6500 },
      { year: 2024, avgPricePerSqm: 4300, avgYield: 4.0, transactionVolume: 6600 },
      { year: 2025, avgPricePerSqm: 4400, avgYield: 4.1, transactionVolume: 6800 },
      { year: 2026, avgPricePerSqm: 4550, avgYield: 4.1, transactionVolume: 7000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Helsinki - moderate growth, stable yields
  {
    cityId: 'helsinki',
    trends: [
      { year: 2022, avgPricePerSqm: 5000, avgYield: 4.9, transactionVolume: 9800 },
      { year: 2023, avgPricePerSqm: 4900, avgYield: 5.0, transactionVolume: 9200 },
      { year: 2024, avgPricePerSqm: 4950, avgYield: 5.1, transactionVolume: 9500 },
      { year: 2025, avgPricePerSqm: 5100, avgYield: 5.2, transactionVolume: 9800 },
      { year: 2026, avgPricePerSqm: 5250, avgYield: 5.1, transactionVolume: 10000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Tampere - growing city, good fundamentals
  {
    cityId: 'tampere',
    trends: [
      { year: 2022, avgPricePerSqm: 2500, avgYield: 5.6, transactionVolume: 4200 },
      { year: 2023, avgPricePerSqm: 2580, avgYield: 5.7, transactionVolume: 4500 },
      { year: 2024, avgPricePerSqm: 2680, avgYield: 5.8, transactionVolume: 4800 },
      { year: 2025, avgPricePerSqm: 2800, avgYield: 6.0, transactionVolume: 5100 },
      { year: 2026, avgPricePerSqm: 2920, avgYield: 5.9, transactionVolume: 5300 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Turku - stable, moderate
  {
    cityId: 'turku',
    trends: [
      { year: 2022, avgPricePerSqm: 2350, avgYield: 5.9, transactionVolume: 3200 },
      { year: 2023, avgPricePerSqm: 2380, avgYield: 6.0, transactionVolume: 3300 },
      { year: 2024, avgPricePerSqm: 2420, avgYield: 6.1, transactionVolume: 3400 },
      { year: 2025, avgPricePerSqm: 2500, avgYield: 6.2, transactionVolume: 3500 },
      { year: 2026, avgPricePerSqm: 2580, avgYield: 6.1, transactionVolume: 3600 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Oulu - affordable, tech-driven demand
  {
    cityId: 'oulu',
    trends: [
      { year: 2022, avgPricePerSqm: 1900, avgYield: 6.5, transactionVolume: 2100 },
      { year: 2023, avgPricePerSqm: 1950, avgYield: 6.6, transactionVolume: 2200 },
      { year: 2024, avgPricePerSqm: 2000, avgYield: 6.7, transactionVolume: 2300 },
      { year: 2025, avgPricePerSqm: 2100, avgYield: 6.9, transactionVolume: 2400 },
      { year: 2026, avgPricePerSqm: 2200, avgYield: 6.8, transactionVolume: 2500 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
];

export function getMarketData(cityId: string): CityMarketData | undefined {
  return marketTrends.find(m => m.cityId === cityId);
}
