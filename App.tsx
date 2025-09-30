import React, { useState, useCallback, useEffect } from 'react';
import { getNormalResponse, getKarenResponse, ApiKeyError, GeminiError } from './services/geminiService';
import { incrementPageVisit, incrementAppRun, getUsageStats } from './services/trackingService';
import QueryInput from './components/QueryInput';
import ResponseDisplay from './components/ResponseDisplay';
import EngagingLoader from './components/EngagingLoader';
import Header from './components/Header';
import { RobotIcon, KarenIcon, KeyIcon, TrashIcon, SparklesIcon, LightbulbIcon } from './components/Icons';
import ApiKeyInput from './components/ApiKeyInput';
import ExampleQueries from './components/ExampleQueries';
import UsageStats from './components/UsageStats';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [normalResponse, setNormalResponse] = useState('');
  const [karenResponse, setKarenResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageStats, setUsageStats] = useState({ visits: 0, runs: 0 });

  // Load API key, track page visit, and load stats on initial render
  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    incrementPageVisit();
    setUsageStats(getUsageStats());
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

  // Handler for submitting a query
  const handleQuerySubmit = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!apiKey) {
      setError('API Key is not set. Please provide a valid Gemini API key.');
      return;
    }

    setIsLoading(true);
    setError('');
    setNormalResponse('');
    setKarenResponse('');
    setCurrentQuery(inputValue);

    try {
      const helpfulResponse = await getNormalResponse(inputValue, apiKey);
      setNormalResponse(helpfulResponse);

      const karenifiedResponse = await getKarenResponse(helpfulResponse, apiKey);
      setKarenResponse(karenifiedResponse);
      
      // On success, track the run and update stats
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

  // Handler for selecting an example query
  const handleSelectExample = (query: string) => {
    setInputValue(query);
  };

  // Render API key input screen if key is not set
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto text-center">
          <Header />
          <div className="flex justify-center my-8">
            <img 
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGJmaXh0a3B0YnVnZjNqMDljNHdoa3h3djIyMGw2MnFtbzNiZ2FscCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4pT9M7xTuvBzwtGg/giphy.gif" 
              alt="A woman demanding to speak to the manager" 
              className="rounded-lg shadow-xl w-full max-w-md"
            />
          </div>
        </div>
        <div className="w-full max-w-6xl mx-auto mt-auto">
          <ApiKeyInput onSetApiKey={handleSetApiKey} />
          {error && (
            <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render main application screen
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col flex-grow">
        <Header />
        <div className="flex justify-center my-6">
          <div className="bg-gray-800 p-2 rounded-lg flex items-center text-sm border border-gray-700">
            <KeyIcon />
            <span className="ml-2 text-gray-300">API Key Set</span>
            <button
              onClick={handleClearApiKey}
              className="ml-4 flex items-center text-red-400 hover:text-red-300"
              aria-label="Clear API Key"
            >
              <TrashIcon />
              <span className="ml-1">Clear</span>
            </button>
          </div>
        </div>
        
        <main className="flex-grow">
          <QueryInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleQuerySubmit}
            isLoading={isLoading}
          />

          <div className="w-full max-w-2xl mx-auto">
            {isLoading && <EngagingLoader />}
            {!isLoading && <ExampleQueries onSelect={handleSelectExample} />}
            {error && (
              <div className="mt-6 bg-red-900/50 border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
          </div>
          
          {/* --- Response Section --- */}
          {!isLoading && (normalResponse || karenResponse) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <ResponseDisplay
                title="Helpful Response"
                content={normalResponse}
                icon={<RobotIcon />}
              />
              <ResponseDisplay
                title="Karen's Response"
                content={karenResponse}
                icon={<KarenIcon />}
              />
            </div>
          )}
          
          {/* --- Initial State / Welcome Section --- */}
          {!isLoading && !normalResponse && !karenResponse && !error && (
            <>
              <div className="text-center mt-12 text-gray-500 flex flex-col items-center">
                <div className="animate-pulse">
                  <SparklesIcon />
                </div>
                <h3 className="text-2xl font-semibold mt-6 text-gray-300">Ready to Complain</h3>
                <p className="mt-2 max-w-sm mx-auto text-gray-400">
                  Ask a question to get a helpful, well-reasoned answer... and then see it get Karenified.
                </p>
              </div>

              <div className="mt-12 w-full max-w-2xl mx-auto">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <LightbulbIcon />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-200">Real-World Use Case</h4>
                  <p className="mt-2 text-gray-400">
                    Stuck in a debate? Need a strategic negotiation tool for when logic and reason do not cast you in a fair light? The Karenifier turns any reasonable point into a masterclass of indignant deflection.
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
        
        <UsageStats visits={usageStats.visits} runs={usageStats.runs} />
        
      </div>
    </div>
  );
};

export default App;
