import React, { useState, useEffect } from 'react';
import { SendIcon } from './Icons';

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const MAX_CHARS = 500;
const DYNAMIC_PROMPTS = [
  "Explain why my martini isn't healing my existential dread.",
  "What is the return policy on this decade?",
  "How do I file a complaint with the universe's management?",
  "Summarize quantum physics in a way that won't interrupt my nap.",
  "Tell someone their parking is an affront to good taste.",
];

/**
 * A controlled textarea component for user input that features a dynamic,
 * animated placeholder cycling through example prompts.
 */
const QueryInput: React.FC<QueryInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  const [promptIndex, setPromptIndex] = useState(0);

  // Effect to cycle through the dynamic prompts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex(prevIndex => (prevIndex + 1) % DYNAMIC_PROMPTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const charCount = value.length;
  const counterColor = charCount >= MAX_CHARS ? 'text-red-500' : charCount > MAX_CHARS * 0.9 ? 'text-yellow-500' : 'text-gray-500';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Animated Placeholder: Only visible when input is empty and not loading */}
        {!value && !isLoading && (
          <div
            className="absolute top-0 left-0 h-full w-full p-4 pr-20 pointer-events-none flex items-center overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="w-full text-left transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${promptIndex * 100}%)` }}
            >
              {DYNAMIC_PROMPTS.map((prompt, index) => (
                <div
                  key={index}
                  className="text-gray-500 h-full flex items-center"
                  style={{ height: '3rem' /* Approximate height of a row */ }}
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          // The placeholder is a space to ensure consistent height and alignment
          placeholder=" "
          className="relative z-10 w-full p-4 pr-20 bg-gray-800/50 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none shadow-lg caret-purple-400 font-sans text-gray-100"
          rows={2}
          disabled={isLoading}
          maxLength={MAX_CHARS}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors z-20"
          aria-label="Submit"
        >
          <SendIcon />
        </button>
      </div>
      <p className={`text-right text-xs mt-1 pr-2 ${counterColor}`}>
        {charCount}/{MAX_CHARS}
      </p>
    </form>
  );
};

export default QueryInput;
