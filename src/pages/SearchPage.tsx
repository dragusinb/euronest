import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, LayoutGrid, Map } from 'lucide-react';
import type { ListingFilters, PropertyListing } from '../types';
import SmartSearchBar from '../components/SmartSearchBar';
import FilterPanel from '../components/FilterPanel';
import ListingCard from '../components/ListingCard';
import { getListings } from '../data/listings';
import { fetchLiveListings, filterListings } from '../services/listingsApi';

const SORT_LABELS: Record<ListingFilters['sortBy'], string> = {
  'yield-desc': 'Highest Yield',
  'price-asc': 'Lowest Price',
  'price-desc': 'Highest Price',
  'area-desc': 'Largest Area',
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ListingFilters>({ sortBy: 'yield-desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [allListings, setAllListings] = useState<PropertyListing[]>([]);

  useEffect(() => {
    fetchLiveListings().then(setAllListings);
  }, []);

  const results = useMemo(
    () => allListings.length > 0 ? filterListings(allListings, filters) : getListings(filters),
    [filters, allListings]
  );

  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
  };

  const handleSmartSearchFilters = (aiFilters: ListingFilters) => {
    setFilters(aiFilters);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Smart Search Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <SmartSearchBar
            onFiltersChange={handleSmartSearchFilters}
            onQuerySubmit={() => {}}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
            <span className="text-sm font-medium">{showFilters ? 'Close' : 'Filters'}</span>
          </button>

          {/* Filter sidebar */}
          <div
            className={`
              ${showFilters ? 'fixed inset-0 z-30 bg-black/50 lg:static lg:bg-transparent' : 'hidden lg:block'}
            `}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowFilters(false);
            }}
          >
            <div
              className={`
                w-80 shrink-0 overflow-y-auto
                ${showFilters
                  ? 'fixed right-0 top-0 bottom-0 z-40 bg-gray-50 p-4 shadow-xl lg:static lg:shadow-none lg:p-0'
                  : ''
                }
              `}
            >
              {showFilters && (
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden mb-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" /> Close Filters
                </button>
              )}
              <FilterPanel filters={filters} onChange={handleFiltersChange} />
            </div>
          </div>

          {/* Results area */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {results.length} {results.length === 1 ? 'property' : 'properties'} found
              </h2>
              <div className="flex items-center gap-3">
                {/* Sort dropdown (mobile-friendly duplicate) */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as ListingFilters['sortBy'] })}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:border-blue-500"
                >
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                {/* View toggle (grid/map) */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 ${viewMode === 'map' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-400 hover:text-gray-600'}`}
                    title="Map view coming soon"
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => navigate(`/city/${listing.cityId}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties match your filters</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Try adjusting your search criteria or clearing some filters to see more results.
                </p>
                <button
                  onClick={() => setFilters({ sortBy: 'yield-desc' })}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
