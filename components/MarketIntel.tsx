import React, { useState } from 'react';
import { generateMarketAnalysis } from '../services/gemini';
import { Search, Globe, ArrowRight } from 'lucide-react';

const MarketIntel: React.FC = () => {
  const [query, setQuery] = useState("тренды цифровой продуктивности и ии выгорание 2024 2025");
  const [result, setResult] = useState<string | null>(null);
  const [grounding, setGrounding] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await generateMarketAnalysis(query);
      setResult(data.text);
      setGrounding(data.grounding || []);
    } catch (e) {
      console.error(e);
      setResult("Ошибка анализа рынка. Пожалуйста, проверьте API ключ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <Globe className="text-blue-400" /> Анализ Рынка
      </h2>
      
      <div className="bg-slate-800/50 p-4 md:p-6 rounded-xl border border-slate-700 mb-8">
        <label className="block text-sm text-slate-400 mb-2">Запрос для исследования</label>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500"
            placeholder="Введите тему для анализа..."
          />
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Сканирование...' : 'Анализировать'} <Search size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Работает на Gemini 2.5 Flash + Google Search</p>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Отчет разведки</h3>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {result}
            </div>
          </div>

          {grounding.length > 0 && (
            <div className="bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Источники</h3>
              <div className="grid gap-3">
                {grounding.map((chunk, idx) => (
                  chunk.web?.uri && (
                    <a 
                      key={idx}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors group"
                    >
                      <span className="text-slate-300 truncate text-sm font-medium pr-4">{chunk.web.title || chunk.web.uri}</span>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-blue-400 flex-shrink-0" />
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketIntel;