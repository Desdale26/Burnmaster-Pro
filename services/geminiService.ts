
import { GoogleGenAI, Type } from "@google/genai";
import { RoastSettings, GeneratedRoast } from "../types";

export const generateRoast = async (settings: RoastSettings): Promise<GeneratedRoast> => {
  const { targetName, context, savageLevel, wittyLevel, absurdityLevel, style, focus, image } = settings;
  
  // Use a fresh instance with the system-provided API key
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
    - High Savage: Be brutal. Low Savage: Be playful teasing.
    - High Witty: Use complex metaphors and academic burns.
    - High Absurdity: Use weird, nonsensical comparisons.
    - ABSOLUTELY NO HATE SPEECH, SLURS, OR DISCRIMINATION.
    - The output must be in JSON format.
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
          originality: { type: Type.NUMBER }
        },
        required: ["roastText", "wit", "heat", "originality"]
      }
    }
  });

  const data = JSON.parse(textResponse.text || '{}');
  let caricatureUrl: string | undefined = undefined;

  // 2. Generate Caricature using gemini-2.5-flash-image
  if (image) {
    try {
      // DYNAMIC BRUTALITY: Adjust prompt intensity based on savageLevel slider
      const isExtreme = savageLevel > 70;
      const intensityAdjective = isExtreme ? "VILE, GROTESQUE, and UTTERLY UNFORGIVING" : "RUTHLESS and HIGHLY EXAGGERATED";
      
      const imagePrompt = `
        Create a ${intensityAdjective} digital caricature of the person in the provided photo.
        
        STYLE: Gritty, high-detail editorial satire. Think political cartoonists who hate their subjects. Harsh lighting, deep shadows, and exaggerated textures.
        
        INSTRUCTIONS:
        1. IDENTIFY WEAKNESSES: Locate the subject's most awkward physical traits (forehead, nose, chin, posture, hairline, teeth).
        2. EXAGGERATE TO OBLIVION: ${isExtreme ? 'Rippling, grotesque anatomical distortions.' : 'Bold, satirical exaggerations.'} If they have a forehead, make it a five-head. If they have a chin, make it a mountain or a pebble.
        3. CAPTURE THE SOUL: Focus on an expression of utter incompetence, arrogance, or confusion. 
        4. ARTISTIC DIRECTION: This is a BRUTAL ROAST. Do not make them look attractive. Highlight every wrinkle, blemish, and stray hair. 
        5. The final image must be recognizable but should make the subject question their life choices.
        
        THIS IS NOT A FRIENDLY CARTOON. THIS IS A VISUAL EXECUTION.
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

      for (const part of imageResponse.candidates?.[0]?.content.parts || []) {
        if (part.inlineData) {
          caricatureUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (e) {
      console.error("Caricature generation failed:", e);
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    text: data.roastText || "You're so boring the AI forgot how to roast you.",
    timestamp: Date.now(),
    settings,
    caricatureUrl,
    stats: {
      wit: data.wit || Math.floor(Math.random() * 100),
      heat: data.heat || Math.floor(Math.random() * 100),
      originality: data.originality || Math.floor(Math.random() * 100)
    }
  };
};
