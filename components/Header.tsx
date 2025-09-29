
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        The Karenifier
      </h1>
      <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
        An AI agent experiment. First, get a helpful answer. Then, get the same answer from someone who'd like to speak to the manager.
      </p>
    </header>
  );
};

export default Header;
