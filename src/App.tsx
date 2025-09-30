import React, { useState, useCallback, useEffect } from 'react';
import { streamNormalResponse, streamKarenResponse, ApiKeyError, GeminiError } from './services/geminiService';
import { 
  incrementPageVisit, 
  incrementAppRun, 
  getUsageStats, 
  getHistory, 
  saveConversation, 
  clearHistory as clearHistoryService,
  Conversation 
} from './services/trackingService';
import ApiKeySetup from './components/ApiKeySetup';
import MainAppView from './components/MainAppView';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  // State management for the entire application
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [normalResponse, setNormalResponse] = useState('');
  const [karenResponse, setKarenResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageStats, setUsageStats] = useState({ visits: 0, runs: 0 });
  const [history, setHistory] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load initial data from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    incrementPageVisit();
    setUsageStats(getUsageStats());
    setHistory(getHistory());
  }, []);

  // Handler to save the API key
  const handleSetApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setError('');
  };

  // Handler to clear the API key
  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
    setNormalResponse('');
    setKarenResponse('');
    setError('');
  };

  // Main handler for submitting a query with response streaming
  const handleQuerySubmit = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!apiKey) {
      setError('API Key is not set. Please provide a valid Gemini API key.');
      return;
    }
    if (!navigator.onLine) {
      setError("Network connection is unavailable. You can still view your conversation history.");
      return;
    }

    setIsLoading(true);
    setError('');
    setNormalResponse('');
    setKarenResponse('');
    setCurrentQuery(inputValue);
    setShowHistory(false); // Close history panel on new query

    try {
      let fullNormalResponse = '';
      await streamNormalResponse(inputValue, apiKey, (chunk) => {
        fullNormalResponse += chunk;
        setNormalResponse(prev => prev + chunk);
      });

      let fullKarenResponse = '';
      await streamKarenResponse(fullNormalResponse, apiKey, (chunk) => {
        fullKarenResponse += chunk;
        setKarenResponse(prev => prev + chunk);
      });
      
      // Save full conversation to history after both streams complete
      const newConversation: Conversation = {
        id: Date.now(),
        query: inputValue,
        normalResponse: fullNormalResponse,
        karenResponse: fullKarenResponse,
      };
      saveConversation(newConversation);
      setHistory(prev => [newConversation, ...prev]);

      incrementAppRun();
      setUsageStats(getUsageStats());
      
    } catch (err) {
      if (err instanceof ApiKeyError) {
        setError(err.message);
        handleClearApiKey(); // Clear invalid key
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
  
  // History Panel Handlers
  const handleToggleHistory = () => setShowHistory(prev => !prev);
  const handleSelectHistory = (conversation: Conversation) => {
    setCurrentQuery(conversation.query);
    setNormalResponse(conversation.normalResponse);
    setKarenResponse(conversation.karenResponse);
    setError('');
    setShowHistory(false);
  };
  const handleClearHistory = () => {
    clearHistoryService();
    setHistory([]);
  };

  // Conditional rendering based on API key presence
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
      usageStats={usageStats}
      history={history}
      showHistory={showHistory}
      onToggleHistory={handleToggleHistory}
      onSelectHistory={handleSelectHistory}
      onClearHistory={handleClearHistory}
      currentQuery={currentQuery}
    />
  );
};

export default App;
