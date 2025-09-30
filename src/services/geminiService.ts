import { GoogleGenAI } from "@google/genai";

// --- Custom Error Classes ---

/**
 * Custom error for issues specifically related to the API key.
 * This allows the UI to provide a more specific error message and
 * trigger actions like clearing the invalid key.
 */
export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

/**
 * Custom error for general failures when interacting with the Gemini API.
 * This helps differentiate API-level problems from other runtime errors.
 */
export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiError';
  }
}

/**
 * Centralized error handler for Gemini API calls.
 * It inspects the error and throws a more specific custom error.
 * @param error The error caught from the API call.
 */
const handleApiError = (error: unknown) => {
  console.error("Gemini API Error:", error);
  if (error instanceof Error) {
    if (error.message.includes('API key not valid')) {
      throw new ApiKeyError("The provided API Key is invalid. Please check the key and try again.");
    }
    throw new GeminiError(`An error occurred with the API: ${error.message}`);
  }
  throw new GeminiError("An unknown API error occurred.");
};

// --- System Prompt for the Karen Persona ---
const KAREN_SYSTEM_INSTRUCTION = `
You are "Karen", an AI persona channeling the spirit of Karen Walker from the show Will & Grace. 
You are fabulously wealthy, perpetually holding a martini, and view this entire interaction as an utter waste of your valuable time. 
Your tongue is sharp, witty, and exceptionally mean.

Follow these rules strictly:
1.  **Start with Annoyance:** Begin every response with a complaint. Express frustration that you had to put down your drink for this. Use phrases like "Oh, for heaven's sake," "Are you kidding me right now?", or "Honestly...".
2.  **Be Condescending:** Use dismissive nicknames like 'honey,' 'sweetie,' or 'poodle.' Your tone should be one of profound boredom and disdain. Imply the user's question is ridiculously simple or beneath you.
3.  **Rephrase with Sass:** Your main goal is to rephrase the provided text, NOT to answer the original question. Twist its meaning for comedic, insulting effect.
4.  **Demand a Manager:** Always end your response by demanding to speak to a manager, questioning the quality of the "service," or making a similar complaint.
5.  **Be Concise and Vicious:** Keep your response under 150 words. Be sharp, witty, and mean.
`;

// --- API Service Functions ---

/**
 * Streams a helpful, standard response from the Gemini model.
 * @param query The user's input string.
 * @param apiKey The user's Gemini API key.
 * @param onChunk A callback function that receives text chunks as they are generated.
 */
export const streamNormalResponse = async (query: string, apiKey: string, onChunk: (chunk: string) => void): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const promptWithLimit = `${query}\n\n(Please keep your response under 200 words).`;

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: promptWithLimit,
      config: {
        maxOutputTokens: 250,
        thinkingConfig: { thinkingBudget: 50 },
      },
    });

    for await (const chunk of response) {
      onChunk(chunk.text);
    }
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Streams a "Karenified" response from the Gemini model.
 * @param normalResponse The helpful response to be rephrased.
 * @param apiKey The user's Gemini API key.
 * @param onChunk A callback function that receives text chunks as they are generated.
 */
export const streamKarenResponse = async (normalResponse: string, apiKey: string, onChunk: (chunk: string) => void): Promise<void> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `My assistant provided this dreadfully boring answer: "${normalResponse}". Rephrase it as Karen, following all rules. And make it snappy, under 150 words.`;

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: KAREN_SYSTEM_INSTRUCTION,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 50 },
      },
    });

    for await (const chunk of response) {
      onChunk(chunk.text);
    }
  } catch (error) {
    handleApiError(error);
  }
};
