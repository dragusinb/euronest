import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getMarketData } from '../data/marketTrends';

interface HotMarketBadgeProps {
  cityId: string;
  size?: 'sm' | 'md';
}

export default function HotMarketBadge({ cityId, size = 'sm' }: HotMarketBadgeProps) {
  const data = getMarketData(cityId);
  if (!data) return null;

  if (data.hotMarket) {
    if (size === 'sm') {
      return (
        <span className="inline-flex items-center gap-1 text-orange-600 font-semibold text-xs">
          <Flame className="w-3.5 h-3.5" />
          Hot
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs border border-orange-200">
        <Flame className="w-3.5 h-3.5" />
        Hot Market
      </span>
    );
  }

  const forecastConfig = {
    bullish: {
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      label: 'Bullish',
      smClass: 'text-green-600',
      mdClass: 'bg-green-50 text-green-700 border-green-200',
    },
    neutral: {
      icon: <Minus className="w-3.5 h-3.5" />,
      label: 'Neutral',
      smClass: 'text-gray-500',
      mdClass: 'bg-gray-50 text-gray-600 border-gray-200',
    },
    bearish: {
      icon: <TrendingDown className="w-3.5 h-3.5" />,
      label: 'Bearish',
      smClass: 'text-red-600',
      mdClass: 'bg-red-50 text-red-700 border-red-200',
    },
  } as const;

  const cfg = forecastConfig[data.forecast];

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium text-xs ${cfg.smClass}`}>
        {cfg.icon}
        {cfg.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-xs border ${cfg.mdClass}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
