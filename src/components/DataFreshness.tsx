import { useState, useEffect } from 'react';
import { fetchMeta } from '../services/listingsApi';
import { Wifi, WifiOff } from 'lucide-react';

export default function DataFreshness() {
  const [meta, setMeta] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchMeta().then(m => {
      if (m && m.lastFullUpdate) {
        setMeta(m);
        setIsLive(true);
      }
    });
  }, []);

  if (!isLive) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
        <WifiOff className="w-3 h-3" />
        <span>Sample data</span>
      </div>
    );
  }

  const lastUpdate = new Date(meta.lastFullUpdate);
  const hoursAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 3600000);
  const timeStr = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;

  return (
    <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
      <Wifi className="w-3 h-3" />
      <span>Live data · Updated {timeStr}</span>
    </div>
  );
}
