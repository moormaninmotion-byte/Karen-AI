import React from 'react';
import { SendIcon } from './Icons';

/**
 * Props for the QueryInput component.
 */
interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

// Define the maximum number of characters allowed in the input.
const MAX_CHARS = 500;

/**
 * A controlled textarea component for user input.
 * It includes a submit button, character counter, and disables input during loading.
 */
const QueryInput: React.FC<QueryInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  
  /**
   * Handles form submission, preventing default behavior and calling the onSubmit prop.
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit();
    }
  };

  const charCount = value.length;

  // Determine the color of the character counter based on how close it is to the limit.
  const counterColor =
    charCount >= MAX_CHARS
      ? 'text-red-500' // Limit reached
      : charCount > MAX_CHARS * 0.9
      ? 'text-yellow-500' // Nearing limit
      : 'text-gray-500'; // Default

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-4 pr-20 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none shadow-lg"
          rows={2}
          disabled={isLoading}
          maxLength={MAX_CHARS}
          onKeyDown={(e) => {
            // Allow submitting with Enter, but not with Shift+Enter for new lines.
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors"
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
