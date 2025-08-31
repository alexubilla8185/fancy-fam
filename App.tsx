import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateCardForm from './components/CreateCardForm';
import Toast from './components/Toast';
import { CardData, Theme, ToastMessage } from './types';
import { INITIAL_CARD_DATA, THEMES, CUSTOM_THEME_ID } from './constants';

const hexToRgb = (hex: string): string => {
    if (!hex) return '0, 0, 0';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

// Robustly load and sanitize card data from localStorage
const loadCardData = (): CardData => {
  try {
    const savedDataString = localStorage.getItem('fancyfam-card-data');
    if (!savedDataString) {
      return INITIAL_CARD_DATA;
    }
    
    const parsedData = JSON.parse(savedDataString) as Partial<CardData>;

    // Create a new object by merging saved data over defaults.
    // This ensures all top-level keys from INITIAL_CARD_DATA are present.
    const data: CardData = { ...INITIAL_CARD_DATA, ...parsedData };

    // Sanitize the potentially problematic nested structures.
    data.socialLinks = (Array.isArray(parsedData.socialLinks) ? parsedData.socialLinks : []).filter(
        link => link && typeof link.id === 'string' && typeof link.type === 'string' && typeof link.url === 'string'
    );
    
    data.funFacts = (Array.isArray(parsedData.funFacts) ? parsedData.funFacts : []).filter(
        fact => fact && typeof fact.id === 'string' && typeof fact.question === 'string' && typeof fact.answer === 'string'
    );
    
    // Deeply sanitize customColors object - THIS IS THE CRITICAL FIX.
    if (data.themeId === CUSTOM_THEME_ID) {
        const defaultCustomColors = { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FDE047' };
        const savedCustomColors = parsedData.customColors;

        if (savedCustomColors && typeof savedCustomColors === 'object') {
            data.customColors = {
                primary: typeof savedCustomColors.primary === 'string' ? savedCustomColors.primary : defaultCustomColors.primary,
                secondary: typeof savedCustomColors.secondary === 'string' ? savedCustomColors.secondary : defaultCustomColors.secondary,
                accent: typeof savedCustomColors.accent === 'string' ? savedCustomColors.accent : defaultCustomColors.accent,
            };
        } else {
            // If theme is custom but colors are missing/malformed, apply defaults.
            data.customColors = defaultCustomColors;
        }
    } else {
        // If theme is not custom, ensure customColors is not present.
        delete data.customColors;
    }
    
    return data;

  } catch (error) {
    console.error("Failed to parse card data from localStorage, using defaults.", error);
    // Clear corrupted data to prevent crash loops on subsequent visits.
    localStorage.removeItem('fancyfam-card-data');
    return INITIAL_CARD_DATA;
  }
};


const App: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>(loadCardData);
  const [toast, setToast] = useState<ToastMessage>(null);

  useEffect(() => {
    try {
      localStorage.setItem('fancyfam-card-data', JSON.stringify(cardData));
    } catch (error) {
      console.error("Failed to save card data to localStorage", error);
    }
  }, [cardData]);

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
  
  return (
    <div className="app min-h-screen flex flex-col bg-bg-content text-text-content-primary">
      <Header />
      <Toast toast={toast} setToast={setToast} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <CreateCardForm 
            cardData={cardData} 
            setCardData={setCardData} 
            theme={activeTheme}
            setToast={setToast}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;