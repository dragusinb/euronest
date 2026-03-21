import { countries } from '../data/countries';
import { getCitiesByCountry } from '../data/cities';
import { formatPrice, formatYield, yieldColor } from '../utils/formatters';
import { ChevronRight, TrendingUp } from 'lucide-react';

interface CountrySidebarProps {
  selectedCountry: string | null;
  onSelectCountry: (id: string | null) => void;
  onSelectCity: (id: string) => void;
}

export default function CountrySidebar({ selectedCountry, onSelectCountry, onSelectCity }: CountrySidebarProps) {
  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Countries</h2>
        <p className="text-xs text-gray-500">Select a country to explore investment opportunities</p>
      </div>

      <div className="divide-y divide-gray-100">
        {countries.map(country => {
          const isSelected = selectedCountry === country.id;
          const countryCities = getCitiesByCountry(country.id);
          const avgYield = countryCities.reduce((sum, c) => sum + c.grossYield, 0) / countryCities.length;
          const minPrice = Math.min(...countryCities.map(c => c.averagePricePerSqm));

          return (
            <div key={country.id}>
              <button
                onClick={() => onSelectCountry(isSelected ? null : country.id)}
                className={`w-full text-left p-4 transition-colors cursor-pointer border-0 bg-transparent
                  ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{country.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          {formatYield(avgYield)} avg yield
                        </span>
                        <span>|</span>
                        <span>From {formatPrice(minPrice)}/m\u00B2</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>

                <div className="flex gap-1 mt-2">
                  {['Ease', 'Rental', 'Liquidity', 'Tax'].map((label, i) => {
                    const scores = [country.scores.easeOfPurchase, country.scores.rentalFriendliness, country.scores.marketLiquidity, country.scores.taxFavorability];
                    return (
                      <div key={label} className="flex-1 text-center">
                        <div className="text-[10px] text-gray-400">{label}</div>
                        <div className="flex justify-center gap-px mt-0.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= scores[i] ? 'bg-blue-500' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </button>

              {isSelected && (
                <div className="bg-blue-50/50 pb-2">
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-600 leading-relaxed">{country.summary}</p>
                  </div>
                  <div className="px-3">
                    <div className="text-xs font-medium text-gray-500 px-1 mb-1">Cities</div>
                    {countryCities.map(city => (
                      <button
                        key={city.id}
                        onClick={(e) => { e.stopPropagation(); onSelectCity(city.id); }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors flex items-center justify-between cursor-pointer border-0 bg-transparent"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">{city.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatPrice(city.averagePricePerSqm)}/m\u00B2 \u00B7 Pop. {(city.population / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold" style={{ color: yieldColor(city.grossYield) }}>
                            {formatYield(city.grossYield)}
                          </div>
                          <div className="text-[10px] text-gray-400">gross yield</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">
          More countries coming soon: Spain, Portugal, Italy, Germany...
        </div>
      </div>
    </div>
  );
}
