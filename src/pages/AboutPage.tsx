import { MapPin, TrendingUp, Shield, Globe, AlertTriangle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About EuroNest</h1>
        <p className="text-lg text-gray-600 mb-8">
          EuroNest helps European expats and investors find, compare, and evaluate apartment investment
          opportunities across Europe. We focus on transparency, local regulations, and realistic yield calculations.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <MapPin className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">City-Level Data</h3>
            <p className="text-sm text-gray-600">Average prices, rental yields, and demand levels for major cities across Greece, France, and Finland. More countries coming soon.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Shield className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulation Guide</h3>
            <p className="text-sm text-gray-600">Detailed breakdown of purchase rules, rental regulations, tax regimes, and visa requirements for each country. Written for EU/EEA expats.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <TrendingUp className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Yield Calculator</h3>
            <p className="text-sm text-gray-600">Calculate gross, net, and after-tax yields with country-specific acquisition costs, property taxes, and income tax rates.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Globe className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Comparison</h3>
            <p className="text-sm text-gray-600">Compare countries and cities side by side on price, yield, liquidity, and regulatory friendliness with interactive charts.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Important Disclaimers</h3>
              <ul className="text-sm text-amber-800 space-y-2 list-disc list-inside">
                <li>All data is for <strong>informational purposes only</strong>. Always consult qualified local professionals (lawyers, notaries, tax advisors) before making investment decisions.</li>
                <li>Property prices and rental yields are <strong>approximate averages</strong> and can vary significantly within a city or neighborhood.</li>
                <li>Regulations and tax rates change frequently. The information shown reflects our best understanding but may not be current.</li>
                <li>Sample property listings are for <strong>illustration only</strong> and do not represent real listings.</li>
                <li>Past performance and current yields do not guarantee future returns.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Sources & Methodology</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Property prices:</strong> Based on publicly available market data from national statistics offices, real estate portals, and market reports.</p>
            <p><strong>Rental yields:</strong> Calculated from average asking rents and average asking prices in each city. Actual yields may differ.</p>
            <p><strong>Regulations:</strong> Compiled from official government sources, legal databases, and verified by reference to professional publications.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Roadmap</h3>
          <div className="space-y-3">
            {[
              { status: 'done', label: 'Greece, France, Finland coverage' },
              { status: 'done', label: 'Interactive map with yield badges' },
              { status: 'done', label: 'Regulation guide for expats' },
              { status: 'done', label: 'Yield calculator with country-specific taxes' },
              { status: 'done', label: 'Country and city comparison' },
              { status: 'planned', label: 'Spain, Portugal, Italy, Germany' },
              { status: 'planned', label: 'Real listing data from property portals' },
              { status: 'planned', label: 'Neighborhood-level data' },
              { status: 'planned', label: 'Mortgage calculator for non-residents' },
              { status: 'planned', label: 'User accounts and saved searches' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.status === 'done' ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-sm ${item.status === 'done' ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
