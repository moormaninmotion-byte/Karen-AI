
import React, { useState, useCallback } from 'react';
import { getNormalResponse, getKarenResponse } from './services/geminiService';
import QueryInput from './components/QueryInput';
import ResponseDisplay from './components/ResponseDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import { RobotIcon, KarenIcon } from './components/Icons';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [normalResponse, setNormalResponse] = useState<string>('');
  const [karenResponse, setKarenResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleQuerySubmit = useCallback(async (submittedQuery: string) => {
    if (!submittedQuery.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setNormalResponse('');
    setKarenResponse('');
    setQuery(submittedQuery);

    try {
      const normalRes = await getNormalResponse(submittedQuery);
      setNormalResponse(normalRes);

      const karenRes = await getKarenResponse(normalRes);
      setKarenResponse(karenRes);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get a response. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        
        <main className="mt-8">
          <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center mt-12 text-gray-400">
              <LoadingSpinner />
              <p className="mt-4 text-lg">Thinking... then complaining...</p>
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
            <div className="text-center mt-16 text-gray-500">
              <p className="text-xl">Waiting for your question...</p>
              <p className="mt-2">Enter a query above to see the AI magic (and madness).</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
