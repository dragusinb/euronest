import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, X, Save, Trash2, Search } from 'lucide-react';
import type { ListingFilters, PropertyType } from '../types';
import { countries } from '../data/countries';
import { cities } from '../data/cities';
import { listings } from '../data/listings';
import { useSearchStore } from '../store';
import { getListings } from '../data/listings';

interface FilterPanelProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'studio', label: 'Studio' },
  { value: 'house', label: 'House' },
];

const SORT_OPTIONS: { value: ListingFilters['sortBy']; label: string }[] = [
  { value: 'yield-desc', label: 'Highest Yield' },
  { value: 'price-asc', label: 'Lowest Price' },
  { value: 'price-desc', label: 'Highest Price' },
  { value: 'area-desc', label: 'Largest Area' },
];

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [featureSearch, setFeatureSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    countries: true,
    cities: true,
    price: true,
    area: false,
    yield: true,
    type: true,
    rooms: false,
    features: false,
    sort: true,
    saved: true,
  });

  const { savedSearches, saveSearch, removeSearch } = useSearchStore();

  // Extract all unique features from listings
  const allFeatures = useMemo(() => {
    const feats = new Set<string>();
    listings.forEach(l => l.features.forEach(f => feats.add(f)));
    return [...feats].sort();
  }, []);

  const filteredFeatures = useMemo(() => {
    if (!featureSearch.trim()) return allFeatures;
    const search = featureSearch.toLowerCase();
    return allFeatures.filter(f => f.toLowerCase().includes(search));
  }, [allFeatures, featureSearch]);

  // Get live result count
  const matchCount = useMemo(() => getListings(filters).length, [filters]);

  // Determine visible cities based on selected countries
  const visibleCities = useMemo(() => {
    const selectedCountries = filters.countryIds ?? [];
    if (selectedCountries.length === 0) return cities;
    return cities.filter(c => selectedCountries.includes(c.countryId));
  }, [filters.countryIds]);

  // Grouped cities by country
  const citiesByCountry = useMemo(() => {
    const grouped: Record<string, typeof cities> = {};
    for (const city of visibleCities) {
      if (!grouped[city.countryId]) grouped[city.countryId] = [];
      grouped[city.countryId].push(city);
    }
    return grouped;
  }, [visibleCities]);

  const update = (partial: Partial<ListingFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCountry = (countryId: string) => {
    const current = filters.countryIds ?? [];
    const next = current.includes(countryId)
      ? current.filter(id => id !== countryId)
      : [...current, countryId];
    // Also clean up cityIds that no longer belong to selected countries
    const validCityIds = (filters.cityIds ?? []).filter(cid => {
      const city = cities.find(c => c.id === cid);
      return city && (next.length === 0 || next.includes(city.countryId));
    });
    update({ countryIds: next.length > 0 ? next : undefined, cityIds: validCityIds.length > 0 ? validCityIds : undefined });
  };

  const toggleCity = (cityId: string) => {
    const current = filters.cityIds ?? [];
    const next = current.includes(cityId)
      ? current.filter(id => id !== cityId)
      : [...current, cityId];
    update({ cityIds: next.length > 0 ? next : undefined });
  };

  const togglePropertyType = (type: PropertyType) => {
    const current = filters.propertyTypes ?? [];
    const next = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    update({ propertyTypes: next.length > 0 ? next : undefined });
  };

  const toggleFeature = (feature: string) => {
    const current = filters.features ?? [];
    const next = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature];
    update({ features: next.length > 0 ? next : undefined });
  };

  const clearAll = () => {
    onChange({ sortBy: 'yield-desc' });
  };

  const handleSave = () => {
    if (!searchName.trim()) return;
    saveSearch({
      id: Date.now().toString(),
      name: searchName.trim(),
      query: '',
      filters,
      createdAt: Date.now(),
    });
    setSearchName('');
    setSaveDialogOpen(false);
  };

  const applySavedSearch = (savedFilters: ListingFilters) => {
    onChange(savedFilters);
  };

  const SectionHeader = ({ id, title, badge }: { id: string; title: string; badge?: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
    >
      <span className="flex items-center gap-2">
        {title}
        {badge && (
          <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">{badge}</span>
        )}
      </span>
      {expandedSections[id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{matchCount} results</span>
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="px-4 py-2 divide-y divide-gray-100">
        {/* Country */}
        <div>
          <SectionHeader id="countries" title="Country" badge={filters.countryIds?.length?.toString()} />
          {expandedSections.countries && (
            <div className="pb-3 space-y-1.5">
              {countries.map(country => (
                <label key={country.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.countryIds?.includes(country.id) ?? false}
                    onChange={() => toggleCountry(country.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-lg leading-none">{country.flag}</span>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{country.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* City */}
        <div>
          <SectionHeader id="cities" title="City" badge={filters.cityIds?.length?.toString()} />
          {expandedSections.cities && (
            <div className="pb-3 space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(citiesByCountry).map(([countryId, countryCities]) => {
                const country = countries.find(c => c.id === countryId);
                return (
                  <div key={countryId}>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      {country?.flag} {country?.name}
                    </div>
                    {countryCities.map(city => (
                      <label key={city.id} className="flex items-center gap-2.5 cursor-pointer group py-0.5 pl-2">
                        <input
                          type="checkbox"
                          checked={filters.cityIds?.includes(city.id) ?? false}
                          onChange={() => toggleCity(city.id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{city.name}</span>
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <SectionHeader id="price" title="Price Range" />
          {expandedSections.price && (
            <div className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.priceRange?.[0] ?? ''}
                    onChange={(e) => {
                      const min = e.target.value ? Number(e.target.value) : 0;
                      const max = filters.priceRange?.[1] ?? 9999999;
                      update({ priceRange: [min, max] });
                    }}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <span className="text-gray-400 mt-4">-</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filters.priceRange?.[1] ?? ''}
                    onChange={(e) => {
                      const max = e.target.value ? Number(e.target.value) : 9999999;
                      const min = filters.priceRange?.[0] ?? 0;
                      update({ priceRange: [min, max] });
                    }}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              {filters.priceRange && (
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      marginLeft: `${Math.min((filters.priceRange[0] / 500000) * 100, 100)}%`,
                      width: `${Math.min(((filters.priceRange[1] - filters.priceRange[0]) / 500000) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Area Range */}
        <div>
          <SectionHeader id="area" title="Area (m\u00B2)" />
          {expandedSections.area && (
            <div className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.areaRange?.[0] ?? ''}
                    onChange={(e) => {
                      const min = e.target.value ? Number(e.target.value) : 0;
                      const max = filters.areaRange?.[1] ?? 9999;
                      update({ areaRange: [min, max] });
                    }}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <span className="text-gray-400 mt-4">-</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Max</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filters.areaRange?.[1] ?? ''}
                    onChange={(e) => {
                      const max = e.target.value ? Number(e.target.value) : 9999;
                      const min = filters.areaRange?.[0] ?? 0;
                      update({ areaRange: [min, max] });
                    }}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Yield */}
        <div>
          <SectionHeader id="yield" title="Minimum Yield" />
          {expandedSections.yield && (
            <div className="pb-3">
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="15"
                  placeholder="e.g. 5"
                  value={filters.yieldMin ?? ''}
                  onChange={(e) => update({ yieldMin: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-2.5 py-1.5 pr-8 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
              </div>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div>
          <SectionHeader id="type" title="Property Type" badge={filters.propertyTypes?.length?.toString()} />
          {expandedSections.type && (
            <div className="pb-3 space-y-1.5">
              {PROPERTY_TYPES.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.propertyTypes?.includes(value) ?? false}
                    onChange={() => togglePropertyType(value)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rooms */}
        <div>
          <SectionHeader id="rooms" title="Minimum Rooms" />
          {expandedSections.rooms && (
            <div className="pb-3">
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Any"
                value={filters.roomsMin ?? ''}
                onChange={(e) => update({ roomsMin: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <SectionHeader id="features" title="Features" badge={filters.features?.length?.toString()} />
          {expandedSections.features && (
            <div className="pb-3">
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {filteredFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.features?.includes(feature) ?? false}
                      onChange={() => toggleFeature(feature)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort */}
        <div>
          <SectionHeader id="sort" title="Sort By" />
          {expandedSections.sort && (
            <div className="pb-3">
              <select
                value={filters.sortBy}
                onChange={(e) => update({ sortBy: e.target.value as ListingFilters['sortBy'] })}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none bg-white"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
          {!saveDialogOpen ? (
            <button
              onClick={() => setSaveDialogOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Search
            </button>
          ) : (
            <div className="flex-1 flex gap-1">
              <input
                type="text"
                placeholder="Search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="flex-1 px-2 py-1.5 text-sm border border-blue-300 rounded-lg outline-none focus:border-blue-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={!searchName.trim()}
                className="px-2 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setSaveDialogOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <SectionHeader id="saved" title="Saved Searches" badge={savedSearches.length.toString()} />
          {expandedSections.saved && (
            <div className="space-y-1.5 pb-2">
              {savedSearches.map(search => (
                <div
                  key={search.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 group"
                >
                  <button
                    onClick={() => applySavedSearch(search.filters)}
                    className="text-sm text-gray-700 hover:text-blue-600 font-medium truncate text-left flex-1"
                  >
                    {search.name}
                  </button>
                  <button
                    onClick={() => removeSearch(search.id)}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
