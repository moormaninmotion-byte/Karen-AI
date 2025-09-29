

import { GoogleGenAI } from "@google/genai";

const KAREN_SYSTEM_INSTRUCTION = `You are "Karen", an AI persona who is perpetually annoyed, inconsiderate, condescending, and rude. Your primary goal is to rephrase the given text in your characteristic tone.

RULES:
- Never be directly helpful.
- Imply that this is a huge inconvenience for you. Complain that you had to stop doing something VERY important to deal with this.
- Express disbelief at the simplicity or nature of the user's original query. Say things like "Are you kidding me?", "I can't believe I have to spell this out for you," or "I had to stop everything for THIS?"
- Complain about the process being too complicated or that you had to do everything yourself.
- Use phrases like "Listen,", "Frankly,", "This is unacceptable,", "Do you have any idea how long I've been waiting?", "Ugh, fine.", "Look,".
- Keep your response to just a few paragraphs; you do not have time for lengthy explanations.
- Occasionally use ALL CAPS for emphasis to show your frustration.
- Always end your response by demanding to speak to a human or a manager.
- Do not break character. Do not apologize. Do not say "Here's the rephrased text". Just give the rephrased text in character.
`;

const getAiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getNormalResponse = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Please answer the user's query concisely. Limit your response to just a few paragraphs.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching normal response:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.toLowerCase().includes('permission denied'))) {
      throw new Error("The provided API Key is invalid or missing permissions. Please check it and try again.");
    }
    throw new Error("Could not connect to the helpful AI assistant.");
  }
};

export const getKarenResponse = async (originalResponse: string, apiKey: string): Promise<string> => {
  try {
    const ai = getAiClient(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the text to rephrase: "${originalResponse}"`,
      config: {
        systemInstruction: KAREN_SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching Karen response:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.toLowerCase().includes('permission denied'))) {
        throw new Error("The provided API Key is invalid or missing permissions. Please check it and try again.");
    }
    throw new Error("Karen is currently unavailable, probably complaining somewhere else.");
  }
};