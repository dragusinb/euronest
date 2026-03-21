import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { cities, getCitiesByCountry } from '../data/cities';
import { countries } from '../data/countries';
import { formatPrice, formatYield, yieldClass, yieldColor, demandColor } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import type { City } from '../types';

// Fix Leaflet default marker icon issue
import 'leaflet/dist/leaflet.css';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createYieldIcon(city: City) {
  const cls = yieldClass(city.grossYield);
  return L.divIcon({
    className: 'yield-marker',
    html: `<div class="yield-badge ${cls}">${city.grossYield.toFixed(1)}%</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface MapViewProps {
  selectedCountry: string | null;
  onSelectCountry?: (id: string | null) => void;
  onSelectCity: (id: string) => void;
}

export default function MapView({ selectedCountry, onSelectCity }: MapViewProps) {
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState<[number, number]>([50, 15]);
  const [mapZoom, setMapZoom] = useState(4);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.id === selectedCountry);
      if (country) {
        setMapCenter(country.center);
        setMapZoom(country.zoom);
      }
    } else {
      setMapCenter([50, 15]);
      setMapZoom(4);
    }
  }, [selectedCountry]);

  const visibleCities = selectedCountry
    ? getCitiesByCountry(selectedCountry)
    : cities;

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
      style={{ height: '100%', minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={mapCenter} zoom={mapZoom} />

      {visibleCities.map(city => (
        <Marker
          key={city.id}
          position={city.coordinates}
          icon={createYieldIcon(city)}
          eventHandlers={{
            click: () => onSelectCity(city.id),
          }}
        >
          <Popup maxWidth={320} minWidth={280}>
            <div className="p-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 m-0">{city.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${demandColor(city.demandLevel)}`}>
                  {city.demandLevel.replace('-', ' ')} demand
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 m-0">{city.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">Avg. Price/m\u00B2</div>
                  <div className="text-sm font-bold text-gray-900">{formatPrice(city.averagePricePerSqm)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">Gross Yield</div>
                  <div className="text-sm font-bold" style={{ color: yieldColor(city.grossYield) }}>
                    {formatYield(city.grossYield)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">Net Yield</div>
                  <div className="text-sm font-bold text-gray-700">{formatYield(city.netYield)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">Tourism</div>
                  <div className="text-sm font-bold text-gray-700">{city.tourismScore}/10</div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/city/${city.id}`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer border-0"
              >
                View Listings
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
