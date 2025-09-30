import React from 'react';
import Header from './Header';
import QueryInput from './QueryInput';
import ResponseDisplay from './ResponseDisplay';
import EngagingLoader from './EngagingLoader';
import UsageStats from './UsageStats';
import { RobotIcon, KarenIcon, KeyIcon, TrashIcon, SparklesIcon, LightbulbIcon, HistoryIcon } from './Icons';
import { Conversation } from '../services/trackingService';
import ConversationHistory from './ConversationHistory';


/**
 * Props for the MainAppView component. It receives all necessary state and handlers
 * from the parent App component to render the UI and handle user interactions.
 */
interface MainAppViewProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onQuerySubmit: () => void;
  isLoading: boolean;
  onClearApiKey: () => void;
  error: string;
  normalResponse: string;
  karenResponse: string;
  usageStats: { visits: number; runs: number };
  history: Conversation[];
  showHistory: boolean;
  onToggleHistory: () => void;
  onSelectHistory: (conversation: Conversation) => void;
  onClearHistory: () => void;
  currentQuery: string;
}

/**
 * Renders the main view of the application, including the query input,
 * response displays, loading indicators, and usage stats.
 */
const MainAppView: React.FC<MainAppViewProps> = ({
  inputValue,
  onInputChange,
  onQuerySubmit,
  isLoading,
  onClearApiKey,
  error,
  normalResponse,
  karenResponse,
  usageStats,
  history,
  showHistory,
  onToggleHistory,
  onSelectHistory,
  onClearHistory,
  currentQuery,
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col flex-grow">
        <Header />
        
        {/* API Key Status and History Button */}
        <div className="flex justify-center my-6 space-x-4">
          <div className="bg-gray-800 p-2 rounded-lg flex items-center text-sm border border-gray-700">
            <KeyIcon />
            <span className="ml-2 text-gray-300">API Key Set</span>
            <button
              onClick={onClearApiKey}
              className="ml-4 flex items-center text-red-400 hover:text-red-300"
              aria-label="Clear API Key"
            >
              <TrashIcon />
              <span className="ml-1">Clear</span>
            </button>
          </div>
          <button
            onClick={onToggleHistory}
            className="bg-gray-800 p-2 rounded-lg flex items-center text-sm border border-gray-700 text-gray-300 hover:bg-gray-700"
            aria-label="Toggle History"
          >
            <HistoryIcon />
            <span className="ml-2">History</span>
          </button>
        </div>
        
        <main className="flex-grow">
          {/* Query Input Form */}
          <QueryInput
            value={inputValue}
            onChange={onInputChange}
            onSubmit={onQuerySubmit}
            isLoading={isLoading}
          />

          <div className="w-full max-w-2xl mx-auto mt-6">
            {isLoading && <EngagingLoader />}
            
            {/* Display any errors that occur */}
            {error && (
              <div className="bg-red-900/50 border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
          </div>
          
          {/* Response Section: Renders only when not loading and there's a response */}
          {!isLoading && (normalResponse || karenResponse) && (
            <>
              {currentQuery && (
                <div className="mt-8 text-center">
                  <p className="text-gray-500">Showing results for:</p>
                  <h3 className="text-xl font-semibold text-gray-200 mt-1">"{currentQuery}"</h3>
                </div>
              )}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
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
            </>
          )}
          
          {/* Initial State / Welcome Section: Renders on first load before any query */}
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
        
        {/* Usage Statistics in the footer */}
        <UsageStats visits={usageStats.visits} runs={usageStats.runs} />
        
      </div>

      {/* History Panel UI */}
      {showHistory && (
        <ConversationHistory 
          history={history}
          onSelectHistory={onSelectHistory}
          onClearHistory={onClearHistory}
          onClose={onToggleHistory}
        />
      )}
    </div>
  );
};

export default MainAppView;
