import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    console.log('handleSubmit method started');
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
    console.log('handleSubmit method ended');
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      {/* Gradient Header */}
      <header className="bg-gradient-to-r from-blue-800 to-gray-900 px-8 py-4 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center space-x-4">
          <Bot className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold text-white tracking-wide">Build AI</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-white transition">Features</a>
          <a href="#" className="text-gray-300 hover:text-white transition">Docs</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Bot className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            Build websites with AI, instantly.
          </h1>
          <p className="max-w-xl mx-auto text-lg text-gray-300 mb-10">
            Describe your dream website and let Build AI turn it into reality. Minimal, fast, and beautiful.
          </p>
          <form onSubmit={handleSubmit} className="bg-gray-900/80 rounded-2xl shadow-xl p-8 mb-8">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-32 p-4 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none transition focus:outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
            >
              Generate Website Plan
            </button>
          </form>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-sm text-gray-500 bg-transparent">
        <span className="font-semibold text-white">Build AI</span> &middot; {new Date().getFullYear()} &middot; All rights reserved.
      </footer>
    </div>
  );
};
