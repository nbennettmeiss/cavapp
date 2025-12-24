
import React from 'react';
import { Wine, WineType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Language, translations } from '../translations';

interface StatsProps {
  wines: Wine[];
  lang: Language;
}

// Added lang prop to component signature and utilized translations for localized labels
const Stats: React.FC<StatsProps> = ({ wines, lang }) => {
  const t = translations[lang];
  const totalBottles = wines.reduce((acc, wine) => acc + wine.bottles, 0);
  
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Total Inventory</p>
          <p className="text-5xl font-bold text-stone-900 serif">{totalBottles} <span className="text-lg text-stone-400 font-sans uppercase">{t.total_bottles}</span></p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">{t.unique_labels}</p>
          <p className="text-5xl font-bold text-stone-900 serif">{wines.length}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">{t.est_value}</p>
          <p className="text-5xl font-bold text-stone-900 serif">
            ${wines.reduce((acc, w) => acc + (w.price || 0) * w.bottles, 0).toLocaleString()}
          </p>
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
