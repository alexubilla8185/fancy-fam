import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

type NavItem = 'Create' | 'View' | 'Share';

const getViewFromHash = (): NavItem => {
  const hash = window.location.hash.toLowerCase();
  if (hash.startsWith('#/view')) return 'View';
  if (hash.startsWith('#/share')) return 'Share';
  return 'Create';
};

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navItems: NavItem[] = ['Create', 'View', 'Share'];
  const [activeView, setActiveView] = useState<NavItem>(getViewFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setActiveView(getViewFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-header text-text-header border-b border-border-color">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
        <div className="logo-container text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gradient">
            FancyFam
          </h1>
          <p className="text-xs text-text-header/70">Digital Cards</p>
        </div>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <ul className={`flex items-center space-x-1 p-1 rounded-full ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-100'}`}>
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#/${item.toLowerCase()}`}
                  className={`nav-link px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    activeView === item
                      ? 'bg-white text-gray-900 shadow'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-black/20'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Toggle theme"
          >
            <span className="relative h-5 w-5 block">
              <Sun className={`absolute inset-0 transform transition-all duration-500 ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
              <Moon className={`absolute inset-0 transform transition-all duration-500 ${theme === 'light' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;