import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  Home,
  DollarSign,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  BarChart3,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SavedProperty } from '../types';
import { usePortfolioStore } from '../store';
import { listings } from '../data/listings';
import { getCity } from '../data/cities';
import { getCountry } from '../data/countries';
import { formatPrice, formatYield } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCsv';

type SortOption = 'date' | 'price' | 'yield';

const CHART_COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed'];

function getListing(id: string) {
  return listings.find(l => l.id === id);
}

// ---------- Empty state ----------
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Start building your portfolio</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Save properties you are interested in and track your investment portfolio here.
        Browse listings and tap the heart icon to add properties.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors no-underline"
      >
        <Search className="w-4 h-4" />
        Explore Properties
      </Link>
    </div>
  );
}

// ---------- Summary card ----------
function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ---------- Property card ----------
function PortfolioCard({
  saved,
  onRemove,
  onUpdateNotes,
}: {
  saved: SavedProperty;
  onRemove: () => void;
  onUpdateNotes: (notes: string) => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const listing = getListing(saved.listingId);
  if (!listing) return null;

  const city = getCity(listing.cityId);
  const country = city ? getCountry(city.countryId) : undefined;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,' +
              encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f3f4f6"><rect width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="%239ca3af" font-size="14">No Image</text></svg>'
              );
          }}
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
          aria-label="Remove from portfolio"
        >
          <X className="w-4 h-4" />
        </button>
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-xs font-bold"
          style={{ backgroundColor: '#059669' }}
        >
          {formatYield(listing.grossYield)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          {country?.flag} {city?.name}, {country?.name}
        </p>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-lg font-bold text-indigo-600">{formatPrice(listing.price)}</span>
          <span className="text-xs text-green-700 font-medium">
            {formatPrice(listing.estimatedMonthlyRent)}/mo
          </span>
        </div>

        <p className="text-[10px] text-gray-400 mb-3">
          Saved {new Date(saved.savedAt).toLocaleDateString()}
        </p>

        {/* Notes toggle */}
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors w-full"
        >
          {notesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {saved.notes ? 'Edit notes' : 'Add notes'}
        </button>
        {notesOpen && (
          <textarea
            value={saved.notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Write your notes..."
            rows={3}
            className="mt-2 w-full text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y"
          />
        )}
      </div>
    </div>
  );
}

// ---------- Main page ----------
export default function DashboardPage() {
  const { properties, removeProperty, updateNotes } = usePortfolioStore();
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Resolved listing data for saved properties
  const resolvedProperties = useMemo(() => {
    return properties
      .map(sp => ({ saved: sp, listing: getListing(sp.listingId) }))
      .filter((r): r is { saved: SavedProperty; listing: NonNullable<ReturnType<typeof getListing>> } => !!r.listing);
  }, [properties]);

  // Summary metrics
  const totalInvestment = useMemo(
    () => resolvedProperties.reduce((sum, r) => sum + r.listing.price, 0),
    [resolvedProperties]
  );
  const monthlyIncome = useMemo(
    () => resolvedProperties.reduce((sum, r) => sum + r.listing.estimatedMonthlyRent, 0),
    [resolvedProperties]
  );
  const weightedYield = useMemo(() => {
    if (totalInvestment === 0) return 0;
    const weighted = resolvedProperties.reduce(
      (sum, r) => sum + r.listing.grossYield * r.listing.price,
      0
    );
    return weighted / totalInvestment;
  }, [resolvedProperties, totalInvestment]);

  // Chart data: investment by country
  const countryData = useMemo(() => {
    const map = new Map<string, { name: string; value: number }>();
    for (const r of resolvedProperties) {
      const city = getCity(r.listing.cityId);
      const country = city ? getCountry(city.countryId) : undefined;
      const name = country?.name ?? 'Unknown';
      const existing = map.get(name);
      if (existing) {
        existing.value += r.listing.price;
      } else {
        map.set(name, { name, value: r.listing.price });
      }
    }
    return Array.from(map.values());
  }, [resolvedProperties]);

  // Chart data: yield by property
  const yieldData = useMemo(() => {
    return resolvedProperties.map(r => {
      const city = getCity(r.listing.cityId);
      const label = city ? city.name : r.listing.title.slice(0, 15);
      return {
        name: label,
        yield: r.listing.grossYield,
      };
    });
  }, [resolvedProperties]);

  // Sorted properties
  const sortedProperties = useMemo(() => {
    const sorted = [...resolvedProperties];
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => b.saved.savedAt - a.saved.savedAt);
        break;
      case 'price':
        sorted.sort((a, b) => b.listing.price - a.listing.price);
        break;
      case 'yield':
        sorted.sort((a, b) => b.listing.grossYield - a.listing.grossYield);
        break;
    }
    return sorted;
  }, [resolvedProperties, sortBy]);

  // Export
  const handleExport = () => {
    const headers = [
      'Property Title',
      'City',
      'Country',
      'Price (EUR)',
      'Area (sqm)',
      'Gross Yield (%)',
      'Monthly Rent (EUR)',
      'Date Saved',
      'Notes',
    ];
    const rows = resolvedProperties.map(r => {
      const city = getCity(r.listing.cityId);
      const country = city ? getCountry(city.countryId) : undefined;
      return [
        r.listing.title,
        city?.name ?? '',
        country?.name ?? '',
        r.listing.price.toString(),
        r.listing.areaSqm.toString(),
        r.listing.grossYield.toFixed(1),
        r.listing.estimatedMonthlyRent.toString(),
        new Date(r.saved.savedAt).toISOString().split('T')[0],
        r.saved.notes,
      ];
    });
    exportToCSV('euronest-portfolio.csv', headers, rows);
  };

  if (properties.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Investment Dashboard</h1>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your European property portfolio
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Wallet}
          label="Total Investment"
          value={formatPrice(totalInvestment)}
          color="bg-indigo-100 text-indigo-600"
        />
        <SummaryCard
          icon={DollarSign}
          label="Monthly Income"
          value={formatPrice(monthlyIncome)}
          sub={`${formatPrice(monthlyIncome * 12)}/year`}
          color="bg-emerald-100 text-emerald-600"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Avg. Gross Yield"
          value={formatYield(weightedYield)}
          sub="Weighted by price"
          color="bg-cyan-100 text-cyan-600"
        />
        <SummaryCard
          icon={Home}
          label="Properties"
          value={resolvedProperties.length.toString()}
          sub={`in ${countryData.length} ${countryData.length === 1 ? 'country' : 'countries'}`}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Investment by Country</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {countryData.map((_entry, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatPrice(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Gross Yield by Property</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={yieldData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" domain={[0, 'auto']} tick={{ fontSize: 12 }} unit="%" />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="yield" name="Gross Yield" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Properties grid */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Saved Properties</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Sort by:</span>
            {(['date', 'price', 'yield'] as SortOption[]).map(opt => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  sortBy === opt
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt === 'date' ? 'Date Saved' : opt === 'price' ? 'Price' : 'Yield'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedProperties.map(r => (
            <PortfolioCard
              key={r.saved.listingId}
              saved={r.saved}
              onRemove={() => removeProperty(r.saved.listingId)}
              onUpdateNotes={(notes) => updateNotes(r.saved.listingId, notes)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
