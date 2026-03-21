import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cities } from '../data/cities';
import { countries } from '../data/countries';
import { getCountry } from '../data/countries';
import { marketTrends, getMarketData } from '../data/marketTrends';
import { formatPrice, formatYield, demandColor } from '../utils/formatters';
import HotMarketBadge from '../components/HotMarketBadge';
import MarketReport from '../components/MarketReport';
import {
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Flame,
  BarChart3,
  Globe,
  Sun,
  ArrowRight,
} from 'lucide-react';
import type { City } from '../types';

type SortKey = 'name' | 'country' | 'price' | 'grossYield' | 'netYield' | 'demand' | 'forecast' | 'tourism';
type SortDir = 'asc' | 'desc';

const demandOrder: Record<string, number> = {
  'very-high': 4,
  'high': 3,
  'medium': 2,
  'low': 1,
};

const forecastOrder: Record<string, number> = {
  'bullish': 3,
  'neutral': 2,
  'bearish': 1,
};

function demandLabel(level: string): string {
  switch (level) {
    case 'very-high': return 'Very High';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    default: return 'Low';
  }
}

export default function InsightsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('grossYield');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Hot markets
  const hotMarkets = useMemo(() => {
    return marketTrends
      .filter(mt => mt.hotMarket)
      .map(mt => {
        const city = cities.find(c => c.id === mt.cityId);
        const country = city ? getCountry(city.countryId) : undefined;
        return { marketData: mt, city, country };
      })
      .filter(item => item.city && item.country);
  }, []);

  // Sorted cities
  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'country': {
          const ca = getCountry(a.countryId)?.name ?? '';
          const cb = getCountry(b.countryId)?.name ?? '';
          cmp = ca.localeCompare(cb);
          break;
        }
        case 'price':
          cmp = a.averagePricePerSqm - b.averagePricePerSqm;
          break;
        case 'grossYield':
          cmp = a.grossYield - b.grossYield;
          break;
        case 'netYield':
          cmp = a.netYield - b.netYield;
          break;
        case 'demand':
          cmp = (demandOrder[a.demandLevel] ?? 0) - (demandOrder[b.demandLevel] ?? 0);
          break;
        case 'forecast': {
          const fa = getMarketData(a.id)?.forecast ?? 'neutral';
          const fb = getMarketData(b.id)?.forecast ?? 'neutral';
          cmp = (forecastOrder[fa] ?? 0) - (forecastOrder[fb] ?? 0);
          break;
        }
        case 'tourism':
          cmp = a.tourismScore - b.tourismScore;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  // Country comparison data
  const countryStats = useMemo(() => {
    return countries.map(country => {
      const countryCities = cities.filter(c => c.countryId === country.id);
      const avgYield = countryCities.length > 0
        ? countryCities.reduce((sum, c) => sum + c.grossYield, 0) / countryCities.length
        : 0;
      const forecasts = countryCities.map(c => getMarketData(c.id)?.forecast ?? 'neutral');
      const bullishCount = forecasts.filter(f => f === 'bullish').length;
      const bearishCount = forecasts.filter(f => f === 'bearish').length;
      let sentiment: string;
      if (bullishCount > bearishCount) sentiment = 'Bullish';
      else if (bearishCount > bullishCount) sentiment = 'Bearish';
      else sentiment = 'Neutral';

      return { country, cityCount: countryCities.length, avgYield, sentiment };
    });
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'country' ? 'asc' : 'desc');
    }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 select-none"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === field && (
          sortDir === 'asc'
            ? <ChevronUp className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />
        )}
      </span>
    </th>
  );

  const sentimentColor = (s: string) => {
    switch (s) {
      case 'Bullish': return 'text-green-700 bg-green-50';
      case 'Bearish': return 'text-red-700 bg-red-50';
      default: return 'text-amber-700 bg-amber-50';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Market Insights</h1>
          </div>
          <p className="text-gray-500">AI-powered market intelligence across Europe</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Hot Markets Section */}
        {hotMarkets.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-900">Hot Markets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotMarkets.map(({ city, country }) => {
                if (!city || !country) return null;
                return (
                  <Link
                    key={city.id}
                    to={`/city/${city.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-orange-200 transition-all no-underline group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{city.name}</h3>
                      </div>
                      <HotMarketBadge cityId={city.id} size="md" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Gross Yield</p>
                        <p className="text-sm font-semibold text-green-700">{formatYield(city.grossYield)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Demand</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${demandColor(city.demandLevel)}`}>
                          {demandLabel(city.demandLevel)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{city.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Market Overview Table */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Market Overview</h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <SortHeader label="City" field="name" />
                    <SortHeader label="Country" field="country" />
                    <SortHeader label="Price/m2" field="price" />
                    <SortHeader label="Gross Yield" field="grossYield" />
                    <SortHeader label="Net Yield" field="netYield" />
                    <SortHeader label="Demand" field="demand" />
                    <SortHeader label="Forecast" field="forecast" />
                    <SortHeader label="Tourism" field="tourism" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedCities.map(city => {
                    const country = getCountry(city.countryId);
                    const isExpanded = expandedRow === city.id;
                    return (
                      <TableRow
                        key={city.id}
                        city={city}
                        countryFlag={country?.flag ?? ''}
                        countryName={country?.name ?? ''}
                        isExpanded={isExpanded}
                        onToggle={() => setExpandedRow(isExpanded ? null : city.id)}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Country Comparison Cards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Country Comparison</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {countryStats.map(({ country, cityCount, avgYield, sentiment }) => (
              <div key={country.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{country.flag}</span>
                  <h3 className="font-bold text-gray-900">{country.name}</h3>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cities covered</span>
                    <span className="font-semibold text-gray-900">{cityCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg. gross yield</span>
                    <span className="font-semibold text-green-700">{formatYield(avgYield)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500">Market sentiment</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${sentimentColor(sentiment)}`}>
                      {sentiment}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/regulations/${country.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors no-underline"
                >
                  View regulations
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// Extracted table row component for readability
function TableRow({
  city,
  countryFlag,
  countryName,
  isExpanded,
  onToggle,
}: {
  city: City;
  countryFlag: string;
  countryName: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-sm font-medium text-gray-900">{city.name}</td>
        <td className="px-4 py-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <span>{countryFlag}</span>
            {countryName}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-700 font-medium">{formatPrice(city.averagePricePerSqm)}</td>
        <td className="px-4 py-3 text-sm font-semibold text-green-700">{formatYield(city.grossYield)}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{formatYield(city.netYield)}</td>
        <td className="px-4 py-3">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${demandColor(city.demandLevel)}`}>
            {city.demandLevel === 'very-high' ? 'Very High' : city.demandLevel.charAt(0).toUpperCase() + city.demandLevel.slice(1)}
          </span>
        </td>
        <td className="px-4 py-3">
          <HotMarketBadge cityId={city.id} size="sm" />
        </td>
        <td className="px-4 py-3">
          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            {city.tourismScore}/10
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8} className="px-4 py-4 bg-gray-50 border-t border-gray-100">
            <MarketReport cityId={city.id} />
          </td>
        </tr>
      )}
    </>
  );
}
