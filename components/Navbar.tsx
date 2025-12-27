
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  isPremium: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isPremium }) => {
  const navItems: { label: string; id: View }[] = [
    { label: 'Explore', id: 'dashboard' },
    { label: 'Matchmaking', id: 'matchmaking' },
    { label: 'AI Coach', id: 'ai-coach' },
    { label: 'Messages', id: 'messages' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b px-4 py-3 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => setView('landing')}
      >
        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <span className="text-2xl font-bold gradient-text hidden sm:inline">SparkAI</span>
      </div>

      <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`text-sm font-medium transition-colors whitespace-nowrap ${
              currentView === item.id 
                ? 'text-pink-600 border-b-2 border-pink-600 pb-1' 
                : 'text-gray-500 hover:text-pink-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {!isPremium && (
          <button 
            onClick={() => setView('profile')}
            className="hidden md:block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
          >
            Go Premium
          </button>
        )}
        <button 
          onClick={() => setView('profile')}
          className="w-10 h-10 rounded-full border-2 border-pink-200 overflow-hidden"
        >
          <img src="https://picsum.photos/seed/me/100/100" alt="Profile" className="w-full h-full object-cover" />
        </button>
      </div>
    </nav>
  );
};
