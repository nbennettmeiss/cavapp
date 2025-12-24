
import React from 'react';
import { ViewType } from '../types';
import { Language, translations } from '../translations';

interface BottomNavProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  lang: Language;
}

// Added lang prop to component signature and utilized translations for nav item labels
const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, lang }) => {
  const t = translations[lang];
  const navItems = [
    { id: 'home' as ViewType, label: t.nav_home, icon: '🏛️' },
    { id: 'inventory' as ViewType, label: t.nav_cellar, icon: '🍷' },
    { id: 'scan' as ViewType, label: t.nav_vision, icon: '📸' },
    { id: 'stats' as ViewType, label: t.nav_stats, icon: '📊' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-stone-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-50 pb-safe">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            currentView === item.id 
              ? 'text-white scale-110' 
              : 'text-stone-500'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className={`text-[8px] font-bold uppercase tracking-widest ${
            currentView === item.id ? 'opacity-100' : 'opacity-40'
          }`}>
            {item.label}
          </span>
        </button>
      ))}
      <button
        onClick={() => setView('add')}
        className="w-12 h-12 bg-red-900 text-white rounded-full flex items-center justify-center shadow-2xl -mt-10 border-4 border-stone-900"
      >
        <span className="text-xl">+</span>
      </button>
    </nav>
  );
};

export default BottomNav;
