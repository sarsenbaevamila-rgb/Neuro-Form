import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Radio, Mic, MicOff } from 'lucide-react';

const LiveBrainstorm: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Готов к подключению");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Audio Contexts
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null); // To store session object
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const cleanup = () => {
      // Stop media tracks
      if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      // Close contexts
      if (inputAudioContextRef.current) inputAudioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
      // Reset state
      setConnected(false);
      setStatus("Отключено");
  };

  useEffect(() => {
      return cleanup;
  }, []);

  // Helper: Create PCM Blob
  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    
    // Custom Encode logic as per instructions (simple byte mapping)
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(binary);

    return {
      data: b64,
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  // Helper: Decode Audio
  const decodeAudioData = async (b64: string, ctx: AudioContext) => {
    const binaryString = atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 16-bit PCM decode
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length; // Mono
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const connectToLive = async () => {
    setStatus("Инициализация...");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Setup Audio Contexts
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        // Get Mic Stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Connect Gemini Live
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                systemInstruction: "Ты опытный стратег цифровых продуктов. Твоя цель — помочь пользователю доработать идею проекта 'Neuro.Form'. Будь краток, задавай уточняющие вопросы по бизнес-модели и плану запуска. Отвечай на русском языке.",
            },
            callbacks: {
                onopen: () => {
                    setStatus("Подключено. Штурм начался.");
                    setConnected(true);

                    // Setup Input Processing
                    if (inputAudioContextRef.current) {
                        const source = inputAudioContextRef.current.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (e) => {
                             if (isMuted) return; // Simple mute
                             const inputData = e.inputBuffer.getChannelData(0);
                             const pcmBlob = createBlob(inputData);
                             
                             sessionPromise.then(session => {
                                 sessionRef.current = session;
                                 session.sendRealtimeInput({ media: pcmBlob });
                             });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current.destination);
                    }
                },
                onmessage: async (msg: LiveServerMessage) => {
                    // Handle Audio Output
                    const b64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (b64Audio && outputAudioContextRef.current) {
                        const ctx = outputAudioContextRef.current;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        
                        const buffer = await decodeAudioData(b64Audio, ctx);
                        const source = ctx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(ctx.destination);
                        source.onended = () => sourcesRef.current.delete(source);
                        source.start(nextStartTimeRef.current);
                        
                        nextStartTimeRef.current += buffer.duration;
                        sourcesRef.current.add(source);
                    }
                    
                    // Handle Interruption
                    if (msg.serverContent?.interrupted) {
                        sourcesRef.current.forEach(s => s.stop());
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onclose: () => {
                    setStatus("Соединение закрыто");
                    setConnected(false);
                },
                onerror: (e) => {
                    console.error(e);
                    setStatus("Ошибка соединения");
                }
            }
        });

    } catch (e) {
        console.error("Connection Failed", e);
        setStatus("Не удалось подключиться");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="bg-slate-800 p-6 md:p-8 rounded-full mb-6 md:mb-8 relative">
            <div className={`absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 ${connected ? 'animate-pulse' : 'hidden'}`}></div>
            <Radio size={48} className={`md:w-16 md:h-16 ${connected ? "text-emerald-400" : "text-slate-600"}`} />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2 text-center">Live Стратегическая Сессия</h2>
        <p className="text-slate-400 mb-8 text-center">{status}</p>

        {!connected ? (
            <button 
                onClick={connectToLive}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-emerald-500/20 transition-all w-full md:w-auto"
            >
                Подключиться к Gemini Live
            </button>
        ) : (
            <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto items-center">
                 <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full border ${isMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-700 border-slate-600 text-slate-200'}`}
                >
                    {isMuted ? <MicOff /> : <Mic />}
                </button>
                <button 
                    onClick={cleanup}
                    className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold transition-all w-full md:w-auto"
                >
                    Завершить Сессию
                </button>
            </div>
        )}
        
        <div className="mt-8 text-center max-w-md text-slate-500 text-sm px-4">
            <p>Говорите естественно. Обсудите аватары клиентов, цены или контент. ИИ будет отвечать в реальном времени голосом.</p>
        </div>
        
        {/* Hidden elements for potential video expansion */}
        <video ref={videoRef} className="hidden" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default LiveBrainstorm;