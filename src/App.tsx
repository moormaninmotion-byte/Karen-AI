import React, { useState, useCallback, useEffect } from 'react';

// --- Services ---
import { streamNormalResponse, streamKarenResponse, ApiKeyError, GeminiError } from './services/geminiService';
import { incrementPageVisit, incrementAppRun, getUsageStats, saveConversation, getHistory, clearHistory, Conversation } from './services/trackingService';

// --- View Components ---
import ApiKeySetup from './components/ApiKeySetup';
import MainAppView from './components/MainAppView';

// Constant for the local storage key to store the Gemini API key.
const API_KEY_STORAGE_KEY = 'gemini-api-key';

/**
 * The main application component. It manages the application's state,
 * handles user interactions, and orchestrates the rendering of view components.
 */
const App: React.FC = () => {
  // --- State Management ---
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(''); // The text currently in the textarea
  const [normalResponse, setNormalResponse] = useState('');
  const [karenResponse, setKarenResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageStats, setUsageStats] = useState({ visits: 0, runs: 0 });
  const [history, setHistory] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  /**
   * Effect hook that runs once on initial component mount.
   * It loads the API key from local storage and initializes usage tracking and history.
   */
  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    incrementPageVisit();
    setUsageStats(getUsageStats());
    setHistory(getHistory());
  }, []);

  /**
   * Saves the provided API key to local storage and application state.
   */
  const handleSetApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setError(''); // Clear any previous errors
  };

  /**
   * Clears the API key from local storage and application state.
   */
  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
    setNormalResponse('');
    setKarenResponse('');
    setError('');
  };

  /**
   * Handles the submission of a user query using streaming.
   */
  const handleQuerySubmit = useCallback(async () => {
    if (!inputValue.trim() || isLoading || !apiKey) {
      if (!apiKey) {
        setError('API Key is not set. Please provide a valid Gemini API key.');
      }
      return;
    }

    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your network connection. You can still view your past conversation history.");
      return;
    }

    setIsLoading(true);
    setError('');
    setNormalResponse('');
    setKarenResponse('');
    setCurrentQuery(inputValue);
    setShowHistory(false);

    try {
      let fullHelpfulResponse = '';
      await streamNormalResponse(inputValue, apiKey, (chunk) => {
        fullHelpfulResponse += chunk;
        setNormalResponse(prev => prev + chunk);
      });

      let fullKarenResponse = '';
      await streamKarenResponse(fullHelpfulResponse, apiKey, (chunk) => {
        fullKarenResponse += chunk;
        setKarenResponse(prev => prev + chunk);
      });

      const newConversation: Conversation = {
        id: Date.now(),
        query: inputValue,
        normalResponse: fullHelpfulResponse,
        karenResponse: fullKarenResponse,
      };
      saveConversation(newConversation);
      setHistory(prev => [newConversation, ...prev]);

      incrementAppRun();
      setUsageStats(getUsageStats());

    } catch (err) {
      if (err instanceof ApiKeyError) {
        setError(err.message);
        handleClearApiKey();
      } else if (err instanceof GeminiError) {
        setError(err.message);
      } else {
        setError(`An unexpected error occurred. ${err instanceof Error ? err.message : 'Please try again.'}`);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, apiKey, inputValue]);

  const handleSelectExample = (query: string) => {
    setInputValue(query);
  };

  const handleSelectHistory = (conversation: Conversation) => {
    setCurrentQuery(conversation.query);
    setNormalResponse(conversation.normalResponse);
    setKarenResponse(conversation.karenResponse);
    setShowHistory(false);
    setError('');
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowHistory(false);
  };
  
  if (!apiKey) {
    return <ApiKeySetup onSetApiKey={handleSetApiKey} error={error} />;
  }

  return (
    <MainAppView
      inputValue={inputValue}
      onInputChange={setInputValue}
      onQuerySubmit={handleQuerySubmit}
      isLoading={isLoading}
      onClearApiKey={handleClearApiKey}
      error={error}
      normalResponse={normalResponse}
      karenResponse={karenResponse}
      onSelectExample={handleSelectExample}
      usageStats={usageStats}
      history={history}
      showHistory={showHistory}
      onToggleHistory={() => setShowHistory(prev => !prev)}
      onSelectHistory={handleSelectHistory}
      onClearHistory={handleClearHistory}
      currentQuery={currentQuery}
    />
  );
};

export default App;
