
import React, { useMemo } from 'react';
import { Wine } from '../types';
import { Language, translations } from '../translations';

interface HomeDashboardProps {
  wines: Wine[];
  onQuickAction: (view: any) => void;
  lang: Language;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ wines, onQuickAction, lang }) => {
  const t = translations[lang];
  const totalValue = wines.reduce((acc, w) => acc + (w.price || 0) * w.bottles, 0);
  const totalBottles = wines.reduce((acc, w) => acc + w.bottles, 0);
  
  const currentYear = new Date().getFullYear();
  const readyToDrink = wines.filter(w => currentYear >= w.windowStart && currentYear <= w.windowEnd);

  // Algoritmo de Curaduría: Busca el vino más cercano al centro de su ventana de consumo
  const sommelierPick = useMemo(() => {
    if (wines.length === 0) return null;
    const sorted = [...wines].sort((a, b) => {
      const distA = Math.abs(currentYear - (a.windowStart + a.windowEnd) / 2);
      const distB = Math.abs(currentYear - (b.windowStart + b.windowEnd) / 2);
      return distA - distB;
    });
    return sorted[0];
  }, [wines, currentYear]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Hero Stats */}
      <section className="relative overflow-hidden bg-stone-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-900/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-stone-400 text-sm font-bold uppercase tracking-[0.3em] mb-4">Master Collection</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-bold serif">${totalValue.toLocaleString()}</span>
              <span className="text-stone-500 uppercase text-xs tracking-widest pl-2">{t.est_value}</span>
            </div>
          </div>
          <div className="flex gap-8 border-l border-white/10 pl-8">
            <div className="text-center">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-1">{t.total_bottles}</p>
              <p className="text-3xl font-bold serif">{totalBottles}</p>
            </div>
            <div className="text-center">
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-1">{t.ready_title}</p>
              <p className="text-3xl font-bold serif text-gold-500" style={{color: '#C5A059'}}>{readyToDrink.length}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sommelier's Recommendation Card */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-amber-100">
              {t.somm_choice}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {sommelierPick ? (
              <>
                <div className="w-48 h-64 rounded-2xl bg-stone-50 overflow-hidden shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-700">
                  <img src={sommelierPick.image} className="w-full h-full object-cover" alt={sommelierPick.name} />
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{sommelierPick.winery}</h4>
                    <h3 className="text-4xl font-black text-stone-900 serif leading-tight">{sommelierPick.name}</h3>
                    <p className="text-xl text-stone-400 serif italic mt-2">{sommelierPick.year} • {sommelierPick.grapes}</p>
                  </div>
                  
                  <div className="bg-[#fcfbf7] p-6 rounded-2xl border-l-4 border-amber-400">
                    <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-2">{t.why_this}</p>
                    <p className="text-sm text-stone-600 leading-relaxed italic">
                      {lang === 'es' 
                        ? `Este vino está entrando en su ventana ideal de consumo (${sommelierPick.windowStart}-${sommelierPick.windowEnd}). Sus notas de ${sommelierPick.tastingNotes?.slice(0,2).join(' y ')} están en su máxima expresión.`
                        : `This vintage is perfectly entering its peak window (${sommelierPick.windowStart}-${sommelierPick.windowEnd}). Notes of ${sommelierPick.tastingNotes?.slice(0,2).join(' and ')} are showing beautifully today.`
                      }
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center w-full">
                <p className="text-stone-300 serif italic text-xl">Add your first bottle to get a curation</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-[#F5F2ED] p-8 rounded-[2rem] border border-stone-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900 serif mb-4">Cellar Assistant</h3>
            <p className="text-stone-500 text-sm leading-relaxed italic">"{t.assistant_msg}"</p>
          </div>
          <div className="mt-8 space-y-3">
            <button 
              onClick={() => onQuickAction('scan')}
              className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
            >
              <span>📸</span> {t.btn_scan}
            </button>
            <button 
              onClick={() => onQuickAction('concierge')}
              className="w-full bg-white text-stone-900 border border-stone-200 py-4 rounded-2xl font-bold hover:bg-stone-50 transition-all"
            >
              {t.nav_concierge}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
