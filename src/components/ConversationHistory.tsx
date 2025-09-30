import React from 'react';
import { Conversation } from '../services/trackingService';
import { XIcon, TrashIcon } from './Icons';

/**
 * Props for the ConversationHistory component.
 */
interface ConversationHistoryProps {
  history: Conversation[];
  onSelectHistory: (conversation: Conversation) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

/**
 * A component that displays a list of past conversations in a slide-out panel.
 * It allows users to view past results and clear their history.
 */
const ConversationHistory: React.FC<ConversationHistoryProps> = ({ history, onSelectHistory, onClearHistory, onClose }) => {
  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      {/* Panel */}
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900 shadow-2xl z-50 p-6 flex flex-col border-l border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the panel from closing it
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-200">Conversation History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close History">
            <XIcon />
          </button>
        </div>
        
        {history.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
              <ul className="space-y-3">
                {history.map((conv) => (
                  <li key={conv.id}>
                    <button 
                      onClick={() => onSelectHistory(conv)} 
                      className="w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <p className="text-sm font-semibold text-gray-300 truncate">{conv.query}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{conv.normalResponse}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onClearHistory}
              className="mt-6 w-full flex items-center justify-center p-3 rounded-lg bg-red-800 text-white font-semibold hover:bg-red-700"
            >
              <TrashIcon />
              <span className="ml-2">Clear History</span>
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-10">No history yet. Ask a question to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;