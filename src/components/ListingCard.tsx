import type { PropertyListing } from '../types';
import { formatPrice, formatYield, formatArea, yieldColor } from '../utils/formatters';
import { Bed, Bath, Building2, Calendar, TrendingUp } from 'lucide-react';

interface ListingCardProps {
  listing: PropertyListing;
  onClick?: () => void;
}

export default function ListingCard({ listing, onClick }: ListingCardProps) {
  const monthlyYield = listing.estimatedMonthlyRent;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f3f4f6"><rect width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="%239ca3af" font-size="14">No Image</text></svg>');
          }}
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-sm font-bold"
          style={{ backgroundColor: yieldColor(listing.grossYield) }}>
          {formatYield(listing.grossYield)} yield
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-white text-xs font-medium capitalize">
          {listing.type}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {listing.title}
        </h3>

        <div className="flex items-baseline justify-between mb-3">
          <div className="text-xl font-bold text-blue-600">{formatPrice(listing.price)}</div>
          <div className="text-sm text-gray-500">{formatPrice(listing.price / listing.areaSqm)}/m\u00B2</div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center mb-3">
          <div className="flex flex-col items-center">
            <Bed className="w-4 h-4 text-gray-400 mb-0.5" />
            <span className="text-xs text-gray-600">{listing.rooms}</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="w-4 h-4 text-gray-400 mb-0.5" />
            <span className="text-xs text-gray-600">{listing.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center">
            <Building2 className="w-4 h-4 text-gray-400 mb-0.5" />
            <span className="text-xs text-gray-600">{formatArea(listing.areaSqm)}</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-4 h-4 text-gray-400 mb-0.5" />
            <span className="text-xs text-gray-600">{listing.yearBuilt}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-green-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">{formatPrice(monthlyYield)}/mo</span>
          </div>
          <span className="text-xs text-gray-400">est. rental income</span>
        </div>

        {listing.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {listing.features.slice(0, 3).map(f => (
              <span key={f} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                {f}
              </span>
            ))}
            {listing.features.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                +{listing.features.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
