// Define constants for localStorage keys to avoid magic strings.
const VISITS_KEY = 'karenifier-page-visits';
const RUNS_KEY = 'karenifier-app-runs';
const HISTORY_KEY = 'karenifier-conversation-history';

// FIX: Export Conversation interface for use in other components.
export interface Conversation {
  id: number;
  query: string;
  normalResponse: string;
  karenResponse: string;
}

/**
 * Safely retrieves a numeric value from localStorage.
 * Includes error handling for cases where localStorage is disabled or corrupted.
 * @param key The localStorage key to retrieve.
 * @returns The stored number, or 0 if the value is not found or is not a valid number.
 */
const getCount = (key: string): number => {
  try {
    const value = localStorage.getItem(key);
    // Ensure the retrieved value is a valid number before parsing.
    return value && !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return 0;
  }
};

/**
 * Safely stores a numeric value in localStorage.
 * Includes error handling for potential storage errors (e.g., quota exceeded).
 * @param key The localStorage key to write to.
 * @param count The numeric value to store.
 */
const setCount = (key: string, count: number): void => {
  try {
    localStorage.setItem(key, count.toString());
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

/**
 * Increments the page visit count in localStorage by one.
 * This should be called once when the application initializes.
 */
export const incrementPageVisit = (): void => {
  const currentVisits = getCount(VISITS_KEY);
  setCount(VISITS_KEY, currentVisits + 1);
};

/**
 * Increments the app run (query submission) count in localStorage by one.
 * This should be called every time a user successfully gets a response from the AI.
 */
export const incrementAppRun = (): void => {
  const currentRuns = getCount(RUNS_KEY);
  setCount(RUNS_KEY, currentRuns + 1);
};

/**
 * Retrieves the current usage statistics from localStorage.
 * @returns An object containing the total number of visits and runs.
 */
export const getUsageStats = (): { visits: number; runs: number } => {
  return {
    visits: getCount(VISITS_KEY),
    runs: getCount(RUNS_KEY),
  };
};

// --- History Functions ---

// FIX: Add getHistory function to retrieve conversation history.
/**
 * Retrieves the conversation history from localStorage.
 * @returns An array of Conversation objects, or an empty array if none is found or an error occurs.
 */
export const getHistory = (): Conversation[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error reading conversation history from localStorage:', error);
    return [];
  }
};

// FIX: Add saveConversation function to persist a new conversation.
/**
 * Saves a new conversation to the beginning of the history in localStorage.
 * @param conversation The new Conversation object to save.
 */
export const saveConversation = (conversation: Conversation): void => {
  try {
    const history = getHistory();
    // Add the new conversation to the front of the array
    const newHistory = [conversation, ...history];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving conversation to localStorage:', error);
  }
};

// FIX: Add clearHistory function to delete all saved conversations.
/**
 * Clears the entire conversation history from localStorage.
 */
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing conversation history from localStorage:', error);
  }
};
