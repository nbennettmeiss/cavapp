
import React, { useState } from 'react';
import { ViewType } from '../types';
import { translations, Language } from '../translations';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, lang, setLang }) => {
  const t = translations[lang];
  const [showLangMenu, setShowLangMenu] = useState(false);

  const navItems = [
    { id: 'home' as ViewType, label: t.nav_home, icon: '🏛️' },
    { id: 'inventory' as ViewType, label: t.nav_cellar, icon: '🍷' },
    { id: 'concierge' as ViewType, label: t.nav_concierge, icon: '🤵‍♂️' },
    { id: 'scan' as ViewType, label: t.nav_vision, icon: '📸' },
    { id: 'stats' as ViewType, label: t.nav_stats, icon: '📊' },
    { id: 'history' as ViewType, label: t.nav_journal, icon: '📜' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-stone-100 flex flex-col h-full shadow-sm">
      <div className="p-12">
        <h1 className="text-4xl font-black text-red-950 serif tracking-tighter">CAVAPP</h1>
        <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-[0.4em] font-bold">{t.tagline}</p>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-red-950 text-white shadow-xl translate-x-2' 
                : 'text-stone-500 hover:bg-stone-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-4">
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="w-full flex items-center justify-between px-6 py-3 bg-stone-50 rounded-2xl hover:bg-stone-100 transition-all border border-stone-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🌍</span>
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">{t.language}: {lang.toUpperCase()}</span>
            </div>
            <span className={`text-[10px] transition-transform ${showLangMenu ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showLangMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-stone-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
              <button 
                onClick={() => { setLang('en'); setShowLangMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${lang === 'en' ? 'bg-red-50 text-red-950' : 'text-stone-400 hover:bg-stone-50'}`}
              >
                🇺🇸 English (EN)
              </button>
              <button 
                onClick={() => { setLang('es'); setShowLangMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${lang === 'es' ? 'bg-red-50 text-red-950' : 'text-stone-400 hover:bg-stone-50'}`}
              >
                🇪🇸 Español (ES)
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={() => setView('add')}
          className="w-full bg-stone-900 text-white py-5 rounded-[1.5rem] font-bold shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> {t.btn_entry}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
