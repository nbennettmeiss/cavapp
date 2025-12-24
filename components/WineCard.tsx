
import React from 'react';
import { Wine } from '../types';
import { Language, translations } from '../translations';

interface WineCardProps {
  wine: Wine;
  onOpenBottle: (id: string) => void;
  onSelect: (wine: Wine) => void;
  lang: Language;
}

// Added lang prop to component signature and utilized translations for status labels
const WineCard: React.FC<WineCardProps> = ({ wine, onOpenBottle, onSelect, lang }) => {
  const t = translations[lang];
  const currentYear = new Date().getFullYear();
  const isOptimal = currentYear >= wine.windowStart && currentYear <= wine.windowEnd;

  return (
    <div 
      onClick={() => onSelect(wine)}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col border border-stone-100"
    >
      {/* Label Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        {wine.image ? (
          <img 
            src={wine.image} 
            alt={wine.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-200">
            <span className="text-4xl opacity-20 text-stone-900">🍷</span>
          </div>
        )}
        
        {/* Quality Indicator */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg ${
            isOptimal ? 'bg-green-900/80 text-white' : 'bg-stone-900/80 text-stone-300'
          }`}>
            {isOptimal ? t.ready_to_drink : t.cellaring}
          </div>
        </div>

        {/* Floating Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white/60 text-[9px] uppercase tracking-[0.3em] font-bold mb-1">{wine.winery}</p>
          <h3 className="text-white text-xl font-bold serif leading-tight">{wine.name}</h3>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex flex-col">
          <span className="text-stone-900 font-bold text-lg">{wine.year}</span>
          <span className="text-stone-400 text-[9px] uppercase tracking-widest font-bold">{t.vintage}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-red-950 font-bold leading-none">{wine.bottles}</span>
            <span className="text-stone-400 text-[8px] uppercase font-bold tracking-tighter">{t.units}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenBottle(wine.id); }}
            className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center hover:bg-red-950 transition-all shadow-md active:scale-90"
          >
            🍾
          </button>
        </div>
      </div>
    </div>
  );
};

export default WineCard;
