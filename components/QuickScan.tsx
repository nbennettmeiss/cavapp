
import React, { useState, useRef, useEffect } from 'react';
import { Wine } from '../types';
import { scanWineLabel } from '../services/geminiService';
import { Language, translations } from '../translations';

interface QuickScanProps {
  onAddWine: (wine: Partial<Wine>) => void;
  onClose: () => void;
  lang: Language;
}

// Added lang prop to component signature and utilized translations for status messages
const QuickScan: React.FC<QuickScanProps> = ({ onAddWine, onClose, lang }) => {
  const t = translations[lang];
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewWine, setPreviewWine] = useState<Partial<Wine> | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Abrir cámara automáticamente al montar si es mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!capturedImage && !isProcessing) {
        fileInputRef.current?.click();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [capturedImage, isProcessing]);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setStatusMessage(t.scanning);
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setCapturedImage(base64Data);
      
      const base64 = base64Data.split(',')[1];
      
      setStatusMessage(t.scanning);
      const result = await scanWineLabel(base64, lang);
      
      if (result) {
        setStatusMessage(t.identified);
        setPreviewWine({
          ...result,
          image: base64Data,
          bottles: 1,
          purchaseDate: new Date().toISOString().split('T')[0],
        });
      } else {
        setStatusMessage('Error');
        setCapturedImage(null);
      }
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleConfirm = () => {
    if (previewWine) {
      onAddWine(previewWine);
      setPreviewWine(null);
      setCapturedImage(null);
      fileInputRef.current?.click(); // Continuar escaneando otra
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950 z-50 flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Header Minimalista */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          <h2 className="text-white text-sm font-bold uppercase tracking-[0.3em] serif">AI Vision Mode</h2>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white text-2xl transition-colors">✕</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {!capturedImage && !isProcessing ? (
          <div className="text-center px-8">
            <div className="w-64 h-64 mx-auto mb-12 relative">
              <div className="absolute inset-0 border-2 border-stone-800 rounded-3xl"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-stone-950 px-4 text-stone-500 text-[10px] uppercase tracking-widest">{t.scan_area}</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span className="text-8xl">🍷</span>
              </div>
            </div>
            <h3 className="text-white text-2xl font-bold serif mb-4">{t.scan_ready}</h3>
            <p className="text-stone-500 mb-10 max-w-xs mx-auto text-sm leading-relaxed">
              {t.scan_desc}
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-red-900 text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:bg-red-800 transition-all active:scale-95 flex items-center gap-3 mx-auto"
            >
              <span className="text-xl">📸</span> {t.nav_vision}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              hidden 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>
        ) : isProcessing ? (
          <div className="w-full h-full relative flex flex-col items-center justify-center">
            {capturedImage && (
              <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" alt="captured" />
            )}
            <div className="relative z-10 text-center">
              <div className="w-48 h-64 border-2 border-red-900/50 rounded-2xl relative overflow-hidden mb-8 shadow-[0_0_50px_rgba(127,29,29,0.3)]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 shadow-[0_0_15px_#ef4444] animate-[scan_2s_ease-in-out_infinite]"></div>
                {capturedImage && <img src={capturedImage} className="w-full h-full object-cover opacity-80" alt="capturing" />}
              </div>
              <p className="text-white font-bold text-lg serif tracking-wide animate-pulse">{statusMessage}</p>
            </div>
          </div>
        ) : previewWine ? (
          <div className="w-full max-w-sm mx-auto bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-12 duration-500">
            <div className="h-56 relative">
              <img src={capturedImage!} className="w-full h-full object-cover" alt="Scan preview" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-8">
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest block mb-1">{t.identified}</span>
                <h3 className="text-white text-2xl font-bold serif">{previewWine.name}</h3>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">{t.winery}</p>
                  <p className="text-white font-medium">{previewWine.winery}</p>
                </div>
                <div>
                  <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">{t.grapes}</p>
                  <p className="text-white font-medium truncate">{previewWine.grapes}</p>
                </div>
                <div>
                  <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">{t.vintage}</p>
                  <p className="text-white font-medium">{previewWine.year}</p>
                </div>
                <div>
                  <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">{t.region}</p>
                  <p className="text-white font-medium truncate">{previewWine.region}, {previewWine.country}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-stone-400 text-xs italic serif leading-relaxed mb-6">
                  {t.notes}: {previewWine.tastingNotes?.join(', ')}
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleConfirm}
                    className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
                  >
                    {t.btn_entry}
                  </button>
                  <button 
                    onClick={() => { setPreviewWine(null); setCapturedImage(null); fileInputRef.current?.click(); }}
                    className="w-16 bg-white/5 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default QuickScan;
