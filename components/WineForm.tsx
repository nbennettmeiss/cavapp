
import React, { useState, useRef } from 'react';
import { Wine, WineType } from '../types';
import { scanWineLabel } from '../services/geminiService';
import { Language, translations } from '../translations';

interface WineFormProps {
  initialData?: Wine;
  onSubmit: (wine: Partial<Wine>) => void;
  onCancel: () => void;
  lang: Language;
}

// Added lang prop to component signature and utilized translations for labels and placeholders
const WineForm: React.FC<WineFormProps> = ({ initialData, onSubmit, onCancel, lang }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Partial<Wine>>(initialData || {
    name: '',
    winery: '',
    region: '',
    country: '',
    year: new Date().getFullYear(),
    type: WineType.RED,
    grapes: '',
    bottles: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    windowStart: new Date().getFullYear(),
    windowEnd: new Date().getFullYear() + 5,
    location: '',
    notes: '',
  });
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await scanWineLabel(base64, lang);
      if (result) {
        setFormData(prev => ({ 
          ...prev, 
          ...result, 
          image: reader.result as string 
        }));
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['bottles', 'year', 'windowStart', 'windowEnd'].includes(name) ? parseInt(value) : value 
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-xl max-w-4xl mx-auto overflow-y-auto max-h-[85vh]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-stone-900 serif">{initialData ? 'Edit Wine' : 'Add New Wine'}</h2>
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-stone-100 text-stone-800 px-5 py-3 rounded-2xl hover:bg-stone-200 transition-colors"
          >
            <span>{isScanning ? `⏳ ${t.scanning}` : `📸 ${t.btn_scan}`}</span>
            <input 
              type="file" 
              hidden 
              ref={fileInputRef} 
              accept="image/*" 
              capture="environment" 
              onChange={handleScan} 
            />
          </button>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-600 px-4">Close</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Wine Name</label>
            <input 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange}
              className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-red-900/10 outline-none" 
              placeholder="e.g. Cabernet Sauvignon Reserve"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t.winery}</label>
            <input 
              name="winery" 
              value={formData.winery || ''} 
              onChange={handleChange}
              className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-red-900/10 outline-none"
              placeholder="e.g. Bodega Catena Zapata"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t.vintage}</label>
              <input 
                name="year" 
                type="number" 
                value={formData.year || ''} 
                onChange={handleChange}
                className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-red-900/10 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Type</label>
              <select 
                name="type" 
                value={formData.type || ''} 
                onChange={handleChange}
                className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-red-900/10 outline-none"
              >
                {Object.values(WineType).map(t_val => <option key={t_val} value={t_val}>{t_val}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t.grapes}</label>
            <input 
              name="grapes" 
              value={formData.grapes || ''} 
              onChange={handleChange}
              className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-red-900/10 outline-none"
              placeholder="e.g. 100% Malbec"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t.region}</label>
            <div className="grid grid-cols-2 gap-4">
              <input name="country" value={formData.country || ''} onChange={handleChange} placeholder="Country" className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none" />
              <input name="region" value={formData.region || ''} onChange={handleChange} placeholder="Region" className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t.units}</label>
              <input name="bottles" type="number" value={formData.bottles || 0} onChange={handleChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Storage Location</label>
              <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none" placeholder="e.g. Shelf A4" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Drinking Window</label>
            <div className="flex items-center space-x-4">
              <input name="windowStart" type="number" value={formData.windowStart || ''} onChange={handleChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none" />
              <span className="text-stone-400">to</span>
              <input name="windowEnd" type="number" value={formData.windowEnd || ''} onChange={handleChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">{t.notes}</label>
            <textarea 
              name="notes" 
              value={formData.notes || ''} 
              onChange={handleChange}
              className="w-full bg-stone-50 border-none rounded-2xl p-4 outline-none h-32" 
              placeholder="Notes on tasting, pairing, etc."
            />
          </div>
          <button 
            onClick={() => onSubmit(formData)}
            className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-black transition-all"
          >
            {initialData ? 'Update Record' : t.btn_save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WineForm;
