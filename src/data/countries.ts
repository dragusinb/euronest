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
  },
  {
    id: 'spain',
    name: 'Spain',
    code: 'ES',
    flag: '\u{1F1EA}\u{1F1F8}',
    center: [40.0, -3.7],
    zoom: 6,
    currency: 'EUR',
    summary: 'Spain is one of Europe\'s most popular property markets for foreign investors, driven by world-class tourism infrastructure and year-round sunshine. The Golden Visa program was suspended in 2025 but the market remains highly liquid with Idealista as the dominant property portal.',
    investmentHighlights: [
      'Third most visited country globally with 85M+ annual tourists',
      'Idealista provides transparent, centralized property listings',
      'Strong short-term rental yields in coastal and urban areas',
      'Relatively affordable compared to Northern Europe',
      'Well-established legal framework for foreign buyers'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 3,
      marketLiquidity: 4,
      taxFavorability: 3
    }
  },
  {
    id: 'portugal',
    name: 'Portugal',
    code: 'PT',
    flag: '\u{1F1F5}\u{1F1F9}',
    center: [39.4, -8.2],
    zoom: 7,
    currency: 'EUR',
    summary: 'Portugal has attracted a large expat and digital nomad community thanks to its mild climate, low cost of living, and formerly generous NHR tax regime. The Golden Visa program was reformed to exclude real estate in 2023, but the market remains strong in Lisbon, Porto, and the Algarve.',
    investmentHighlights: [
      'Strong expat demand in Lisbon, Porto, and Algarve',
      'AL (Alojamento Local) license enables short-term rentals',
      'Growing tech sector driving rental demand in Lisbon',
      'No restrictions on foreign property ownership',
      'Competitive property prices relative to Western Europe'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 4
    }
  },
  {
    id: 'italy',
    name: 'Italy',
    code: 'IT',
    flag: '\u{1F1EE}\u{1F1F9}',
    center: [42.5, 12.5],
    zoom: 6,
    currency: 'EUR',
    summary: 'Italy offers a diverse property market ranging from bargain rural homes to premium Lake Como and Amalfi Coast villas. The flat tax regime for new residents (\u20AC100k/year) attracts high-net-worth individuals, though bureaucracy and slow legal processes require patience.',
    investmentHighlights: [
      'Flat tax option (\u20AC100k/year) for new tax residents',
      'Strong tourism in Rome, Florence, Milan, and coastal areas',
      '\u20AC1 house programs in depopulated villages',
      'Large and diverse market with significant regional variation',
      'Cedolare secca flat tax on rental income (21%)'
    ],
    scores: {
      easeOfPurchase: 3,
      rentalFriendliness: 3,
      marketLiquidity: 3,
      taxFavorability: 3
    }
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'DE',
    flag: '\u{1F1E9}\u{1F1EA}',
    center: [51.2, 10.5],
    zoom: 6,
    currency: 'EUR',
    summary: 'Germany has Europe\'s largest economy and one of its most stable property markets, but strong tenant protections make it challenging for landlords. The Mietpreisbremse (rent brake) caps rent increases in major cities, and evictions are difficult.',
    investmentHighlights: [
      'No restrictions on foreign buyers, transparent process',
      'Europe\'s largest and most stable economy',
      'Tax-free capital gains after 10 years of ownership',
      'High demand in Berlin, Munich, Hamburg, and Frankfurt',
      'Strong rule of law and property rights protections'
    ],
    scores: {
      easeOfPurchase: 5,
      rentalFriendliness: 2,
      marketLiquidity: 5,
      taxFavorability: 3
    }
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    code: 'NL',
    flag: '\u{1F1F3}\u{1F1F1}',
    center: [52.1, 5.3],
    zoom: 7,
    currency: 'EUR',
    summary: 'The Netherlands has a highly transparent and efficient property market with no restrictions on foreign buyers. However, high prices, box 3 wealth tax on property, and increasing regulation of the rental sector make it challenging for yield-focused investors.',
    investmentHighlights: [
      'Highly transparent market with reliable land registry (Kadaster)',
      'Strong demand in Amsterdam, Rotterdam, The Hague, and Utrecht',
      'No restrictions on foreign ownership',
      'High property values provide strong capital appreciation potential',
      'Excellent infrastructure and international connectivity'
    ],
    scores: {
      easeOfPurchase: 5,
      rentalFriendliness: 3,
      marketLiquidity: 5,
      taxFavorability: 2
    }
  },
  {
    id: 'belgium',
    name: 'Belgium',
    code: 'BE',
    flag: '\u{1F1E7}\u{1F1EA}',
    center: [50.5, 4.5],
    zoom: 8,
    currency: 'EUR',
    summary: 'Belgium offers reasonable rental yields and a stable market, but its complex federal structure means tax rules and regulations vary between Flanders, Wallonia, and Brussels. Registration fees are high but the market is accessible to foreign buyers.',
    investmentHighlights: [
      'No restrictions on foreign property purchases',
      'Brussels benefits from EU institution demand',
      'Reasonable rental yields compared to neighboring countries',
      'Stable, mature market with predictable price growth',
      'Strong legal protections for property owners'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 3,
      marketLiquidity: 4,
      taxFavorability: 3
    }
  },
  {
    id: 'austria',
    name: 'Austria',
    code: 'AT',
    flag: '\u{1F1E6}\u{1F1F9}',
    center: [47.5, 14.5],
    zoom: 7,
    currency: 'EUR',
    summary: 'Austria has a stable, high-quality property market centered around Vienna, but some states impose restrictions on non-EU buyers requiring approval from local authorities. Rental yields are moderate and the market is well-regulated.',
    investmentHighlights: [
      'Vienna consistently ranked among world\'s most livable cities',
      'Strong tourism in Salzburg, Tyrol, and alpine regions',
      'Stable economy with low unemployment',
      'Well-regulated market with strong property rights',
      'EU citizens can buy freely in most states'
    ],
    scores: {
      easeOfPurchase: 3,
      rentalFriendliness: 3,
      marketLiquidity: 4,
      taxFavorability: 3
    }
  },
  {
    id: 'ireland',
    name: 'Ireland',
    code: 'IE',
    flag: '\u{1F1EE}\u{1F1EA}',
    center: [53.1, -8.0],
    zoom: 7,
    currency: 'EUR',
    summary: 'Ireland is experiencing a significant housing shortage driving strong rental yields, particularly in Dublin. No restrictions exist on foreign buyers, and the market benefits from a large multinational tech and pharma workforce creating sustained demand.',
    investmentHighlights: [
      'Severe housing shortage supports strong rental demand',
      'No restrictions on foreign property purchases',
      'High rental yields in Dublin (5-7% gross)',
      'Major multinational employer base (tech, pharma)',
      'English-speaking market with common law legal system'
    ],
    scores: {
      easeOfPurchase: 5,
      rentalFriendliness: 3,
      marketLiquidity: 4,
      taxFavorability: 3
    }
  },
  {
    id: 'poland',
    name: 'Poland',
    code: 'PL',
    flag: '\u{1F1F5}\u{1F1F1}',
    center: [52.0, 19.5],
    zoom: 6,
    currency: 'PLN',
    summary: 'Poland is Central Europe\'s largest economy with a fast-growing property market offering strong rental yields at relatively low entry prices. EU citizens can purchase apartments freely, and cities like Warsaw, Krakow, and Wroclaw have robust rental demand.',
    investmentHighlights: [
      'EU citizens can buy apartments without restrictions',
      'Strong GDP growth and rising household incomes',
      'Attractive rental yields (6-8% gross in major cities)',
      'Growing IT and outsourcing sectors drive urban demand',
      'Significantly lower entry prices than Western Europe'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 4
    }
  },
  {
    id: 'czechia',
    name: 'Czech Republic',
    code: 'CZ',
    flag: '\u{1F1E8}\u{1F1FF}',
    center: [49.8, 15.5],
    zoom: 7,
    currency: 'CZK',
    summary: 'The Czech Republic has a stable, growing property market with Prague commanding premium prices comparable to some Western European capitals. EU citizens can buy freely, and the country benefits from a strong industrial base and growing tech sector.',
    investmentHighlights: [
      'EU citizens face no purchase restrictions',
      'Prague is a major tourist destination with strong Airbnb demand',
      'Low unemployment and stable economy',
      'Growing expat community in Prague and Brno',
      'Well-established legal framework for property transactions'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 3
    }
  },
  {
    id: 'hungary',
    name: 'Hungary',
    code: 'HU',
    flag: '\u{1F1ED}\u{1F1FA}',
    center: [47.2, 19.5],
    zoom: 7,
    currency: 'HUF',
    summary: 'Hungary offers some of Europe\'s lowest property prices with high rental yields, particularly in Budapest. The market is accessible to foreign buyers with permit approval, and Budapest\'s thermal baths and cultural scene drive strong tourist demand.',
    investmentHighlights: [
      'Low entry prices with gross yields of 6-9% in Budapest',
      'Budapest is a top European tourist and expat destination',
      'Flat 15% personal income tax rate',
      'Growing short-term rental market in Budapest district V-VII',
      'Significant price appreciation potential as economy develops'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 4
    }
  },
  {
    id: 'romania',
    name: 'Romania',
    code: 'RO',
    flag: '\u{1F1F7}\u{1F1F4}',
    center: [45.9, 25.0],
    zoom: 7,
    currency: 'RON',
    summary: 'Romania offers affordable property with growing urban markets driven by a booming tech sector, particularly in Bucharest, Cluj-Napoca, and Timisoara. EU citizens can purchase apartments freely, though land ownership requires a Romanian company.',
    investmentHighlights: [
      'EU citizens can buy apartments without restrictions',
      'Among the lowest property prices in the EU',
      'Rapidly growing tech sector driving urban rental demand',
      'Flat 10% income tax on rental income',
      'Strong economic growth and rising middle class'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 2,
      taxFavorability: 4
    }
  },
  {
    id: 'croatia',
    name: 'Croatia',
    code: 'HR',
    flag: '\u{1F1ED}\u{1F1F7}',
    center: [45.1, 15.2],
    zoom: 7,
    currency: 'EUR',
    summary: 'Croatia joined the eurozone in 2023, bringing currency stability to an already attractive coastal property market. The Adriatic coastline and islands drive strong seasonal tourism demand, with Dubrovnik, Split, and Istria as hotspots.',
    investmentHighlights: [
      'Eurozone membership since 2023 eliminates currency risk',
      'Strong tourism along the Adriatic coast (20M+ visitors/year)',
      'EU citizens can purchase property without restrictions',
      'High short-term rental yields in coastal areas (7-10% gross)',
      'Growing digital nomad visa attracting remote workers'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 3
    }
  },
  {
    id: 'denmark',
    name: 'Denmark',
    code: 'DK',
    flag: '\u{1F1E9}\u{1F1F0}',
    center: [56.0, 10.0],
    zoom: 7,
    currency: 'DKK',
    summary: 'Denmark has strict rules requiring buyers to be residents or demonstrate a genuine connection to the country, making it one of Europe\'s least accessible markets for foreign investors. However, the market is stable and Copenhagen commands premium prices.',
    investmentHighlights: [
      'Highly stable economy with strong rule of law',
      'Copenhagen property prices show consistent long-term growth',
      'Transparent market with reliable public property data',
      'DKK pegged to EUR providing currency stability',
      'High quality of life drives sustained housing demand'
    ],
    scores: {
      easeOfPurchase: 2,
      rentalFriendliness: 3,
      marketLiquidity: 4,
      taxFavorability: 2
    }
  },
  {
    id: 'sweden',
    name: 'Sweden',
    code: 'SE',
    flag: '\u{1F1F8}\u{1F1EA}',
    center: [63.0, 16.0],
    zoom: 5,
    currency: 'SEK',
    summary: 'Sweden has no restrictions on foreign property buyers and features the unique bostadsr\u00E4tt (tenant-owned apartment) system. Stockholm, Gothenburg, and Malm\u00F6 have strong demand, though the market experienced a correction in 2022-2023 before stabilizing.',
    investmentHighlights: [
      'No restrictions on foreign buyers',
      'Transparent market with public price data (Hemnet)',
      'Strong demand in Stockholm, Gothenburg, and Malm\u00F6',
      'Bostadsr\u00E4tt system offers lower entry prices than freehold',
      'Stable economy with high quality of life attracting talent'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 3,
      marketLiquidity: 4,
      taxFavorability: 3
    }
  },
  {
    id: 'norway',
    name: 'Norway',
    code: 'NO',
    flag: '\u{1F1F3}\u{1F1F4}',
    center: [64.0, 12.0],
    zoom: 5,
    currency: 'NOK',
    summary: 'Norway has very high property prices supported by strong oil wealth and high salaries, but moderate rental yields. While not an EU member, it is part of the EEA and has no restrictions on foreign buyers. Oslo dominates the market.',
    investmentHighlights: [
      'No restrictions on foreign property purchases',
      'Oil-backed economy provides exceptional stability',
      'Oslo property shows strong long-term capital appreciation',
      'High rental demand due to urbanization trends',
      'Transparent market with public property transaction data'
    ],
    scores: {
      easeOfPurchase: 3,
      rentalFriendliness: 3,
      marketLiquidity: 4,
      taxFavorability: 2
    }
  },
  {
    id: 'estonia',
    name: 'Estonia',
    code: 'EE',
    flag: '\u{1F1EA}\u{1F1EA}',
    center: [58.6, 25.0],
    zoom: 7,
    currency: 'EUR',
    summary: 'Estonia is Europe\'s most digitally advanced country, offering e-Residency and fully digital property transactions. Tallinn\'s growing tech scene and startup ecosystem drive strong rental demand, with affordable entry prices compared to Western Europe.',
    investmentHighlights: [
      'Fully digital property registration and e-Residency program',
      'No restrictions on foreign property purchases',
      'Growing Tallinn tech hub with rising rental demand',
      'Eurozone member with low national debt',
      'Competitive flat tax system (20% income tax)'
    ],
    scores: {
      easeOfPurchase: 5,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 4
    }
  },
  {
    id: 'latvia',
    name: 'Latvia',
    code: 'LV',
    flag: '\u{1F1F1}\u{1F1FB}',
    center: [57.0, 25.0],
    zoom: 7,
    currency: 'EUR',
    summary: 'Latvia offers affordable property in the eurozone with a Golden Visa program for non-EU investors. Riga is the primary market with reasonable yields, though the smaller market size means lower liquidity than Western European alternatives.',
    investmentHighlights: [
      'Golden Visa available for property investments over \u20AC250k',
      'Eurozone member with affordable entry prices',
      'Riga offers 5-7% gross rental yields',
      'No restrictions on EU citizens purchasing property',
      'Growing tourism sector and Riga as a Baltic hub'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 2,
      taxFavorability: 4
    }
  },
  {
    id: 'lithuania',
    name: 'Lithuania',
    code: 'LT',
    flag: '\u{1F1F1}\u{1F1F9}',
    center: [55.2, 24.0],
    zoom: 7,
    currency: 'EUR',
    summary: 'Lithuania has a fast-growing economy with Vilnius emerging as a major fintech and tech hub, driving urban rental demand. Property prices remain affordable by eurozone standards, and EU citizens can purchase freely.',
    investmentHighlights: [
      'Vilnius is a growing European fintech and tech hub',
      'EU citizens can buy property without restrictions',
      'Affordable entry prices with strong yield potential (5-8%)',
      'Eurozone member since 2015 with stable currency',
      'Rapidly growing economy with rising household incomes'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 2,
      taxFavorability: 4
    }
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    code: 'CY',
    flag: '\u{1F1E8}\u{1F1FE}',
    center: [35.1, 33.4],
    zoom: 9,
    currency: 'EUR',
    summary: 'Cyprus offers one of Europe\'s most tax-friendly environments for property investors, with no property tax on primary residences and low rental income tax. The island attracts expats, retirees, and tech companies with its Mediterranean climate and English-speaking environment.',
    investmentHighlights: [
      'No annual property tax (Immovable Property Tax abolished)',
      'Low corporate tax rate (12.5%) for property companies',
      'Strong expat demand in Limassol, Paphos, and Larnaca',
      'Year-round tourism supports short-term rental income',
      'Permanent residency available through property investment (\u20AC300k+)'
    ],
    scores: {
      easeOfPurchase: 4,
      rentalFriendliness: 4,
      marketLiquidity: 3,
      taxFavorability: 5
    }
  }
];

export function getCountry(id: string): Country | undefined {
  return countries.find(c => c.id === id);
}
