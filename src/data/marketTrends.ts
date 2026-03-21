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

  // --- Spain ---
  // Madrid - steady growth, bullish
  {
    cityId: 'madrid',
    trends: [
      { year: 2022, avgPricePerSqm: 3800, avgYield: 4.8, transactionVolume: 52000 },
      { year: 2023, avgPricePerSqm: 4000, avgYield: 4.9, transactionVolume: 54000 },
      { year: 2024, avgPricePerSqm: 4250, avgYield: 5.0, transactionVolume: 57000 },
      { year: 2025, avgPricePerSqm: 4500, avgYield: 5.1, transactionVolume: 59000 },
      { year: 2026, avgPricePerSqm: 4750, avgYield: 5.0, transactionVolume: 61000 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Barcelona - moderate growth, neutral (tourism regulation concerns)
  {
    cityId: 'barcelona',
    trends: [
      { year: 2022, avgPricePerSqm: 4200, avgYield: 4.5, transactionVolume: 38000 },
      { year: 2023, avgPricePerSqm: 4350, avgYield: 4.4, transactionVolume: 37000 },
      { year: 2024, avgPricePerSqm: 4500, avgYield: 4.3, transactionVolume: 36500 },
      { year: 2025, avgPricePerSqm: 4650, avgYield: 4.2, transactionVolume: 36000 },
      { year: 2026, avgPricePerSqm: 4780, avgYield: 4.1, transactionVolume: 35500 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Valencia - strong growth, good yields, hotMarket
  {
    cityId: 'valencia',
    trends: [
      { year: 2022, avgPricePerSqm: 1800, avgYield: 5.8, transactionVolume: 18000 },
      { year: 2023, avgPricePerSqm: 2000, avgYield: 6.0, transactionVolume: 20500 },
      { year: 2024, avgPricePerSqm: 2250, avgYield: 6.2, transactionVolume: 23000 },
      { year: 2025, avgPricePerSqm: 2500, avgYield: 6.3, transactionVolume: 25500 },
      { year: 2026, avgPricePerSqm: 2750, avgYield: 6.2, transactionVolume: 27000 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Malaga - tourism-driven growth
  {
    cityId: 'malaga',
    trends: [
      { year: 2022, avgPricePerSqm: 2200, avgYield: 5.5, transactionVolume: 12000 },
      { year: 2023, avgPricePerSqm: 2450, avgYield: 5.6, transactionVolume: 13500 },
      { year: 2024, avgPricePerSqm: 2700, avgYield: 5.7, transactionVolume: 15000 },
      { year: 2025, avgPricePerSqm: 2950, avgYield: 5.6, transactionVolume: 16000 },
      { year: 2026, avgPricePerSqm: 3150, avgYield: 5.5, transactionVolume: 16800 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Seville - moderate growth
  {
    cityId: 'seville',
    trends: [
      { year: 2022, avgPricePerSqm: 2000, avgYield: 5.2, transactionVolume: 10000 },
      { year: 2023, avgPricePerSqm: 2120, avgYield: 5.3, transactionVolume: 10800 },
      { year: 2024, avgPricePerSqm: 2250, avgYield: 5.4, transactionVolume: 11500 },
      { year: 2025, avgPricePerSqm: 2400, avgYield: 5.5, transactionVolume: 12200 },
      { year: 2026, avgPricePerSqm: 2550, avgYield: 5.4, transactionVolume: 12800 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Portugal ---
  // Lisbon - strong growth but slowing, neutral
  {
    cityId: 'lisbon',
    trends: [
      { year: 2022, avgPricePerSqm: 4000, avgYield: 4.5, transactionVolume: 22000 },
      { year: 2023, avgPricePerSqm: 4400, avgYield: 4.3, transactionVolume: 21000 },
      { year: 2024, avgPricePerSqm: 4700, avgYield: 4.1, transactionVolume: 20000 },
      { year: 2025, avgPricePerSqm: 4900, avgYield: 4.0, transactionVolume: 19500 },
      { year: 2026, avgPricePerSqm: 5050, avgYield: 3.9, transactionVolume: 19000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Porto - strong growth, hotMarket
  {
    cityId: 'porto',
    trends: [
      { year: 2022, avgPricePerSqm: 2500, avgYield: 5.5, transactionVolume: 11000 },
      { year: 2023, avgPricePerSqm: 2800, avgYield: 5.7, transactionVolume: 12500 },
      { year: 2024, avgPricePerSqm: 3100, avgYield: 5.8, transactionVolume: 14000 },
      { year: 2025, avgPricePerSqm: 3400, avgYield: 5.9, transactionVolume: 15500 },
      { year: 2026, avgPricePerSqm: 3700, avgYield: 5.8, transactionVolume: 16500 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Faro - seasonal, moderate growth
  {
    cityId: 'faro',
    trends: [
      { year: 2022, avgPricePerSqm: 2200, avgYield: 5.8, transactionVolume: 3200 },
      { year: 2023, avgPricePerSqm: 2400, avgYield: 5.9, transactionVolume: 3500 },
      { year: 2024, avgPricePerSqm: 2600, avgYield: 6.0, transactionVolume: 3800 },
      { year: 2025, avgPricePerSqm: 2800, avgYield: 5.9, transactionVolume: 4000 },
      { year: 2026, avgPricePerSqm: 2950, avgYield: 5.8, transactionVolume: 4200 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Italy ---
  // Rome - stable, premium market
  {
    cityId: 'rome',
    trends: [
      { year: 2022, avgPricePerSqm: 3400, avgYield: 4.0, transactionVolume: 35000 },
      { year: 2023, avgPricePerSqm: 3450, avgYield: 4.0, transactionVolume: 34500 },
      { year: 2024, avgPricePerSqm: 3550, avgYield: 4.1, transactionVolume: 35000 },
      { year: 2025, avgPricePerSqm: 3650, avgYield: 4.1, transactionVolume: 35500 },
      { year: 2026, avgPricePerSqm: 3750, avgYield: 4.0, transactionVolume: 36000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Milan - steady growth, business-driven
  {
    cityId: 'milan',
    trends: [
      { year: 2022, avgPricePerSqm: 4500, avgYield: 4.2, transactionVolume: 28000 },
      { year: 2023, avgPricePerSqm: 4700, avgYield: 4.3, transactionVolume: 29000 },
      { year: 2024, avgPricePerSqm: 4900, avgYield: 4.3, transactionVolume: 30000 },
      { year: 2025, avgPricePerSqm: 5100, avgYield: 4.4, transactionVolume: 31000 },
      { year: 2026, avgPricePerSqm: 5300, avgYield: 4.3, transactionVolume: 31500 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Florence - tourism-driven, stable
  {
    cityId: 'florence',
    trends: [
      { year: 2022, avgPricePerSqm: 3800, avgYield: 4.5, transactionVolume: 6500 },
      { year: 2023, avgPricePerSqm: 3900, avgYield: 4.5, transactionVolume: 6600 },
      { year: 2024, avgPricePerSqm: 4050, avgYield: 4.6, transactionVolume: 6800 },
      { year: 2025, avgPricePerSqm: 4200, avgYield: 4.5, transactionVolume: 7000 },
      { year: 2026, avgPricePerSqm: 4350, avgYield: 4.5, transactionVolume: 7100 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Naples - affordable, growing interest
  {
    cityId: 'naples',
    trends: [
      { year: 2022, avgPricePerSqm: 1800, avgYield: 5.5, transactionVolume: 9500 },
      { year: 2023, avgPricePerSqm: 1950, avgYield: 5.7, transactionVolume: 10500 },
      { year: 2024, avgPricePerSqm: 2100, avgYield: 5.8, transactionVolume: 11500 },
      { year: 2025, avgPricePerSqm: 2280, avgYield: 5.9, transactionVolume: 12500 },
      { year: 2026, avgPricePerSqm: 2450, avgYield: 5.8, transactionVolume: 13200 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Bologna - university city, stable growth
  {
    cityId: 'bologna',
    trends: [
      { year: 2022, avgPricePerSqm: 3000, avgYield: 4.8, transactionVolume: 7200 },
      { year: 2023, avgPricePerSqm: 3100, avgYield: 4.9, transactionVolume: 7500 },
      { year: 2024, avgPricePerSqm: 3250, avgYield: 5.0, transactionVolume: 7800 },
      { year: 2025, avgPricePerSqm: 3400, avgYield: 5.0, transactionVolume: 8100 },
      { year: 2026, avgPricePerSqm: 3550, avgYield: 4.9, transactionVolume: 8300 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Germany ---
  // Berlin - price correction 2022-2023, recovering, neutral
  {
    cityId: 'berlin',
    trends: [
      { year: 2022, avgPricePerSqm: 5200, avgYield: 3.2, transactionVolume: 32000 },
      { year: 2023, avgPricePerSqm: 4800, avgYield: 3.5, transactionVolume: 26000 },
      { year: 2024, avgPricePerSqm: 4700, avgYield: 3.6, transactionVolume: 24000 },
      { year: 2025, avgPricePerSqm: 4850, avgYield: 3.7, transactionVolume: 27000 },
      { year: 2026, avgPricePerSqm: 5000, avgYield: 3.6, transactionVolume: 29000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Munich - premium, stable
  {
    cityId: 'munich',
    trends: [
      { year: 2022, avgPricePerSqm: 9500, avgYield: 2.8, transactionVolume: 18000 },
      { year: 2023, avgPricePerSqm: 9000, avgYield: 3.0, transactionVolume: 15000 },
      { year: 2024, avgPricePerSqm: 8800, avgYield: 3.1, transactionVolume: 14000 },
      { year: 2025, avgPricePerSqm: 9000, avgYield: 3.1, transactionVolume: 15500 },
      { year: 2026, avgPricePerSqm: 9200, avgYield: 3.0, transactionVolume: 16000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Frankfurt - financial hub, recovering from correction
  {
    cityId: 'frankfurt',
    trends: [
      { year: 2022, avgPricePerSqm: 6000, avgYield: 3.4, transactionVolume: 11000 },
      { year: 2023, avgPricePerSqm: 5600, avgYield: 3.6, transactionVolume: 9500 },
      { year: 2024, avgPricePerSqm: 5500, avgYield: 3.7, transactionVolume: 9000 },
      { year: 2025, avgPricePerSqm: 5650, avgYield: 3.7, transactionVolume: 9800 },
      { year: 2026, avgPricePerSqm: 5800, avgYield: 3.6, transactionVolume: 10200 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Hamburg - moderate growth
  {
    cityId: 'hamburg',
    trends: [
      { year: 2022, avgPricePerSqm: 5800, avgYield: 3.3, transactionVolume: 14000 },
      { year: 2023, avgPricePerSqm: 5500, avgYield: 3.5, transactionVolume: 12000 },
      { year: 2024, avgPricePerSqm: 5450, avgYield: 3.6, transactionVolume: 11500 },
      { year: 2025, avgPricePerSqm: 5600, avgYield: 3.6, transactionVolume: 12500 },
      { year: 2026, avgPricePerSqm: 5750, avgYield: 3.5, transactionVolume: 13000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Dusseldorf - stable
  {
    cityId: 'dusseldorf',
    trends: [
      { year: 2022, avgPricePerSqm: 4800, avgYield: 3.5, transactionVolume: 8500 },
      { year: 2023, avgPricePerSqm: 4550, avgYield: 3.7, transactionVolume: 7800 },
      { year: 2024, avgPricePerSqm: 4500, avgYield: 3.8, transactionVolume: 7500 },
      { year: 2025, avgPricePerSqm: 4600, avgYield: 3.8, transactionVolume: 7800 },
      { year: 2026, avgPricePerSqm: 4750, avgYield: 3.7, transactionVolume: 8000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },

  // --- Netherlands ---
  // Amsterdam - high prices, slowing, neutral
  {
    cityId: 'amsterdam',
    trends: [
      { year: 2022, avgPricePerSqm: 7200, avgYield: 3.5, transactionVolume: 16000 },
      { year: 2023, avgPricePerSqm: 7000, avgYield: 3.6, transactionVolume: 14500 },
      { year: 2024, avgPricePerSqm: 7100, avgYield: 3.6, transactionVolume: 14000 },
      { year: 2025, avgPricePerSqm: 7300, avgYield: 3.5, transactionVolume: 14500 },
      { year: 2026, avgPricePerSqm: 7450, avgYield: 3.4, transactionVolume: 14800 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Rotterdam - more affordable, growing
  {
    cityId: 'rotterdam',
    trends: [
      { year: 2022, avgPricePerSqm: 3800, avgYield: 4.5, transactionVolume: 9500 },
      { year: 2023, avgPricePerSqm: 3900, avgYield: 4.6, transactionVolume: 9800 },
      { year: 2024, avgPricePerSqm: 4050, avgYield: 4.6, transactionVolume: 10200 },
      { year: 2025, avgPricePerSqm: 4200, avgYield: 4.7, transactionVolume: 10600 },
      { year: 2026, avgPricePerSqm: 4400, avgYield: 4.6, transactionVolume: 10900 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // The Hague - government city, stable
  {
    cityId: 'the-hague',
    trends: [
      { year: 2022, avgPricePerSqm: 3600, avgYield: 4.2, transactionVolume: 7500 },
      { year: 2023, avgPricePerSqm: 3650, avgYield: 4.3, transactionVolume: 7400 },
      { year: 2024, avgPricePerSqm: 3750, avgYield: 4.3, transactionVolume: 7600 },
      { year: 2025, avgPricePerSqm: 3850, avgYield: 4.3, transactionVolume: 7800 },
      { year: 2026, avgPricePerSqm: 3950, avgYield: 4.2, transactionVolume: 7900 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },

  // --- Belgium ---
  // Brussels - stable, moderate yields
  {
    cityId: 'brussels',
    trends: [
      { year: 2022, avgPricePerSqm: 3200, avgYield: 4.5, transactionVolume: 14000 },
      { year: 2023, avgPricePerSqm: 3250, avgYield: 4.5, transactionVolume: 13800 },
      { year: 2024, avgPricePerSqm: 3350, avgYield: 4.6, transactionVolume: 14200 },
      { year: 2025, avgPricePerSqm: 3450, avgYield: 4.6, transactionVolume: 14500 },
      { year: 2026, avgPricePerSqm: 3550, avgYield: 4.5, transactionVolume: 14700 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Antwerp - moderate growth
  {
    cityId: 'antwerp',
    trends: [
      { year: 2022, avgPricePerSqm: 2800, avgYield: 4.8, transactionVolume: 8500 },
      { year: 2023, avgPricePerSqm: 2900, avgYield: 4.9, transactionVolume: 8800 },
      { year: 2024, avgPricePerSqm: 3000, avgYield: 4.9, transactionVolume: 9100 },
      { year: 2025, avgPricePerSqm: 3100, avgYield: 5.0, transactionVolume: 9400 },
      { year: 2026, avgPricePerSqm: 3200, avgYield: 4.9, transactionVolume: 9600 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Ghent - university city, stable
  {
    cityId: 'ghent',
    trends: [
      { year: 2022, avgPricePerSqm: 3000, avgYield: 4.4, transactionVolume: 5200 },
      { year: 2023, avgPricePerSqm: 3080, avgYield: 4.5, transactionVolume: 5400 },
      { year: 2024, avgPricePerSqm: 3180, avgYield: 4.5, transactionVolume: 5600 },
      { year: 2025, avgPricePerSqm: 3280, avgYield: 4.5, transactionVolume: 5800 },
      { year: 2026, avgPricePerSqm: 3380, avgYield: 4.4, transactionVolume: 5900 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },

  // --- Austria ---
  // Vienna - stable, neutral
  {
    cityId: 'vienna',
    trends: [
      { year: 2022, avgPricePerSqm: 5500, avgYield: 3.5, transactionVolume: 18000 },
      { year: 2023, avgPricePerSqm: 5400, avgYield: 3.6, transactionVolume: 17000 },
      { year: 2024, avgPricePerSqm: 5450, avgYield: 3.6, transactionVolume: 17200 },
      { year: 2025, avgPricePerSqm: 5500, avgYield: 3.6, transactionVolume: 17500 },
      { year: 2026, avgPricePerSqm: 5600, avgYield: 3.5, transactionVolume: 17800 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Graz - university city, moderate growth
  {
    cityId: 'graz',
    trends: [
      { year: 2022, avgPricePerSqm: 3200, avgYield: 4.2, transactionVolume: 5500 },
      { year: 2023, avgPricePerSqm: 3150, avgYield: 4.3, transactionVolume: 5200 },
      { year: 2024, avgPricePerSqm: 3200, avgYield: 4.4, transactionVolume: 5400 },
      { year: 2025, avgPricePerSqm: 3300, avgYield: 4.4, transactionVolume: 5600 },
      { year: 2026, avgPricePerSqm: 3400, avgYield: 4.3, transactionVolume: 5700 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Salzburg - tourism-driven, premium
  {
    cityId: 'salzburg',
    trends: [
      { year: 2022, avgPricePerSqm: 5000, avgYield: 3.8, transactionVolume: 3200 },
      { year: 2023, avgPricePerSqm: 4950, avgYield: 3.9, transactionVolume: 3000 },
      { year: 2024, avgPricePerSqm: 5000, avgYield: 3.9, transactionVolume: 3100 },
      { year: 2025, avgPricePerSqm: 5100, avgYield: 3.9, transactionVolume: 3200 },
      { year: 2026, avgPricePerSqm: 5200, avgYield: 3.8, transactionVolume: 3300 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },

  // --- Ireland ---
  // Dublin - very high prices, slowing, neutral
  {
    cityId: 'dublin',
    trends: [
      { year: 2022, avgPricePerSqm: 5800, avgYield: 4.0, transactionVolume: 15000 },
      { year: 2023, avgPricePerSqm: 5900, avgYield: 3.9, transactionVolume: 14200 },
      { year: 2024, avgPricePerSqm: 6000, avgYield: 3.8, transactionVolume: 13800 },
      { year: 2025, avgPricePerSqm: 6050, avgYield: 3.8, transactionVolume: 13500 },
      { year: 2026, avgPricePerSqm: 6100, avgYield: 3.7, transactionVolume: 13200 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Cork - moderate growth
  {
    cityId: 'cork',
    trends: [
      { year: 2022, avgPricePerSqm: 3500, avgYield: 4.8, transactionVolume: 5200 },
      { year: 2023, avgPricePerSqm: 3600, avgYield: 4.9, transactionVolume: 5400 },
      { year: 2024, avgPricePerSqm: 3750, avgYield: 5.0, transactionVolume: 5600 },
      { year: 2025, avgPricePerSqm: 3900, avgYield: 5.0, transactionVolume: 5800 },
      { year: 2026, avgPricePerSqm: 4050, avgYield: 4.9, transactionVolume: 6000 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Poland ---
  // Warsaw - strong growth, bullish, hotMarket
  {
    cityId: 'warsaw',
    trends: [
      { year: 2022, avgPricePerSqm: 2800, avgYield: 5.5, transactionVolume: 28000 },
      { year: 2023, avgPricePerSqm: 3100, avgYield: 5.7, transactionVolume: 31000 },
      { year: 2024, avgPricePerSqm: 3450, avgYield: 5.9, transactionVolume: 34000 },
      { year: 2025, avgPricePerSqm: 3800, avgYield: 6.0, transactionVolume: 37000 },
      { year: 2026, avgPricePerSqm: 4100, avgYield: 5.9, transactionVolume: 39000 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Krakow - strong growth, hotMarket
  {
    cityId: 'krakow',
    trends: [
      { year: 2022, avgPricePerSqm: 2200, avgYield: 5.8, transactionVolume: 14000 },
      { year: 2023, avgPricePerSqm: 2500, avgYield: 6.0, transactionVolume: 16000 },
      { year: 2024, avgPricePerSqm: 2800, avgYield: 6.2, transactionVolume: 18000 },
      { year: 2025, avgPricePerSqm: 3100, avgYield: 6.3, transactionVolume: 20000 },
      { year: 2026, avgPricePerSqm: 3350, avgYield: 6.2, transactionVolume: 21500 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Wroclaw - moderate growth
  {
    cityId: 'wroclaw',
    trends: [
      { year: 2022, avgPricePerSqm: 2000, avgYield: 5.6, transactionVolume: 10000 },
      { year: 2023, avgPricePerSqm: 2200, avgYield: 5.8, transactionVolume: 11500 },
      { year: 2024, avgPricePerSqm: 2400, avgYield: 5.9, transactionVolume: 12800 },
      { year: 2025, avgPricePerSqm: 2600, avgYield: 6.0, transactionVolume: 14000 },
      { year: 2026, avgPricePerSqm: 2800, avgYield: 5.9, transactionVolume: 15000 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Gdansk - coastal, tourism + tech growth
  {
    cityId: 'gdansk',
    trends: [
      { year: 2022, avgPricePerSqm: 2300, avgYield: 5.5, transactionVolume: 8500 },
      { year: 2023, avgPricePerSqm: 2550, avgYield: 5.7, transactionVolume: 9500 },
      { year: 2024, avgPricePerSqm: 2800, avgYield: 5.8, transactionVolume: 10500 },
      { year: 2025, avgPricePerSqm: 3050, avgYield: 5.9, transactionVolume: 11500 },
      { year: 2026, avgPricePerSqm: 3250, avgYield: 5.8, transactionVolume: 12200 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Czechia ---
  // Prague - steady growth, neutral
  {
    cityId: 'prague',
    trends: [
      { year: 2022, avgPricePerSqm: 4200, avgYield: 4.0, transactionVolume: 16000 },
      { year: 2023, avgPricePerSqm: 4300, avgYield: 4.1, transactionVolume: 15500 },
      { year: 2024, avgPricePerSqm: 4450, avgYield: 4.2, transactionVolume: 16000 },
      { year: 2025, avgPricePerSqm: 4600, avgYield: 4.2, transactionVolume: 16500 },
      { year: 2026, avgPricePerSqm: 4750, avgYield: 4.1, transactionVolume: 17000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Brno - university city, moderate growth
  {
    cityId: 'brno',
    trends: [
      { year: 2022, avgPricePerSqm: 3000, avgYield: 4.8, transactionVolume: 5500 },
      { year: 2023, avgPricePerSqm: 3100, avgYield: 4.9, transactionVolume: 5800 },
      { year: 2024, avgPricePerSqm: 3250, avgYield: 5.0, transactionVolume: 6100 },
      { year: 2025, avgPricePerSqm: 3400, avgYield: 5.1, transactionVolume: 6400 },
      { year: 2026, avgPricePerSqm: 3550, avgYield: 5.0, transactionVolume: 6600 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Hungary ---
  // Budapest - strong growth, bullish, hotMarket
  {
    cityId: 'budapest',
    trends: [
      { year: 2022, avgPricePerSqm: 2000, avgYield: 5.8, transactionVolume: 22000 },
      { year: 2023, avgPricePerSqm: 2300, avgYield: 6.0, transactionVolume: 25000 },
      { year: 2024, avgPricePerSqm: 2650, avgYield: 6.2, transactionVolume: 28000 },
      { year: 2025, avgPricePerSqm: 3000, avgYield: 6.4, transactionVolume: 31000 },
      { year: 2026, avgPricePerSqm: 3350, avgYield: 6.3, transactionVolume: 33000 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Debrecen - affordable, emerging
  {
    cityId: 'debrecen',
    trends: [
      { year: 2022, avgPricePerSqm: 1100, avgYield: 6.5, transactionVolume: 3500 },
      { year: 2023, avgPricePerSqm: 1250, avgYield: 6.7, transactionVolume: 4000 },
      { year: 2024, avgPricePerSqm: 1400, avgYield: 6.9, transactionVolume: 4500 },
      { year: 2025, avgPricePerSqm: 1580, avgYield: 7.0, transactionVolume: 5000 },
      { year: 2026, avgPricePerSqm: 1750, avgYield: 6.9, transactionVolume: 5400 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Romania ---
  // Bucharest - strong growth, bullish, hotMarket
  {
    cityId: 'bucharest',
    trends: [
      { year: 2022, avgPricePerSqm: 1500, avgYield: 6.2, transactionVolume: 18000 },
      { year: 2023, avgPricePerSqm: 1700, avgYield: 6.5, transactionVolume: 21000 },
      { year: 2024, avgPricePerSqm: 1950, avgYield: 6.7, transactionVolume: 24000 },
      { year: 2025, avgPricePerSqm: 2200, avgYield: 6.9, transactionVolume: 27000 },
      { year: 2026, avgPricePerSqm: 2450, avgYield: 6.8, transactionVolume: 29000 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Cluj-Napoca - tech hub, strong growth
  {
    cityId: 'cluj-napoca',
    trends: [
      { year: 2022, avgPricePerSqm: 1800, avgYield: 5.8, transactionVolume: 6500 },
      { year: 2023, avgPricePerSqm: 2000, avgYield: 6.0, transactionVolume: 7500 },
      { year: 2024, avgPricePerSqm: 2250, avgYield: 6.1, transactionVolume: 8500 },
      { year: 2025, avgPricePerSqm: 2500, avgYield: 6.2, transactionVolume: 9500 },
      { year: 2026, avgPricePerSqm: 2750, avgYield: 6.1, transactionVolume: 10200 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Timisoara - emerging, moderate growth
  {
    cityId: 'timisoara',
    trends: [
      { year: 2022, avgPricePerSqm: 1200, avgYield: 6.5, transactionVolume: 4500 },
      { year: 2023, avgPricePerSqm: 1350, avgYield: 6.7, transactionVolume: 5200 },
      { year: 2024, avgPricePerSqm: 1500, avgYield: 6.8, transactionVolume: 5900 },
      { year: 2025, avgPricePerSqm: 1680, avgYield: 7.0, transactionVolume: 6600 },
      { year: 2026, avgPricePerSqm: 1850, avgYield: 6.9, transactionVolume: 7100 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Croatia ---
  // Zagreb - moderate growth, stable
  {
    cityId: 'zagreb',
    trends: [
      { year: 2022, avgPricePerSqm: 2000, avgYield: 4.8, transactionVolume: 8500 },
      { year: 2023, avgPricePerSqm: 2100, avgYield: 4.9, transactionVolume: 8800 },
      { year: 2024, avgPricePerSqm: 2250, avgYield: 5.0, transactionVolume: 9200 },
      { year: 2025, avgPricePerSqm: 2400, avgYield: 5.0, transactionVolume: 9500 },
      { year: 2026, avgPricePerSqm: 2550, avgYield: 4.9, transactionVolume: 9800 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Split - tourism-driven growth, bullish, hotMarket
  {
    cityId: 'split',
    trends: [
      { year: 2022, avgPricePerSqm: 2800, avgYield: 6.0, transactionVolume: 4500 },
      { year: 2023, avgPricePerSqm: 3100, avgYield: 6.3, transactionVolume: 5200 },
      { year: 2024, avgPricePerSqm: 3450, avgYield: 6.5, transactionVolume: 6000 },
      { year: 2025, avgPricePerSqm: 3800, avgYield: 6.7, transactionVolume: 6800 },
      { year: 2026, avgPricePerSqm: 4100, avgYield: 6.6, transactionVolume: 7300 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Dubrovnik - premium tourism, high prices
  {
    cityId: 'dubrovnik',
    trends: [
      { year: 2022, avgPricePerSqm: 4000, avgYield: 5.5, transactionVolume: 1800 },
      { year: 2023, avgPricePerSqm: 4300, avgYield: 5.6, transactionVolume: 2000 },
      { year: 2024, avgPricePerSqm: 4600, avgYield: 5.7, transactionVolume: 2200 },
      { year: 2025, avgPricePerSqm: 4900, avgYield: 5.6, transactionVolume: 2300 },
      { year: 2026, avgPricePerSqm: 5150, avgYield: 5.5, transactionVolume: 2400 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Denmark ---
  // Copenhagen - high prices, stable, neutral
  {
    cityId: 'copenhagen',
    trends: [
      { year: 2022, avgPricePerSqm: 6200, avgYield: 3.2, transactionVolume: 12000 },
      { year: 2023, avgPricePerSqm: 6100, avgYield: 3.3, transactionVolume: 11500 },
      { year: 2024, avgPricePerSqm: 6150, avgYield: 3.3, transactionVolume: 11800 },
      { year: 2025, avgPricePerSqm: 6250, avgYield: 3.3, transactionVolume: 12000 },
      { year: 2026, avgPricePerSqm: 6350, avgYield: 3.2, transactionVolume: 12200 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Aarhus - moderate, university city
  {
    cityId: 'aarhus',
    trends: [
      { year: 2022, avgPricePerSqm: 3500, avgYield: 4.0, transactionVolume: 5000 },
      { year: 2023, avgPricePerSqm: 3550, avgYield: 4.1, transactionVolume: 5100 },
      { year: 2024, avgPricePerSqm: 3650, avgYield: 4.1, transactionVolume: 5200 },
      { year: 2025, avgPricePerSqm: 3750, avgYield: 4.1, transactionVolume: 5300 },
      { year: 2026, avgPricePerSqm: 3850, avgYield: 4.0, transactionVolume: 5400 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },

  // --- Sweden ---
  // Stockholm - high prices, price correction, neutral
  {
    cityId: 'stockholm',
    trends: [
      { year: 2022, avgPricePerSqm: 7500, avgYield: 2.8, transactionVolume: 18000 },
      { year: 2023, avgPricePerSqm: 7000, avgYield: 3.0, transactionVolume: 15000 },
      { year: 2024, avgPricePerSqm: 6900, avgYield: 3.1, transactionVolume: 14500 },
      { year: 2025, avgPricePerSqm: 7100, avgYield: 3.1, transactionVolume: 15500 },
      { year: 2026, avgPricePerSqm: 7250, avgYield: 3.0, transactionVolume: 16000 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Gothenburg - moderate, stable
  {
    cityId: 'gothenburg',
    trends: [
      { year: 2022, avgPricePerSqm: 4800, avgYield: 3.5, transactionVolume: 8500 },
      { year: 2023, avgPricePerSqm: 4600, avgYield: 3.6, transactionVolume: 7800 },
      { year: 2024, avgPricePerSqm: 4550, avgYield: 3.7, transactionVolume: 7600 },
      { year: 2025, avgPricePerSqm: 4650, avgYield: 3.7, transactionVolume: 7900 },
      { year: 2026, avgPricePerSqm: 4800, avgYield: 3.6, transactionVolume: 8100 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Malmo - affordable for Sweden, moderate growth
  {
    cityId: 'malmo',
    trends: [
      { year: 2022, avgPricePerSqm: 3200, avgYield: 4.0, transactionVolume: 5500 },
      { year: 2023, avgPricePerSqm: 3100, avgYield: 4.1, transactionVolume: 5200 },
      { year: 2024, avgPricePerSqm: 3150, avgYield: 4.2, transactionVolume: 5300 },
      { year: 2025, avgPricePerSqm: 3250, avgYield: 4.2, transactionVolume: 5500 },
      { year: 2026, avgPricePerSqm: 3350, avgYield: 4.1, transactionVolume: 5600 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },

  // --- Norway ---
  // Oslo - very high prices, stable
  {
    cityId: 'oslo',
    trends: [
      { year: 2022, avgPricePerSqm: 8000, avgYield: 2.5, transactionVolume: 14000 },
      { year: 2023, avgPricePerSqm: 7800, avgYield: 2.6, transactionVolume: 13000 },
      { year: 2024, avgPricePerSqm: 7900, avgYield: 2.7, transactionVolume: 13500 },
      { year: 2025, avgPricePerSqm: 8100, avgYield: 2.7, transactionVolume: 14000 },
      { year: 2026, avgPricePerSqm: 8300, avgYield: 2.6, transactionVolume: 14200 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
  // Bergen - stable, moderate
  {
    cityId: 'bergen',
    trends: [
      { year: 2022, avgPricePerSqm: 4500, avgYield: 3.2, transactionVolume: 4800 },
      { year: 2023, avgPricePerSqm: 4450, avgYield: 3.3, transactionVolume: 4600 },
      { year: 2024, avgPricePerSqm: 4500, avgYield: 3.3, transactionVolume: 4700 },
      { year: 2025, avgPricePerSqm: 4600, avgYield: 3.3, transactionVolume: 4800 },
      { year: 2026, avgPricePerSqm: 4700, avgYield: 3.2, transactionVolume: 4900 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },

  // --- Estonia ---
  // Tallinn - strong growth, bullish, hotMarket
  {
    cityId: 'tallinn',
    trends: [
      { year: 2022, avgPricePerSqm: 2200, avgYield: 5.5, transactionVolume: 7500 },
      { year: 2023, avgPricePerSqm: 2450, avgYield: 5.7, transactionVolume: 8500 },
      { year: 2024, avgPricePerSqm: 2750, avgYield: 5.9, transactionVolume: 9500 },
      { year: 2025, avgPricePerSqm: 3050, avgYield: 6.0, transactionVolume: 10500 },
      { year: 2026, avgPricePerSqm: 3300, avgYield: 5.9, transactionVolume: 11200 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Tartu - university city, moderate
  {
    cityId: 'tartu',
    trends: [
      { year: 2022, avgPricePerSqm: 1500, avgYield: 5.8, transactionVolume: 2800 },
      { year: 2023, avgPricePerSqm: 1650, avgYield: 6.0, transactionVolume: 3100 },
      { year: 2024, avgPricePerSqm: 1800, avgYield: 6.1, transactionVolume: 3400 },
      { year: 2025, avgPricePerSqm: 1950, avgYield: 6.2, transactionVolume: 3700 },
      { year: 2026, avgPricePerSqm: 2100, avgYield: 6.1, transactionVolume: 3900 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Latvia ---
  // Riga - moderate growth
  {
    cityId: 'riga',
    trends: [
      { year: 2022, avgPricePerSqm: 1600, avgYield: 5.5, transactionVolume: 7000 },
      { year: 2023, avgPricePerSqm: 1750, avgYield: 5.7, transactionVolume: 7500 },
      { year: 2024, avgPricePerSqm: 1900, avgYield: 5.8, transactionVolume: 8000 },
      { year: 2025, avgPricePerSqm: 2050, avgYield: 5.9, transactionVolume: 8500 },
      { year: 2026, avgPricePerSqm: 2200, avgYield: 5.8, transactionVolume: 8900 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Lithuania ---
  // Vilnius - strong growth, bullish, hotMarket
  {
    cityId: 'vilnius',
    trends: [
      { year: 2022, avgPricePerSqm: 2000, avgYield: 5.5, transactionVolume: 9000 },
      { year: 2023, avgPricePerSqm: 2250, avgYield: 5.7, transactionVolume: 10200 },
      { year: 2024, avgPricePerSqm: 2550, avgYield: 5.9, transactionVolume: 11500 },
      { year: 2025, avgPricePerSqm: 2850, avgYield: 6.0, transactionVolume: 12800 },
      { year: 2026, avgPricePerSqm: 3100, avgYield: 5.9, transactionVolume: 13800 },
    ],
    forecast: 'bullish',
    hotMarket: true,
  },
  // Kaunas - moderate growth
  {
    cityId: 'kaunas',
    trends: [
      { year: 2022, avgPricePerSqm: 1400, avgYield: 5.8, transactionVolume: 4500 },
      { year: 2023, avgPricePerSqm: 1550, avgYield: 6.0, transactionVolume: 5000 },
      { year: 2024, avgPricePerSqm: 1700, avgYield: 6.1, transactionVolume: 5500 },
      { year: 2025, avgPricePerSqm: 1850, avgYield: 6.2, transactionVolume: 6000 },
      { year: 2026, avgPricePerSqm: 2000, avgYield: 6.1, transactionVolume: 6400 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },

  // --- Cyprus ---
  // Limassol - strong growth, premium coastal
  {
    cityId: 'limassol',
    trends: [
      { year: 2022, avgPricePerSqm: 3000, avgYield: 4.5, transactionVolume: 5500 },
      { year: 2023, avgPricePerSqm: 3200, avgYield: 4.6, transactionVolume: 5800 },
      { year: 2024, avgPricePerSqm: 3450, avgYield: 4.7, transactionVolume: 6200 },
      { year: 2025, avgPricePerSqm: 3700, avgYield: 4.7, transactionVolume: 6500 },
      { year: 2026, avgPricePerSqm: 3950, avgYield: 4.6, transactionVolume: 6800 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Paphos - tourism-driven, moderate
  {
    cityId: 'paphos',
    trends: [
      { year: 2022, avgPricePerSqm: 1800, avgYield: 5.5, transactionVolume: 2800 },
      { year: 2023, avgPricePerSqm: 1950, avgYield: 5.6, transactionVolume: 3000 },
      { year: 2024, avgPricePerSqm: 2100, avgYield: 5.7, transactionVolume: 3200 },
      { year: 2025, avgPricePerSqm: 2250, avgYield: 5.7, transactionVolume: 3400 },
      { year: 2026, avgPricePerSqm: 2400, avgYield: 5.6, transactionVolume: 3600 },
    ],
    forecast: 'bullish',
    hotMarket: false,
  },
  // Nicosia - capital, stable
  {
    cityId: 'nicosia',
    trends: [
      { year: 2022, avgPricePerSqm: 1500, avgYield: 5.0, transactionVolume: 4000 },
      { year: 2023, avgPricePerSqm: 1580, avgYield: 5.1, transactionVolume: 4200 },
      { year: 2024, avgPricePerSqm: 1660, avgYield: 5.2, transactionVolume: 4400 },
      { year: 2025, avgPricePerSqm: 1750, avgYield: 5.2, transactionVolume: 4600 },
      { year: 2026, avgPricePerSqm: 1850, avgYield: 5.1, transactionVolume: 4800 },
    ],
    forecast: 'neutral',
    hotMarket: false,
  },
];

export function getMarketData(cityId: string): CityMarketData | undefined {
  return marketTrends.find(m => m.cityId === cityId);
}
