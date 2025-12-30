
import { GoogleGenAI, Type } from "@google/genai";
import { Language, translations } from "../translations";
import { Wine } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scanWineLabel = async (base64Image: string, lang: Language = 'en') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Usamos Pro para búsqueda y mejor razonamiento
      contents: [
        {
          parts: [
            { text: `As an expert sommelier, identify this wine label. 
              Use Google Search to find current market value, professional ratings, and drinking windows.
              Output all descriptive fields in the language: ${lang === 'es' ? 'Spanish' : 'English'}.
              Extract:
              - Name, Winery, Vintage, Country, Region, Type, Grapes.
              - 3-4 Tasting descriptors.
              - Food pairings.
              - Flavor profile (1-5 scales).
              - Current market price in USD.
              - Drink window years.` 
            },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      config: {
        tools: [{ googleSearch: {} }],
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

    // Extract text directly from property .text
    const text = response.text;
    const data = JSON.parse(text || '{}');

    // Extract grounding chunks for Search as per mandatory guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      const sources = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => `Source: ${chunk.web?.title} - ${chunk.web?.uri}`)
        .join('\n');
      if (sources) {
        data.notes = (data.notes ? data.notes + '\n\n' : '') + sources;
      }
    }

    return data;
  } catch (error) {
    console.error("Error scan:", error);
    return null;
  }
};

export const startConciergeChat = (inventory: Wine[], lang: Language) => {
  const t = translations[lang];
  const inventoryContext = inventory.map(w => 
    `- ${w.name} (${w.year}) by ${w.winery}. Type: ${w.type}. Bottles: ${w.bottles}. Region: ${w.region}. Window: ${w.windowStart}-${w.windowEnd}.`
  ).join('\n');

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `${t.chat_system}\n\nUSER'S CURRENT CELLAR INVENTORY:\n${inventoryContext}\n\nAlways use googleSearch to find recent reviews or ratings if asked about a specific bottle in the collection.`,
      tools: [{ googleSearch: {} }]
    }
  });
};
