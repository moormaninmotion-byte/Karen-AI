import React from 'react';

/**
 * The main header for the application.
 * Displays the title and a brief description.
 */
const Header: React.FC = () => (
  <header className="text-center">
    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
      The Karenifier
    </h1>
    <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
      An AI agent experiment. Get a helpful answer, then get Karen's take.
    </p>
  </header>
);

export default Header;
