
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const speakWineDescription = async (text: string, lang: 'en' | 'es') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `${lang === 'es' ? 'Actúa como un sommelier profesional. Describe este vino con elegancia:' : 'Act as a professional sommelier. Describe this wine with elegance:'} ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: lang === 'es' ? 'Kore' : 'Zephyr' 
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContent = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioContent.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioContent.length; i++) {
        view[i] = audioContent.charCodeAt(i);
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(arrayBuffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
      return true;
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
  return false;
};
