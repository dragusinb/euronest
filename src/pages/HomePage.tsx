import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import CountrySidebar from '../components/CountrySidebar';

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectCity = useCallback((cityId: string) => {
    navigate(`/city/${cityId}`);
  }, [navigate]);

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
      <div className="w-80 flex-shrink-0 hidden lg:block">
        <CountrySidebar
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          onSelectCity={handleSelectCity}
        />
      </div>
      <div className="flex-1 relative">
        <MapView
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          onSelectCity={handleSelectCity}
        />
        {/* Mobile country selector */}
        <div className="lg:hidden absolute top-4 left-4 right-4 z-[500]">
          <select
            value={selectedCountry || ''}
            onChange={(e) => setSelectedCountry(e.target.value || null)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg"
          >
            <option value="">All Countries</option>
            {['greece', 'france', 'finland'].map(id => {
              const country = { greece: '\u{1F1EC}\u{1F1F7} Greece', france: '\u{1F1EB}\u{1F1F7} France', finland: '\u{1F1EB}\u{1F1EE} Finland' }[id];
              return <option key={id} value={id}>{country}</option>;
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
