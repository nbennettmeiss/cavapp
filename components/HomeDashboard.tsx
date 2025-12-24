
import React from 'react';
import { Wine } from '../types';
import { Language, translations } from '../translations';

interface HomeDashboardProps {
  wines: Wine[];
  onQuickAction: (view: any) => void;
  lang: Language;
}

// Added lang prop to component signature and utilized translations
const HomeDashboard: React.FC<HomeDashboardProps> = ({ wines, onQuickAction, lang }) => {
  const t = translations[lang];
  const totalValue = wines.reduce((acc, w) => acc + (w.price || 0) * w.bottles, 0);
  const totalBottles = wines.reduce((acc, w) => acc + w.bottles, 0);
  
  const currentYear = new Date().getFullYear();
  const readyToDrink = wines.filter(w => currentYear >= w.windowStart && currentYear <= w.windowEnd);

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
              <span className="text-stone-500 uppercase text-xs tracking-widest">{t.est_value}</span>
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
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold text-stone-900 serif">Signature Selection</h3>
            <button onClick={() => onQuickAction('inventory')} className="text-red-900 font-bold text-xs uppercase tracking-widest border-b-2 border-red-900 pb-1">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wines.slice(0, 2).map(wine => (
              <div key={wine.id} className="bg-white p-6 rounded-3xl border border-stone-100 flex gap-4 shadow-sm">
                <div className="w-20 h-20 rounded-2xl bg-stone-50 overflow-hidden flex-shrink-0">
                  <img src={wine.image} className="w-full h-full object-cover" alt={wine.name} />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-stone-900 serif truncate">{wine.name}</h4>
                  <p className="text-xs text-stone-400">{wine.winery} • {wine.year}</p>
                  <div className="mt-2 flex gap-1">
                     <span className="text-[10px] text-red-900 font-bold uppercase tracking-tighter">Premium Selection</span>
                  </div>
                </div>
              </div>
            ))}
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
              onClick={() => onQuickAction('add')}
              className="w-full bg-white text-stone-900 border border-stone-200 py-4 rounded-2xl font-bold hover:bg-stone-50 transition-all"
            >
              Manual Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
