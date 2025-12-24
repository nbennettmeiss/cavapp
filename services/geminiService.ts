
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scanWineLabel = async (base64Image: string, lang: Language = 'en') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [
        {
          parts: [
            { text: `As an expert sommelier, identify this wine label. 
              Output all descriptive fields (tastingNotes, pairings, region, grapes) in the language: ${lang === 'es' ? 'Spanish' : 'English'}.
              Extract precisely:
              - Full name of the wine
              - Winery (Bodega)
              - Vintage year (Añada)
              - Country and specific Region
              - Wine Type (Red, White, Rosé, Sparkling, or Fortified)
              - Grapes/Varietal (Cepa/s)
              - Tasting notes (3-4 descriptors)
              - Food pairings
              - Flavor profile (1-5 scale for body, tannins, acidity, sweetness)
              - Estimated market price in USD
              - Optimal drinking window (start/end year)` 
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            winery: { type: Type.STRING },
            region: { type: Type.STRING },
            country: { type: Type.STRING },
            year: { type: Type.INTEGER },
            type: { type: Type.STRING },
            grapes: { type: Type.STRING },
            tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            pairings: { type: Type.ARRAY, items: { type: Type.STRING } },
            flavorProfile: {
              type: Type.OBJECT,
              properties: {
                body: { type: Type.INTEGER },
                tannins: { type: Type.INTEGER },
                acidity: { type: Type.INTEGER },
                sweetness: { type: Type.INTEGER }
              }
            },
            windowStart: { type: Type.INTEGER },
            windowEnd: { type: Type.INTEGER },
            price: { type: Type.NUMBER }
          },
          required: ["name", "winery", "year", "type", "grapes"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error en el escaneo inteligente:", error);
    return null;
  }
};
