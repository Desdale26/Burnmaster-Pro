
import { GoogleGenAI, Type } from "@google/genai";
import { RoastSettings, GeneratedRoast } from "../types";

export const generateRoast = async (settings: RoastSettings): Promise<GeneratedRoast> => {
  const { targetName, context, savageLevel, wittyLevel, absurdityLevel, style, focus, image } = settings;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Generate the Roast Text
  const textPrompt = `
    Generate a clever, personalized insult/roast for a person named "${targetName}".
    
    CUSTOMIZATION PARAMETERS:
    - Context: ${context}
    - Style: ${style}
    - Primary Focus: ${focus}
    - Savage Level (Mean-ness): ${savageLevel}/100
    - Witty Level (Intellect/Vocabulary): ${wittyLevel}/100
    - Absurdity Level (Surrealness): ${absurdityLevel}/100
    
    ${image ? 'Analyze the provided photo. Incorporate specific visual details (clothes, expression, hair) into the roast.' : ''}

    Guidelines:
    - High Savage: Be brutal and soul-crushing.
    - High Witty: Use complex metaphors, sharp wordplay, and devastating logic.
    - High Absurdity: Use surreal, nonsensical, and bizarre comparisons.
    - NO HATE SPEECH OR DISCRIMINATION.
    - The output MUST be valid JSON.
  `;

  const textParts: any[] = [{ text: textPrompt }];
  if (image) {
    textParts.push({
      inlineData: {
        data: image.split(',')[1],
        mimeType: 'image/jpeg',
      },
    });
  }

  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: textParts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          roastText: { type: Type.STRING },
          wit: { type: Type.NUMBER },
          heat: { type: Type.NUMBER },
          chaos: { type: Type.NUMBER }
        },
        required: ["roastText", "wit", "heat", "chaos"]
      }
    }
  });

  const rawText = textResponse.text || '{}';
  const data = JSON.parse(rawText);
  let caricatureUrl: string | undefined = undefined;

  // 2. Generate Caricature
  if (image) {
    try {
      const isExtreme = savageLevel > 75;
      const isChaos = absurdityLevel > 75;
      const mood = isExtreme ? "GRIM and AGGRESSIVE" : isChaos ? "SURREAL and PSYCHEDELIC" : "SATIRICAL and FUNNY";
      
      const imagePrompt = `
        Create a ${mood} digital caricature illustration based on the person in this photo.
        Focus specifically on: ${focus}.
        STYLE: Satirical editorial illustration. Exaggerate physical features massively. 
        Dark sharp lines, gritty textures for savage, neon weirdness for chaos.
      `;

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: image.split(',')[1],
                mimeType: 'image/jpeg',
              },
            },
            {
              text: imagePrompt,
            },
          ],
        },
      });

      if (imageResponse.candidates?.[0]?.content?.parts) {
        const imgPart = imageResponse.candidates[0].content.parts.find(p => !!p.inlineData);
        if (imgPart?.inlineData) {
          caricatureUrl = `data:image/png;base64,${imgPart.inlineData.data}`;
        }
      }
    } catch (e) {
      console.error("Visual distortion failed:", e);
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 6).toUpperCase(),
    text: data.roastText || "The AI refused to burn someone this boring.",
    timestamp: Date.now(),
    settings,
    caricatureUrl,
    stats: {
      wit: data.wit || wittyLevel,
      heat: data.heat || savageLevel,
      chaos: data.chaos || absurdityLevel
    }
  };
};
