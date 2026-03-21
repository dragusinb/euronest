import { useParams, Link } from 'react-router-dom';
import { getCity } from '../data/cities';
import { getCountry } from '../data/countries';
import { getListings } from '../data/listings';
import { formatPrice, formatYield, yieldColor, demandColor } from '../utils/formatters';
import ListingCard from '../components/ListingCard';
import ListingDetailModal from '../components/ListingDetailModal';
import BuyingGuide from '../components/BuyingGuide';
import NeighborhoodScores from '../components/NeighborhoodScores';
import { TrendingUp, Users, Sun, MapPin, Building2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { PropertyListing, PropertyType } from '../types';

export default function CityPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const city = getCity(cityId || '');
  const country = city ? getCountry(city.countryId) : null;
  const cityListings = getListings({ cityId: cityId || '' });

  const [sortBy, setSortBy] = useState<'yield-desc' | 'price-asc' | 'price-desc' | 'area-desc'>('yield-desc');
  const [typeFilter, setTypeFilter] = useState<PropertyType | ''>('');
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);

  if (!city || !country) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">City not found</h2>
          <Link to="/" className="text-blue-600 hover:underline">Back to map</Link>
        </div>
      </div>
    );
  }

  let filtered = typeFilter
    ? cityListings.filter(l => l.type === typeFilter)
    : cityListings;

  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'area-desc': return b.areaSqm - a.areaSqm;
      default: return b.grossYield - a.grossYield;
    }
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-blue-600 no-underline text-gray-500">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/regulations/${country.id}`} className="hover:text-blue-600 no-underline text-gray-500">
              {country.flag} {country.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">{city.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{city.name}</h1>
              <p className="text-gray-600 max-w-2xl">{city.description}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/regulations/${country.id}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 no-underline flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                Regulations
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Avg. Price/m\u00B2
              </div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(city.averagePricePerSqm)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Gross Yield
              </div>
              <div className="text-xl font-bold" style={{ color: yieldColor(city.grossYield) }}>
                {formatYield(city.grossYield)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Net Yield</div>
              <div className="text-xl font-bold text-gray-700">{formatYield(city.netYield)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Demand
              </div>
              <span className={`inline-block text-sm px-2 py-1 rounded-full font-medium ${demandColor(city.demandLevel)}`}>
                {city.demandLevel.replace('-', ' ')}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Sun className="w-3 h-3" /> Tourism Score
              </div>
              <div className="text-xl font-bold text-gray-700">{city.tourismScore}/10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Available Properties ({filtered.length})
          </h2>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PropertyType | '')}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartments</option>
              <option value="studio">Studios</option>
              <option value="house">Houses</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="yield-desc">Highest Yield</option>
              <option value="price-asc">Lowest Price</option>
              <option value="price-desc">Highest Price</option>
              <option value="area-desc">Largest Area</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={() => setSelectedListing(listing)}
              />
            ))}
          </div>
        )}

        {/* Quick yield analysis */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Investment Analysis for {city.name}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Typical Investment</h4>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>60m\u00B2 apartment</span>
                  <span className="font-medium">{formatPrice(city.averagePricePerSqm * 60)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly rent estimate</span>
                  <span className="font-medium">{formatPrice(city.averageMonthlyRentPerSqm * 60)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual rental income</span>
                  <span className="font-medium">{formatPrice(city.averageMonthlyRentPerSqm * 60 * 12)}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Yield Breakdown</h4>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Gross yield</span>
                  <span className="font-medium" style={{ color: yieldColor(city.grossYield) }}>{formatYield(city.grossYield)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net yield (after costs)</span>
                  <span className="font-medium">{formatYield(city.netYield)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yield spread</span>
                  <span className="font-medium text-gray-500">{formatYield(city.grossYield - city.netYield)}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Market Context</h4>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Demand level</span>
                  <span className={`font-medium px-2 py-0.5 rounded text-xs ${demandColor(city.demandLevel)}`}>{city.demandLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tourism score</span>
                  <span className="font-medium">{city.tourismScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span>Population</span>
                  <span className="font-medium">{(city.population / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neighborhood Scores */}
        <div className="mt-8">
          <NeighborhoodScores cityId={city.id} />
        </div>

        {/* AI Buying Guide */}
        <div className="mt-8 mb-8">
          <BuyingGuide cityId={city.id} />
        </div>
      </div>

      <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
    </div>
  );
}
