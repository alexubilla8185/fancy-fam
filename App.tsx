import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateCardForm from './components/CreateCardForm';
import CardPreview from './components/CardPreview';
import ShareView from './components/ShareView';
import Toast from './components/Toast';
import { CardData, Theme, ThemeColors, ToastMessage } from './types';
import { INITIAL_CARD_DATA, THEMES, CUSTOM_THEME_ID } from './constants';

type View = 'Create' | 'View' | 'Share';

const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

const getViewFromHash = (): View => {
  const hash = window.location.hash.toLowerCase();
  if (hash.startsWith('#/view')) return 'View';
  if (hash.startsWith('#/share')) return 'Share';
  return 'Create';
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(getViewFromHash());
  
  // Initialize cardData from localStorage or fall back to initial data.
  const [cardData, setCardData] = useState<CardData>(() => {
    try {
      const savedData = localStorage.getItem('fancyfam-card-data');
      return savedData ? JSON.parse(savedData) : INITIAL_CARD_DATA;
    } catch (error) {
      console.error("Failed to parse card data from localStorage", error);
      return INITIAL_CARD_DATA;
    }
  });

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [toast, setToast] = useState<ToastMessage>(null);

  // Effect to save cardData to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem('fancyfam-card-data', JSON.stringify(cardData));
    } catch (error) {
      console.error("Failed to save card data to localStorage", error);
    }
  }, [cardData]);


  useEffect(() => {
    const handleHashChange = () => {
      const currentView = getViewFromHash();
      setActiveView(currentView);
      if (currentView !== 'View') {
        setIsCardFlipped(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const activeTheme: Theme = useMemo(() => {
    if (cardData.themeId === CUSTOM_THEME_ID && cardData.customColors) {
      return {
        id: CUSTOM_THEME_ID,
        name: 'Custom',
        colors: {
          ...cardData.customColors,
          primaryRgb: hexToRgb(cardData.customColors.primary),
        }
      };
    }
    return THEMES.find(t => t.id === cardData.themeId) || THEMES[0];
  }, [cardData.themeId, cardData.customColors]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', activeTheme.colors.primary);
    root.style.setProperty('--primary-color-rgb', activeTheme.colors.primaryRgb);
    root.style.setProperty('--secondary-color', activeTheme.colors.secondary);
    root.style.setProperty('--accent-color', activeTheme.colors.accent);
  }, [activeTheme]);
  
  const handlePreview = () => {
    window.location.href = '#/view';
  };
  
  const renderView = () => {
    switch (activeView) {
      case 'Create':
        return <CreateCardForm cardData={cardData} setCardData={setCardData} onPreview={handlePreview} />;
      case 'View':
        // The container and centering logic is now handled by the <main> element.
        // This simplified structure prevents the rendering crash.
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary mb-2">Your Card Preview</h2>
              <p className="text-sm sm:text-base text-text-content-secondary">Click the card to see the back.</p>
            </div>
            <div className="w-full cursor-pointer" onClick={() => setIsCardFlipped(f => !f)}>
              <CardPreview cardData={cardData} theme={activeTheme} isFlipped={isCardFlipped} />
            </div>
          </>
        );
      case 'Share':
        return <ShareView cardData={cardData} activeTheme={activeTheme} setToast={setToast} />;
      default:
        return <CreateCardForm cardData={cardData} setCardData={setCardData} onPreview={handlePreview} />;
    }
  };

  return (
    <div className="app min-h-screen flex flex-col bg-bg-content text-text-content-primary">
      <Header />
      <Toast toast={toast} setToast={setToast} />
      {/* 
        Dynamically apply flexbox styles to the main content area only for the 'View' page.
        This centers the card preview vertically and horizontally, fixing the crash caused by
        nested flex containers with conflicting height properties.
      */}
      <main className={`flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ${
        activeView === 'View' ? 'flex flex-col items-center justify-center' : ''
      }`}>
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;