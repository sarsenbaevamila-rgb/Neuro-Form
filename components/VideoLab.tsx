import React, { useState, useEffect } from 'react';
import { generateVeoVideo } from '../services/gemini';
import { Video, Film, AlertTriangle } from 'lucide-react';

const VideoLab: React.FC = () => {
  const [prompt, setPrompt] = useState("Cinematic shot of a stone brain cracking open to reveal a glowing emerald light, 4k, photorealistic, slow motion, mystical atmosphere");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check key status on mount
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.hasSelectedApiKey) {
        const hasKey = await aistudio.hasSelectedApiKey();
        setApiKeyMissing(!hasKey);
    }
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.openSelectKey) {
        await aistudio.openSelectKey();
        setApiKeyMissing(false);
    } else {
        alert("Окружение AI Studio не обнаружено.");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Re-verify key before call
      if (apiKeyMissing) {
          await handleSelectKey();
      }
      
      const url = await generateVeoVideo(prompt, aspectRatio);
      if (url) {
        setVideoUrl(url);
      } else {
        throw new Error("No video URL returned");
      }
    } catch (e) {
      console.error(e);
      // If unauthorized, it might mean the key wasn't selected or expired
      if (JSON.stringify(e).includes("403") || JSON.stringify(e).includes("401")) {
          setApiKeyMissing(true);
      }
      alert("Не удалось сгенерировать видео. Убедитесь, что выбран API ключ платного проекта.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-screen overflow-y-auto pb-24">
      <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <Video className="text-red-500" /> Видео Воронка (Veo 3)
      </h2>

      {apiKeyMissing && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-500" />
                <span className="text-yellow-200 text-sm">Для Veo требуется выбор API ключа платного проекта.</span>
            </div>
            <button 
                onClick={handleSelectKey}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
                Выбрать Project Key
            </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Промпт Сценария</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Формат</label>
               <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 text-sm"
                >
                  <option value="9:16">9:16 (Reels/Shorts)</option>
                  <option value="16:9">16:9 (Ландшафт)</option>
                </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Генерация (1-2 мин)...' : 'Создать Видео'} <Film size={18} />
            </button>

            <div className="pt-4 border-t border-slate-700">
               <p className="text-xs text-slate-500">Сценарии Воронки:</p>
               <div className="mt-2 space-y-2">
                 <button onClick={() => setPrompt("Cinematic shot of a stone brain cracking open to reveal a glowing emerald light, 4k, photorealistic, slow motion, mystical atmosphere")} className="w-full text-left text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-slate-300">Hook: Пробуждение</button>
                 <button onClick={() => setPrompt("Time-lapse of a messy desk cleaning itself up rapidly, transforming into a futuristic, clean minimalist workspace with floating holograms, photorealistic, 4k")} className="w-full text-left text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-slate-300">Value: Трансформация</button>
                 <button onClick={() => setPrompt("A futuristic door slowly opening into a serene digital zen garden, inviting light, cinematic 4k")} className="w-full text-left text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-slate-300">CTA: Вступай в Neuro.Form</button>
               </div>
            </div>
            
            <div className="text-xs text-slate-500 mt-4">
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-slate-300">Документация по биллингу</a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center min-h-[500px] p-4">
          {videoUrl ? (
            <video 
              controls 
              src={videoUrl} 
              className="max-h-[600px] rounded-lg shadow-2xl"
              autoPlay
              loop
            />
          ) : (
            <div className="text-center text-slate-600">
              <Film size={48} className="mx-auto mb-4 opacity-20" />
              <p>Видео появится здесь.</p>
              <p className="text-sm mt-2">Примечание: Генерация Veo может занять до 2 минут.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoLab;