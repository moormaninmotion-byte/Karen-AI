import React, { useState, useCallback, useEffect } from 'react';
import { getNormalResponse, getKarenResponse } from './services/geminiService';
import QueryInput from './components/QueryInput';
import ResponseDisplay from './components/ResponseDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import { RobotIcon, KarenIcon, KeyIcon, TrashIcon, SparklesIcon } from './components/Icons';
import ApiKeyInput from './components/ApiKeyInput';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [normalResponse, setNormalResponse] = useState<string>('');
  const [karenResponse, setKarenResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setError(''); // Clear any previous auth errors
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey(null);
    setNormalResponse('');
    setKarenResponse('');
    setError('');
  };

  const handleQuerySubmit = useCallback(async (submittedQuery: string) => {
    if (!submittedQuery.trim() || isLoading) return;
    
    if (!apiKey) {
      setError("API Key is not set. Please set your API key to continue.");
      return;
    }

    setIsLoading(true);
    setError('');
    setNormalResponse('');
    setKarenResponse('');
    setQuery(submittedQuery);

    try {
      const normalRes = await getNormalResponse(submittedQuery, apiKey);
      setNormalResponse(normalRes);

      const karenRes = await getKarenResponse(normalRes, apiKey);
      setKarenResponse(karenRes);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get a response. ${errorMessage}`);
      // If the error is about the API key, clear it to force re-entry.
      if (errorMessage.toLowerCase().includes('api key')) {
        handleClearApiKey();
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, apiKey]);

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto text-center">
          <Header />
          <div className="flex justify-center my-8">
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnA4OTRoc3R0eXQzbXhvY3N0c2I4aHhyOWRjN3hpaDdlYmdsZWNpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKyOoGtsprVTA3K/giphy.gif" 
              alt="Karen from Will and Grace laughing with a martini"
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        
        <div className="flex justify-center my-6">
            <div className="bg-gray-800 p-2 rounded-lg flex items-center text-sm border border-gray-700">
                <KeyIcon />
                <span className="ml-2 text-gray-300">API Key is Set</span>
                <button 
                    onClick={handleClearApiKey}
                    className="ml-4 flex items-center text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Clear API Key"
                >
                    <TrashIcon />
                    <span className="ml-1">Clear</span>
                </button>
            </div>
        </div>
        
        <main>
          <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center mt-6 text-gray-400">
              <LoadingSpinner />
              <p className="ml-4 text-lg">Thinking... then complaining...</p>
            </div>
          )}

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
          
          {!isLoading && !normalResponse && !karenResponse && !error && (
            <div className="text-center mt-16 text-gray-500 flex flex-col items-center">
              <div className="animate-pulse">
                <SparklesIcon />
              </div>
              <h3 className="text-2xl font-semibold mt-6 text-gray-300">Ready When You Are!</h3>
              <p className="mt-2 max-w-sm mx-auto text-gray-400">
                Type your question above to get a helpful answer... and then Karen's unsolicited opinion.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;