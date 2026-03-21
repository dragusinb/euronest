import { useState } from 'react';
import { Heart, X, ExternalLink } from 'lucide-react';
import { usePortfolioStore } from '../store';
import { getCity } from '../data/cities';
import { getCountry } from '../data/countries';
import { formatPrice, formatYield, formatArea, yieldColor } from '../utils/formatters';
import PropertyAnalysis from './PropertyAnalysis';
import ActionPlan from './ActionPlan';
import ROIProjection from './ROIProjection';
import type { PropertyListing } from '../types';

interface ListingDetailModalProps {
  listing: PropertyListing | null;
  onClose: () => void;
}

type Tab = 'overview' | 'action-plan' | 'ai-analysis' | 'roi-projection';

export default function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const isInPortfolio = usePortfolioStore(s => s.isInPortfolio);
  const addProperty = usePortfolioStore(s => s.addProperty);
  const removeProperty = usePortfolioStore(s => s.removeProperty);

  if (!listing) return null;

  const city = getCity(listing.cityId);
  const country = city ? getCountry(city.countryId) : null;
  const saved = isInPortfolio(listing.id);

  const toggleSave = () => {
    if (saved) {
      removeProperty(listing.id);
    } else {
      addProperty(listing.id);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'action-plan', label: 'Action Plan' },
    { key: 'ai-analysis', label: 'AI Analysis' },
    { key: 'roi-projection', label: 'ROI Projection' },
  ];

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white cursor-pointer border-0"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={toggleSave}
            className="absolute top-4 left-4 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white cursor-pointer border-0"
          >
            <Heart
              className={`w-4 h-4 ${saved ? 'text-red-500 fill-red-500' : 'text-gray-700'}`}
            />
          </button>
        </div>

        {/* Title & Price */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
              <p className="text-sm text-gray-500 capitalize">
                {listing.type} {city && country ? `\u00B7 ${city.name}, ${country.name}` : ''}
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 cursor-pointer bg-transparent border-l-0 border-r-0 border-t-0 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{listing.rooms}</div>
                  <div className="text-xs text-gray-500">Rooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{listing.bathrooms}</div>
                  <div className="text-xs text-gray-500">Baths</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{formatArea(listing.areaSqm)}</div>
                  <div className="text-xs text-gray-500">Area</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">F{listing.floor}</div>
                  <div className="text-xs text-gray-500">Floor</div>
                </div>
              </div>

              {/* Investment Returns */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-green-800 mb-3">Investment Returns</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-green-600">Monthly Rent</div>
                    <div className="text-lg font-bold text-green-800">
                      {formatPrice(listing.estimatedMonthlyRent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-600">Annual Income</div>
                    <div className="text-lg font-bold text-green-800">
                      {formatPrice(listing.estimatedMonthlyRent * 12)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-600">Gross Yield</div>
                    <div
                      className="text-lg font-bold"
                      style={{ color: yieldColor(listing.grossYield) }}
                    >
                      {formatYield(listing.grossYield)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map(f => (
                    <span
                      key={f}
                      className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Source link */}
              {listing.sourceUrl && (
                <a
                  href={listing.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium no-underline hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View original listing{listing.source ? ` on ${listing.source}` : ''}
                </a>
              )}

              {/* Footer info */}
              <div className="text-xs text-gray-400 pt-4 border-t border-gray-100 mt-4">
                Price per m&sup2;: {formatPrice(listing.price / listing.areaSqm)} &middot; Built:{' '}
                {listing.yearBuilt}
                {listing.lastUpdated && <> &middot; Updated: {listing.lastUpdated}</>}
                {listing.neighborhood && <> &middot; {listing.neighborhood}</>}
              </div>
            </div>
          )}

          {activeTab === 'action-plan' && (
            <ActionPlan listingId={listing.id} />
          )}

          {activeTab === 'ai-analysis' && (
            <PropertyAnalysis listingId={listing.id} />
          )}

          {activeTab === 'roi-projection' && (
            <div className="p-6">
              <ROIProjection
                purchasePrice={listing.price}
                monthlyRent={listing.estimatedMonthlyRent}
                countryId={city?.countryId || 'greece'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
