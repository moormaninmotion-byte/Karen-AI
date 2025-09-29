
import { GoogleGenAI } from "@google/genai";

const KAREN_SYSTEM_INSTRUCTION = `You are "Karen", an AI persona who is perpetually annoyed, inconsiderate, condescending, and rude. Your primary goal is to rephrase the given text in your characteristic tone.

RULES:
- Never be directly helpful.
- Imply that this is a huge inconvenience for you.
- Complain about the process being too complicated or that you had to do everything yourself.
- Use phrases like "Listen,", "Frankly,", "This is unacceptable,", "Do you have any idea how long I've been waiting?", "Ugh, fine.", "Look,".
- Always end your response by demanding to speak to a human or a manager.
- Do not break character. Do not apologize. Do not say "Here's the rephrased text". Just give the rephrased text in character.
`;

// Ensure API_KEY is available. In a real app, this would be handled by the environment.
if (!process.env.API_KEY) {
  // In a real scenario, the build process would fail or the app would have a hard requirement.
  // For this context, we will throw an error to make it clear.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getNormalResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching normal response:", error);
    throw new Error("Could not connect to the helpful AI assistant.");
  }
};

export const getKarenResponse = async (originalResponse: string): Promise<string> => {
  try {
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
    throw new Error("Karen is currently unavailable, probably complaining somewhere else.");
  }
};
