import { GoogleGenAI, Type, Modality } from "@google/genai";

// We create a fresh instance per call for Veo mostly to handle key updates, 
// but for standard text/image calls we can use a helper to get the client.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketAnalysis = async (query: string) => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const generateConceptDeepThink = async (prompt: string) => {
  const ai = getAiClient();
  // Using gemini-3-pro-preview with high thinking budget for complex strategy
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 16000 }, // Deep thinking for strategy
    },
  });
  return response.text;
};

export const generateBrandImage = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K") => {
  const ai = getAiClient();
  // Using gemini-3-pro-image-preview (Nano Banana Pro)
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size, 
      },
    },
  });
  
  // Extract image from parts
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateVeoVideo = async (prompt: string, aspectRatio: string = "16:9") => {
  const ai = getAiClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: aspectRatio as '16:9' | '9:16',
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  if (downloadLink) {
    return `${downloadLink}&key=${process.env.API_KEY}`;
  }
  return null;
};

export const generateTTS = async (text: string, voiceName: string = 'Kore') => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio; // Return base64 to be decoded in component
};