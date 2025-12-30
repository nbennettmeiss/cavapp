
import React, { useState } from 'react';
import { Wine } from '../types';
import { Language, translations } from '../translations';
import { speakWineDescription } from '../services/ttsService';

interface WineDetailProps {
  wine: Wine;
  onClose: () => void;
  onOpenBottle: (id: string) => void;
  lang: Language;
}

const WineDetail: React.FC<WineDetailProps> = ({ wine, onClose, onOpenBottle, lang }) => {
  const t = translations[lang];
  const [isPlaying, setIsPlaying] = useState(false);

  const handleListen = async () => {
    setIsPlaying(true);
    const description = `${wine.name} from ${wine.winery}. ${wine.notes || ''}. Grapes: ${wine.grapes}. Region: ${wine.region}.`;
    await speakWineDescription(description, lang);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-in fade-in slide-in-from-right duration-500">
      {/* Header Fijo */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 p-6 lg:px-20 flex justify-between items-center border-b border-stone-100">
        <button onClick={onClose} className="flex items-center gap-2 text-stone-500 hover:text-red-950 transition-colors font-bold uppercase text-[10px] tracking-widest">
          <span className="text-lg">←</span> {t.back}
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handleListen}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${isPlaying ? 'bg-stone-100 text-stone-400' : 'bg-stone-900 text-white hover:bg-black'}`}
          >
            {isPlaying ? '⌛...' : `🔊 ${t.listen_sommelier}`}
          </button>
          <button 
            onClick={() => onOpenBottle(wine.id)}
            className="bg-red-950 text-white px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-red-900"
          >
            🍾 {t.btn_open}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Lado Izquierdo: Imagen Hero */}
        <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl bg-stone-50">
          {wine.image ? (
            <img src={wine.image} alt={wine.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">🍷</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Lado Derecho: Contenido */}
        <div className="space-y-12">
          <div>
            <p className="text-red-900 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">{wine.winery} • {wine.region}</p>
            <h1 className="text-6xl font-black text-stone-950 serif leading-none mb-6">{wine.name}</h1>
            <div className="flex gap-6 items-center">
              <span className="text-4xl font-light serif italic text-stone-400">{wine.year}</span>
              <span className="h-6 w-[1px] bg-stone-200"></span>
              <span className="bg-stone-100 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600">{wine.type}</span>
              <span className="text-red-900 font-bold text-sm">{wine.bottles} {t.units}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-y border-stone-100 py-10">
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-[0.2em] mb-3">{t.grapes}</p>
              <p className="text-lg font-bold text-stone-800 serif">{wine.grapes}</p>
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-[0.2em] mb-3">Country</p>
              <p className="text-lg font-bold text-stone-800 serif">{wine.country}</p>
            </div>
          </div>

          {/* Flavor Profile Visualization */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-stone-100 pb-2">{t.flavor_profile}</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: t.body, value: wine.flavorProfile?.body || 3 },
                { label: t.tannins, value: wine.flavorProfile?.tannins || 3 },
                { label: t.acidity, value: wine.flavorProfile?.acidity || 3 },
                { label: t.sweetness, value: wine.flavorProfile?.sweetness || 1 },
              ].map(attr => (
                <div key={attr.label}>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                    <span>{attr.label}</span>
                    <span className="text-stone-400">{attr.value}/5</span>
                  </div>
                  <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-900" style={{ width: `${attr.value * 20}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{t.notes}</h3>
            <p className="text-xl text-stone-600 serif italic leading-relaxed">
              "{wine.notes || 'No notes available for this vintage.'}"
            </p>
          </div>

          {wine.pairings && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{t.pairings}</h3>
              <div className="flex flex-wrap gap-2">
                {wine.pairings.map(p => (
                  <span key={p} className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-xs font-medium text-stone-600">
                    🍴 {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WineDetail;
