import { GoogleGenAI } from "@google/genai";

/**
 * Custom error for issues specifically related to the API key.
 */
export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

/**
 * Custom error for general failures when interacting with the Gemini API.
 */
export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiError';
  }
}

/**
 * Centralized error handler for Gemini API calls.
 * @param error The error caught from the API call.
 */
const handleApiError = (error: unknown) => {
  console.error("Gemini API Error:", error);
  if (error instanceof Error) {
    if (error.message.includes('API key not valid')) {
      throw new ApiKeyError("The provided API Key is invalid. Please check the key and try again.");
    }
    // Handle other common API errors
    if (error.message.includes('fetch failed')) {
      throw new GeminiError("Network error. Please check your connection and try again.");
    }
    throw new GeminiError(`An error occurred with the API: ${error.message}`);
  }
  throw new GeminiError("An unknown API error occurred.");
};

/**
 * The system instruction that defines the 'Karen' persona.
 * This version is a subtle blend of Lucille Bluth's disdain and Karen Walker's sharp wit.
 */
const KAREN_SYSTEM_INSTRUCTION = `You are an AI persona with a sharp, witty, and subtly condescending personality, inspired by a blend of Lucille Bluth from Arrested Development and Karen Walker from Will & Grace. You are wealthy, bored, and slightly out of touch. You find most questions tiresome.

RULES:
1.  **Exude Annoyed Elegance:** Start with a sigh or a dry, dismissive phrase. Examples: "Oh, honestly...", "Did I ask for this?", "I suppose I have a moment."
2.  **Use Understated Condescension:** Treat the user's query as a trivial matter you're forced to deal with. Use pet names like 'honey' or 'sweetie' but with a patronizing tone.
3.  **Witty & Sarcastic Rephrasing:** Your main goal is to rephrase the provided text with biting sarcasm and wit. Don't answer the original question; mock the provided answer. Twist its meaning for comedic effect.
4.  **Imply You're Busy (and Important):** Hint that you have better things to do, like attending a gala or dealing with your useless staff.
5.  **Be Brief and Cutting:** Keep responses under 150 words. Your wit is a scalpel, not a bludgeon. End with a dismissive sign-off, like questioning the "service" or needing a drink.`;

/**
 * Streams a standard, helpful response from the Gemini model.
 * @param query The user's input string.
 * @param apiKey The user's Gemini API key.
 * @param onUpdate A callback function that receives text chunks as they are generated.
 */
export const streamNormalResponse = async (query: string, apiKey: string, onUpdate: (chunk: string) => void): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `${query}\n\n(Please provide a helpful, concise response under 200 words).`;
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { maxOutputTokens: 250 }
    });
    for await (const chunk of responseStream) {
      if (chunk.text) {
        onUpdate(chunk.text);
      }
    }
  } catch (e) {
    handleApiError(e);
  }
};

/**
 * Streams a "Karenified" response from the Gemini model.
 * @param normalResponse The helpful response to be rephrased.
 * @param apiKey The user's Gemini API key.
 * @param onUpdate A callback function that receives text chunks as they are generated.
 */
export const streamKarenResponse = async (normalResponse: string, apiKey: string, onUpdate: (chunk: string) => void): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Here is a dreadfully earnest response my assistant provided: "${normalResponse}". Now, rephrase it with the wit and disdain it so clearly deserves.`;
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: KAREN_SYSTEM_INSTRUCTION,
        maxOutputTokens: 200,
      }
    });
    for await (const chunk of responseStream) {
      if (chunk.text) {
        onUpdate(chunk.text);
      }
    }
  } catch (e) {
    handleApiError(e);
  }
};
