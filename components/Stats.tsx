
import React from 'react';
import { Wine, WineType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Language, translations } from '../translations';

interface StatsProps {
  wines: Wine[];
  lang: Language;
}

const Stats: React.FC<StatsProps> = ({ wines, lang }) => {
  const t = translations[lang];
  const totalBottles = wines.reduce((acc, wine) => acc + wine.bottles, 0);
  const currentYear = new Date().getFullYear();
  
  // Datos para el Roadmap de Madurez (Próximos 10 años)
  const roadmapData = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear + i;
    const bottlesInPeak = wines.filter(w => year >= w.windowStart && year <= w.windowEnd)
                              .reduce((acc, w) => acc + w.bottles, 0);
    return { year, bottles: bottlesInPeak };
  });

  const typeData = Object.values(WineType).map(type => ({
    name: type,
    value: wines.filter(w => w.type === type).reduce((acc, w) => acc + w.bottles, 0)
  })).filter(d => d.value > 0);

  const countryData = Array.from(new Set(wines.map(w => w.country))).map(country => ({
    name: country || 'Unknown',
    bottles: wines.filter(w => w.country === country).reduce((acc, w) => acc + w.bottles, 0)
  })).sort((a, b) => b.bottles - a.bottles).slice(0, 5);

  const COLORS = ['#4A0404', '#7F1D1D', '#991B1B', '#B91C1C', '#DC2626', '#EF4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Total Inventory</p>
          <p className="text-5xl font-bold text-stone-900 serif">{totalBottles} <span className="text-lg text-stone-400 font-sans uppercase">{t.total_bottles}</span></p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">{t.unique_labels}</p>
          <p className="text-5xl font-bold text-stone-900 serif">{wines.length}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">{t.est_value}</p>
          <p className="text-5xl font-bold text-stone-900 serif text-red-950">
            ${wines.reduce((acc, w) => acc + (w.price || 0) * w.bottles, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Maturity Roadmap Section */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-stone-900 serif">{t.maturity_roadmap}</h3>
          <p className="text-stone-400 text-xs font-medium uppercase tracking-widest mt-1">{t.bottles_reaching_peak}</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={roadmapData}>
              <defs>
                <linearGradient id="colorBottles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A0404" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4A0404" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} dx={-10} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontFamily: 'serif'}}
                cursor={{stroke: '#4A0404', strokeWidth: 1, strokeDasharray: '4 4'}}
              />
              <Area 
                type="monotone" 
                dataKey="bottles" 
                stroke="#4A0404" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorBottles)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <h3 className="text-xl font-bold text-stone-900 serif mb-6">Distribution by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <h3 className="text-xl font-bold text-stone-900 serif mb-6">Top Countries</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="bottles" fill="#4A0404" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
