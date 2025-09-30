const VISITS_KEY = 'karenifier-page-visits';
const RUNS_KEY = 'karenifier-app-runs';

/**
 * Safely retrieves a numeric value from localStorage.
 * @param key The localStorage key.
 * @returns The stored number, or 0 if not found or invalid.
 */
const getCount = (key: string): number => {
  try {
    const value = localStorage.getItem(key);
    // Ensure value is a valid number, otherwise return 0
    return value && !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return 0;
  }
};

/**
 * Safely stores a numeric value in localStorage.
 * @param key The localStorage key.
 * @param count The number to store.
 */
const setCount = (key: string, count: number): void => {
  try {
    localStorage.setItem(key, count.toString());
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

/**
 * Increments the page visit count in localStorage.
 * This should be called once when the application loads.
 */
export const incrementPageVisit = (): void => {
  const currentVisits = getCount(VISITS_KEY);
  setCount(VISITS_KEY, currentVisits + 1);
};

/**
 * Increments the app run (query submission) count in localStorage.
 * This should be called every time a user successfully submits a query.
 */
export const incrementAppRun = (): void => {
  const currentRuns = getCount(RUNS_KEY);
  setCount(RUNS_KEY, currentRuns + 1);
};

/**
 * Retrieves the current usage stats from localStorage.
 * @returns An object with the total visits and runs.
 */
export const getUsageStats = (): { visits: number; runs: number } => {
  return {
    visits: getCount(VISITS_KEY),
    runs: getCount(RUNS_KEY),
  };
};
