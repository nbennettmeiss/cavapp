
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import WineCard from './components/WineCard';
import WineForm from './components/WineForm';
import Stats from './components/Stats';
import QuickScan from './components/QuickScan';
import HomeDashboard from './components/HomeDashboard';
import WineDetail from './components/WineDetail';
import { Wine, ConsumptionLog, ViewType, WineType } from './types';
import { translations, Language } from './translations';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('cavapp_lang');
    return (saved as Language) || 'es';
  });
  const t = translations[lang];

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [wines, setWines] = useState<Wine[]>([]);
  const [history, setHistory] = useState<ConsumptionLog[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);

  useEffect(() => {
    localStorage.setItem('cavapp_lang', lang);
  }, [lang]);

  useEffect(() => {
    const savedWines = localStorage.getItem('somm_wines_v2');
    const savedHistory = localStorage.getItem('somm_history_v2');
    if (savedWines) setWines(JSON.parse(savedWines));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('somm_wines_v2', JSON.stringify(wines));
    localStorage.setItem('somm_history_v2', JSON.stringify(history));
  }, [wines, history]);

  const groupedWines = useMemo(() => {
    const filtered = wines.filter(wine => {
      const matchesSearch = wine.name.toLowerCase().includes(search.toLowerCase()) || 
                           wine.winery.toLowerCase().includes(search.toLowerCase()) ||
                           wine.grapes.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'All' || wine.type === filterType;
      return matchesSearch && matchesType;
    });

    const groups: Record<string, Wine[]> = {};
    filtered.forEach(wine => {
      const grape = wine.grapes || t.other_varieties;
      if (!groups[grape]) groups[grape] = [];
      groups[grape].push(wine);
    });

    return groups;
  }, [wines, search, filterType, t]);

  const handleAddWine = (newWineData: Partial<Wine>) => {
    if (selectedWine && currentView === 'add') {
      setWines(prev => prev.map(w => w.id === selectedWine.id ? { ...w, ...newWineData } as Wine : w));
      setSelectedWine(null);
    } else {
      const newWine: Wine = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...newWineData as Wine
      };
      setWines(prev => [newWine, ...prev]);
    }
    if (currentView !== 'scan') setCurrentView('inventory');
  };

  const handleOpenBottle = (id: string) => {
    const wine = wines.find(w => w.id === id);
    if (!wine || wine.bottles <= 0) return;
    setWines(prev => prev.map(w => w.id === id ? { ...w, bottles: w.bottles - 1 } : w));
    setHistory(prev => [{
      id: crypto.randomUUID(),
      wineId: id,
      wineName: wine.name,
      date: new Date().toISOString().split('T')[0]
    }, ...prev]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeDashboard wines={wines} onQuickAction={setCurrentView} lang={lang} />;
      case 'scan':
        return <QuickScan onAddWine={handleAddWine} onClose={() => setCurrentView('inventory')} lang={lang} />;
      case 'add':
        return <WineForm initialData={selectedWine || undefined} onSubmit={handleAddWine} onCancel={() => { setCurrentView('inventory'); setSelectedWine(null); }} lang={lang} />;
      case 'stats':
        return <Stats wines={wines} lang={lang} />;
      case 'history':
        return (
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-stone-100 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-900 serif mb-8">{t.consumption_journal}</h2>
            <div className="space-y-6">
              {history.map(log => (
                <div key={log.id} className="flex justify-between items-center py-4 border-b border-stone-50 group hover:px-2 transition-all">
                  <div>
                    <h4 className="font-bold text-stone-800 text-lg serif">{log.wineName}</h4>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">{log.date} • SAVORED</p>
                  </div>
                  <span className="bg-red-50 text-red-900 px-4 py-1 rounded-full text-xs font-bold uppercase">{t.btn_open}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'inventory':
      default:
        const grapeGroups = Object.keys(groupedWines).sort();
        return (
          <div className="space-y-16 pb-32">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between border-b border-stone-100 pb-10">
              <div className="relative w-full md:max-w-xl">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Curation Filter</p>
                <input 
                  type="text" 
                  placeholder={t.search_placeholder} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent py-4 outline-none focus:border-red-900 transition-all serif italic text-3xl text-stone-900 placeholder:text-stone-200"
                />
              </div>
              <div className="flex gap-4">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-2xl px-6 py-3 text-stone-700 font-bold text-xs uppercase tracking-widest cursor-pointer outline-none hover:bg-white transition-all"
                >
                  <option value="All">{t.filter_all}</option>
                  {Object.values(WineType).map(t_val => <option key={t_val} value={t_val}>{t_val}</option>)}
                </select>
              </div>
            </div>

            {grapeGroups.length === 0 ? (
              <div className="py-40 text-center">
                <h3 className="text-2xl font-bold text-stone-300 serif italic">No matches in your cellar</h3>
              </div>
            ) : (
              grapeGroups.map(grape => (
                <section key={grape} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="flex items-baseline justify-between mb-8 border-l-4 border-red-950 pl-6">
                    <h2 className="text-3xl font-bold text-stone-900 serif tracking-tight">{grape}</h2>
                    <span className="text-stone-400 text-sm font-bold tracking-widest">
                      {groupedWines[grape].reduce((acc, w) => acc + w.bottles, 0)} {t.total_bottles}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {groupedWines[grape].map(wine => (
                      <WineCard 
                        key={wine.id} 
                        wine={wine} 
                        onOpenBottle={handleOpenBottle}
                        onSelect={(w) => { setSelectedWine(w); setCurrentView('detail'); }}
                        lang={lang}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbf7]">
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar currentView={currentView} setView={setCurrentView} lang={lang} setLang={setLang} />
      </div>
      
      <main className="flex-1 px-6 py-12 lg:px-20 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView !== 'detail' && (
            <header className="mb-16 flex justify-between items-center">
              <div>
                <p className="text-red-900 font-black uppercase tracking-[0.4em] text-[10px] mb-3">Estates & Vintages</p>
                <h1 className="text-5xl lg:text-6xl font-black text-stone-950 serif tracking-tighter">
                  {currentView === 'home' ? t.nav_home : 
                   currentView === 'inventory' ? t.nav_cellar : 
                   currentView === 'stats' ? t.nav_stats : 
                   currentView === 'scan' ? t.nav_vision : t.nav_journal}
                </h1>
              </div>
            </header>
          )}

          {selectedWine && currentView === 'detail' && (
            <WineDetail 
              wine={selectedWine} 
              onClose={() => setCurrentView('inventory')} 
              onOpenBottle={handleOpenBottle}
              lang={lang}
            />
          )}

          {currentView !== 'detail' && renderContent()}
        </div>
      </main>

      <BottomNav currentView={currentView} setView={setCurrentView} lang={lang} />
    </div>
  );
};

export default App;
