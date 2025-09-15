import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-bg-header border-b border-border-color">
      <div className="container mx-auto flex flex-row justify-between items-center p-4">
        <div className="logo-container text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient">
            FancyFam
          </h1>
          <p className="text-xs text-text-header/70">Modern Digital Cards</p>
        </div>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full transition-colors text-text-content-secondary hover:text-text-content-primary hover:bg-control-hover-bg"
          aria-label="Toggle theme"
        >
          <span className="relative h-5 w-5 block">
            <Sun className={`absolute inset-0 transform transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
            <Moon className={`absolute inset-0 transform transition-all duration-500 ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
