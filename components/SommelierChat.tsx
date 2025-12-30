
import React, { useState, useRef, useEffect } from 'react';
import { Wine } from '../types';
import { Language, translations } from '../translations';
import { startConciergeChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: any[];
}

interface SommelierChatProps {
  wines: Wine[];
  lang: Language;
}

const SommelierChat: React.FC<SommelierChatProps> = ({ wines, lang }) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startConciergeChat(wines, lang);
  }, [wines, lang]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      // Extract response text and grounding chunks to comply with Search Grounding requirements
      const responseText = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: responseText, 
        sources: groundingChunks.filter((chunk: any) => chunk.web)
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Forgive me, my connection to the cellar was briefly interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-[3rem] shadow-2xl border border-stone-100 overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-8 border-b border-stone-50 flex items-center gap-4 bg-stone-50/50">
        <div className="w-12 h-12 bg-red-950 rounded-2xl flex items-center justify-center text-xl shadow-lg">🤵‍♂️</div>
        <div>
          <h3 className="text-xl font-bold text-stone-900 serif">Cellar Concierge</h3>
          <p className="text-[10px] text-red-900 font-bold uppercase tracking-widest">AI Expert Advisor</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-[#fcfbf7]/30">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <span className="text-6xl mb-6 opacity-20">🍷</span>
            <h4 className="text-2xl font-bold text-stone-300 serif italic">{t.chat_empty}</h4>
            <div className="mt-8 grid grid-cols-1 gap-3 w-full max-w-xs">
              <button onClick={() => setInput("What wine should I open for a steak dinner?")} className="text-[10px] font-bold uppercase tracking-widest p-3 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-all text-stone-500">🥩 Steak Pairing</button>
              <button onClick={() => setInput("Which bottles are at their peak right now?")} className="text-[10px] font-bold uppercase tracking-widest p-3 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-all text-stone-500">🏆 Peak Maturity</button>
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-sm ${
              m.role === 'user' 
                ? 'bg-red-950 text-white rounded-tr-none' 
                : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
            }`}>
              <p className={`text-sm leading-relaxed ${m.role === 'model' ? 'serif text-lg italic' : 'font-medium'}`}>
                {m.text}
              </p>
              
              {/* Mandatory display of grounding sources when googleSearch is used */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-2">
                  {m.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-stone-50 hover:bg-stone-100 text-stone-500 px-3 py-1 rounded-lg border border-stone-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>🔗</span>
                      <span className="max-w-[150px] truncate">{source.web.title || 'Reference'}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-stone-100 p-4 rounded-full flex gap-1">
              <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
              <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
              <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-stone-50">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.chat_placeholder}
            className="w-full bg-stone-50 border-none rounded-2xl py-5 pl-8 pr-20 outline-none focus:ring-2 focus:ring-red-900/10 serif italic text-lg"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bg-red-950 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-30 shadow-lg"
          >
            <span className="text-xl">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SommelierChat;
