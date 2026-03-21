import { Heart } from 'lucide-react';
import { usePortfolioStore } from '../store';

interface SaveButtonProps {
  listingId: string;
  size?: 'sm' | 'md';
}

export default function SaveButton({ listingId, size = 'md' }: SaveButtonProps) {
  const { isInPortfolio, addProperty, removeProperty } = usePortfolioStore();
  const saved = isInPortfolio(listingId);

  const iconSize = size === 'sm' ? 16 : 20;
  const buttonSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeProperty(listingId);
    } else {
      addProperty(listingId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${buttonSize} flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
        saved
          ? 'bg-red-50 hover:bg-red-100 text-red-500 hover:scale-110'
          : 'bg-white/80 hover:bg-white text-gray-400 hover:text-red-400 hover:scale-105'
      } shadow-sm backdrop-blur-sm`}
      aria-label={saved ? 'Remove from portfolio' : 'Save to portfolio'}
    >
      <Heart
        size={iconSize}
        fill={saved ? 'currentColor' : 'none'}
        strokeWidth={saved ? 0 : 2}
        className={saved ? 'drop-shadow-sm' : ''}
      />
    </button>
  );
}
