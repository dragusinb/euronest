import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, AlertCircle, Clock } from 'lucide-react';
import type { ListingFilters } from '../types';
import { useSearchStore } from '../store';
import { askAIJSON } from '../services/openai';
import { buildSearchInterpretPrompt } from '../services/prompts';
import { countries } from '../data/countries';
import { cities } from '../data/cities';
import { formatPrice } from '../utils/formatters';

interface SmartSearchBarProps {
  onFiltersChange: (filters: ListingFilters) => void;
  onQuerySubmit?: (query: string) => void;
}

type FilterKey = keyof ListingFilters;

function describeFilter(key: FilterKey, value: unknown): string | null {
  switch (key) {
    case 'countryIds': {
      const ids = value as string[];
      const names = ids.map(id => countries.find(c => c.id === id)?.name ?? id);
      return `Country: ${names.join(', ')}`;
    }
    case 'countryId': {
      const name = countries.find(c => c.id === value)?.name ?? (value as string);
      return `Country: ${name}`;
    }
    case 'cityIds': {
      const ids = value as string[];
      const names = ids.map(id => cities.find(c => c.id === id)?.name ?? id);
      return `City: ${names.join(', ')}`;
    }
    case 'cityId': {
      const name = cities.find(c => c.id === value)?.name ?? (value as string);
      return `City: ${name}`;
    }
    case 'priceRange': {
      const [min, max] = value as [number, number];
      if (min === 0) return `Max Price: ${formatPrice(max)}`;
      if (max >= 9999999) return `Min Price: ${formatPrice(min)}`;
      return `Price: ${formatPrice(min)} - ${formatPrice(max)}`;
    }
    case 'areaRange': {
      const [min, max] = value as [number, number];
      if (min === 0) return `Max Area: ${max} m\u00B2`;
      if (max >= 9999) return `Min Area: ${min} m\u00B2`;
      return `Area: ${min} - ${max} m\u00B2`;
    }
    case 'yieldMin':
      return `Min Yield: ${value}%`;
    case 'propertyTypes': {
      const types = value as string[];
      return `Type: ${types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}`;
    }
    case 'roomsMin':
      return `Min Rooms: ${value}`;
    case 'yearBuiltRange': {
      const [min, max] = value as [number, number];
      return `Built: ${min} - ${max}`;
    }
    case 'features': {
      const feats = value as string[];
      return `Features: ${feats.join(', ')}`;
    }
    case 'sortBy':
      return null; // Don't show sort as a pill
    default:
      return null;
  }
}

export default function SmartSearchBar({ onFiltersChange, onQuerySubmit }: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Partial<ListingFilters>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { recentQueries, addRecentQuery } = useSearchStore();

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setError(null);
    setIsLoading(true);
    setShowSuggestions(false);
    addRecentQuery(trimmed);
    onQuerySubmit?.(trimmed);

    try {
      const systemPrompt = buildSearchInterpretPrompt();
      const parsed = await askAIJSON<Partial<ListingFilters>>(systemPrompt, trimmed);

      // Ensure sortBy has a default
      const filters: ListingFilters = {
        sortBy: 'yield-desc',
        ...parsed,
      };

      setActiveFilters(filters);
      onFiltersChange(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to interpret search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const removeFilter = (key: FilterKey) => {
    const updated = { ...activeFilters };
    delete updated[key];
    setActiveFilters(updated);
    onFiltersChange({ sortBy: 'yield-desc', ...updated });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setQuery('');
    onFiltersChange({ sortBy: 'yield-desc' });
  };

  const applySuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Auto-search after picking suggestion
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const filterPills = Object.entries(activeFilters)
    .map(([key, value]) => {
      if (value === undefined || value === null) return null;
      if (Array.isArray(value) && value.length === 0) return null;
      const label = describeFilter(key as FilterKey, value);
      if (!label) return null;
      return { key: key as FilterKey, label };
    })
    .filter(Boolean) as { key: FilterKey; label: string }[];

  return (
    <div ref={containerRef} className="w-full">
      {/* Search input */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 focus-within:border-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search with AI... (e.g. &quot;apartments in Greece under 200k with high yield&quot;)"
            className="flex-1 px-4 py-4 text-base bg-transparent outline-none placeholder-gray-400"
            disabled={isLoading}
          />
          {query && !isLoading && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 px-6 py-2.5 m-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>

        {/* Recent queries dropdown */}
        {showSuggestions && recentQueries.length > 0 && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Recent Searches
            </div>
            {recentQueries.map((q) => (
              <button
                key={q}
                onClick={() => applySuggestion(q)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{q}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={handleSearch}
            className="ml-auto text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filter pills */}
      {filterPills.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Filters:</span>
          {filterPills.map(({ key, label }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
            >
              {label}
              <button
                onClick={() => removeFilter(key)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
