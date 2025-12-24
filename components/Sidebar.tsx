
import React from 'react';
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
  const navItems = [
    { id: 'home' as ViewType, label: t.nav_home, icon: '🏛️' },
    { id: 'inventory' as ViewType, label: t.nav_cellar, icon: '🍷' },
    { id: 'scan' as ViewType, label: t.nav_vision, icon: '📸' },
    { id: 'stats' as ViewType, label: t.nav_stats, icon: '📊' },
    { id: 'history' as ViewType, label: t.nav_journal, icon: '📜' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-stone-100 flex flex-col h-full shadow-sm">
      <div className="p-12">
        <h1 className="text-3xl font-bold text-red-950 serif tracking-tighter">{t.app_name}</h1>
        <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-[0.4em] font-bold">{t.tagline}</p>
      </div>

      <nav className="flex-1 px-6 space-y-3">
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
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-6">
        {/* Language Menu */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-50 rounded-2xl">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{t.language}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setLang('en')}
              className={`text-xs font-bold transition-all ${lang === 'en' ? 'text-red-950 underline underline-offset-4' : 'text-stone-300'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('es')}
              className={`text-xs font-bold transition-all ${lang === 'es' ? 'text-red-950 underline underline-offset-4' : 'text-stone-300'}`}
            >
              ES
            </button>
          </div>
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
