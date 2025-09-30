import React, { useState, useEffect } from 'react';
import { RobotIcon, KarenIcon } from './Icons';

// Arrays of status messages to cycle through for each persona.
const HELPFUL_AI_MESSAGES = [
  'Consulting archives...',
  'Cross-referencing data...',
  'Synthesizing response...',
  'Polishing the answer...',
];

const KAREN_MESSAGES = [
  'Ugh, fine, I\'m thinking...',
  'Warming up my complaining voice...',
  "Finding the manager's number...",
  'Putting my martini down for THIS?...',
  'Is it cocktail hour yet?',
];

/**
 * A visually engaging loading indicator that shows the "thinking" process
 * for both the helpful AI and the Karen persona.
 */
const EngagingLoader: React.FC = () => {
  // State to track the current index for each message array.
  const [helpfulMessageIndex, setHelpfulMessageIndex] = useState(0);
  const [karenMessageIndex, setKarenMessageIndex] = useState(0);

  /**
   * Effect hook to set up intervals that cycle through the messages.
   * The intervals are cleared when the component unmounts.
   */
  useEffect(() => {
    const helpfulInterval = setInterval(() => {
      setHelpfulMessageIndex(prevIndex => (prevIndex + 1) % HELPFUL_AI_MESSAGES.length);
    }, 2500);

    const karenInterval = setInterval(() => {
      setKarenMessageIndex(prevIndex => (prevIndex + 1) % KAREN_MESSAGES.length);
    }, 2500);

    // Cleanup function to clear intervals on component unmount.
    return () => {
      clearInterval(helpfulInterval);
      clearInterval(karenInterval);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  return (
    <div className="mt-8 space-y-6">
      {/* Helpful AI Loader */}
      <div className="flex items-center justify-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="animate-pulse">
          <RobotIcon />
        </div>
        <div className="ml-4 text-left w-64">
          <p className="font-semibold text-gray-300">Helpful AI is thinking...</p>
          <p className="text-sm text-gray-400 transition-opacity duration-500">
            {HELPFUL_AI_MESSAGES[helpfulMessageIndex]}
          </p>
        </div>
      </div>

      {/* Karen Loader */}
      <div className="flex items-center justify-center p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <div className="animate-bounce">
          <KarenIcon />
        </div>
        <div className="ml-4 text-left w-64">
          <p className="font-semibold text-gray-300">Karen is preparing her complaint...</p>
          <p className="text-sm text-gray-400 transition-opacity duration-500">
            {KAREN_MESSAGES[karenMessageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EngagingLoader;
