import React, { useState } from 'react';
import { generateBrandImage } from '../services/gemini';
import { Image as ImageIcon, Download, Sparkles } from 'lucide-react';

const VisualStudio: React.FC = () => {
  const [prompt, setPrompt] = useState("Minimalist logo for 'NEURO.FORM', blending a human brain with geometric circuitry, solarpunk style, forest green and silver colors, white background, high vector quality");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const img = await generateBrandImage(prompt, aspectRatio, imageSize);
      setGeneratedImage(img);
    } catch (e) {
      console.error(e);
      alert("Не удалось сгенерировать изображение. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <ImageIcon className="text-purple-400" /> Визуальная Студия
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Controls */}
        <div className="bg-slate-800/50 p-4 md:p-6 rounded-xl border border-slate-700 h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Промпт</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 text-sm"
                placeholder="Опишите изображение..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm text-slate-400 mb-2">Соотношение</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 text-sm"
                >
                  <option value="1:1">1:1 (Квадрат)</option>
                  <option value="16:9">16:9 (Ландшафт)</option>
                  <option value="9:16">9:16 (Сториз)</option>
                  <option value="4:3">4:3 (Стандарт)</option>
                  <option value="3:4">3:4 (Портрет)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Разрешение</label>
                <select 
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 text-sm"
                >
                  <option value="1K">1K</option>
                  <option value="2K">2K (Высокое)</option>
                  <option value="4K">4K (Ультра)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Рендеринг...' : 'Создать Ассет'} <Sparkles size={18} />
            </button>
            
            <div className="pt-4 border-t border-slate-700">
               <p className="text-xs text-slate-500">Пресеты: <strong>Брендинг Neuro.Form</strong></p>
               <div className="mt-2 flex flex-wrap gap-2">
                 <button onClick={() => setPrompt("Minimalist logo for 'NEURO.FORM', blending a human brain with geometric circuitry, solarpunk style, forest green and silver colors, white background, high vector quality")} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300">Логотип</button>
                 <button onClick={() => setPrompt("High-end futuristic home office setup, minimal, lots of plants, natural light, holographic interface floating above desk, cinematic lighting, 8k")} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300">Рабочее место</button>
                 <button onClick={() => setPrompt("Abstract visualization of a neural network turning into a structured crystal, deep green and silver palette, 3d render, octane render")} className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300">Абстракция</button>
               </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center min-h-[300px] md:min-h-[500px] p-4 relative">
          {generatedImage ? (
            <div className="relative group w-full h-full flex items-center justify-center">
              <img src={generatedImage} alt="Generated Asset" className="max-h-[300px] md:max-h-[600px] max-w-full rounded-lg shadow-2xl object-contain" />
              <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <a 
                  href={generatedImage} 
                  download={`neuro-form-asset-${Date.now()}.png`}
                  className="bg-slate-900/80 p-2 rounded-full text-white hover:text-purple-400 hover:bg-slate-900 border border-slate-700 backdrop-blur-sm block"
                >
                  <Download size={20} />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-600">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>Визуальный результат появится здесь</p>
              <p className="text-xs mt-2">Gemini Nano Banana Pro</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualStudio;