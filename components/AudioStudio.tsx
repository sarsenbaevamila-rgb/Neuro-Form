import React, { useState, useEffect, useRef } from 'react';
import { generateTTS } from '../services/gemini';
import { Mic, Play, Square } from 'lucide-react';

const AudioStudio: React.FC = () => {
  const [text, setText] = useState("Добро пожаловать в Neuro.Form. Сделайте глубокий вдох. Сегодня мы откалибруем ваш фокус. Закройте лишние вкладки.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Helper to decode raw PCM data from Gemini
  const decodeAudioData = async (b64: string, ctx: AudioContext) => {
      const binaryString = atob(b64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // 16-bit PCM decode
      const dataInt16 = new Int16Array(bytes.buffer);
      const frameCount = dataInt16.length;
      // TTS usually returns 24000Hz mono
      const buffer = ctx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
      }
      return buffer;
  };

  const playAudio = async (base64String: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    try {
        const audioBuffer = await decodeAudioData(base64String, audioContextRef.current);
        
        if (sourceRef.current) {
            sourceRef.current.stop();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
    } catch (e) {
        console.error("Error decoding audio", e);
    }
  };

  const handleGenerateAndPlay = async () => {
    if (isPlaying && sourceRef.current) {
        sourceRef.current.stop();
        setIsPlaying(false);
        return;
    }

    setLoading(true);
    try {
      const audioData = await generateTTS(text, 'Kore');
      if (audioData) {
        await playAudio(audioData);
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка генерации речи.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
        <Mic className="text-emerald-400" /> Аудио Студия (TTS)
      </h2>

      <div className="bg-slate-800/50 p-4 md:p-8 rounded-xl border border-slate-700">
        <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-200 mb-2">Голос "Нейро-Гида"</h3>
            <p className="text-slate-400 text-sm mb-4">Создавайте ежедневные настройки для сообщества.</p>
            <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm md:text-base"
            />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
                onClick={handleGenerateAndPlay}
                disabled={loading}
                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isPlaying 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
            >
                {loading ? 'Генерация...' : isPlaying ? (
                    <><Square size={18} fill="currentColor" /> Остановить</>
                ) : (
                    <><Play size={18} fill="currentColor" /> Озвучить</>
                )}
            </button>
            <span className="text-slate-500 text-sm">Голос: <strong>Kore</strong> (Спокойный, Глубокий)</span>
        </div>
      </div>
    </div>
  );
};

export default AudioStudio;