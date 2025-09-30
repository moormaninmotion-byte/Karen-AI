import React from 'react';

/**
 * Props for the ExampleQueries component.
 */
interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

// A list of engaging and humorous example queries to display.
const EXAMPLE_QUERIES = [
  "Why is my latte cold?",
  "Explain quantum physics like I'll call your manager.",
  "How do I complain about the universe's return policy?",
  "Tell someone their parking is ATROCIOUS.",
];

/**
 * Displays a list of clickable example queries to help guide the user.
 * Clicking a query will populate the main input field.
 */
const ExampleQueries: React.FC<ExampleQueriesProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 text-center">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Or, try one of these...</h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {EXAMPLE_QUERIES.map((query, index) => (
          <button
            key={index}
            onClick={() => onSelect(query)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300 hover:bg-gray-700 hover:border-purple-500 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleQueries;
