import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateCardForm from './components/CreateCardForm';
import ShareView from './components/ShareView';
import Toast from './components/Toast';
import { CardData, Theme, ToastMessage } from './types';
import { INITIAL_CARD_DATA, THEMES, CUSTOM_THEME_ID } from './constants';

const hexToRgb = (hex: string): string => {
    if (!hex) return '0, 0, 0';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

// Centralized function to sanitize and default card data
const sanitizeCardData = (parsedData: Partial<CardData> | null): CardData => {
    // Start with the base structure to ensure no top-level keys are missing
    const data: CardData = { ...INITIAL_CARD_DATA, ...parsedData };

    // Sanitize nested structures to prevent runtime errors
    data.socialLinks = (Array.isArray(data.socialLinks) ? data.socialLinks : []).filter(
        link => link && typeof link.id === 'string' && typeof link.type === 'string' && typeof link.url === 'string'
    );
    
    data.funFacts = (Array.isArray(data.funFacts) ? data.funFacts : []).filter(
        fact => fact && typeof fact.id === 'string' && typeof fact.question === 'string' && typeof fact.answer === 'string'
    );
    
    // If the theme is not custom, ensure customColors is removed to maintain a consistent state.
    if (data.themeId !== CUSTOM_THEME_ID) {
        delete data.customColors;
    } else {
        // If theme is custom, ensure the customColors object is valid.
        const defaultCustomColors = { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FDE047' };
        const savedCustomColors = data.customColors;
        
        if (savedCustomColors && typeof savedCustomColors === 'object') {
            data.customColors = {
                primary: typeof savedCustomColors.primary === 'string' ? savedCustomColors.primary : defaultCustomColors.primary,
                secondary: typeof savedCustomColors.secondary === 'string' ? savedCustomColors.secondary : defaultCustomColors.secondary,
                accent: typeof savedCustomColors.accent === 'string' ? savedCustomColors.accent : defaultCustomColors.accent,
            };
        } else {
            data.customColors = defaultCustomColors;
        }
    }
    
    return data;
};


// Load from localStorage using the sanitizer
const loadCardDataFromLocalStorage = (): CardData => {
  try {
    const savedDataString = localStorage.getItem('fancyfam-card-data');
    if (!savedDataString) {
      return INITIAL_CARD_DATA;
    }
    const parsedData = JSON.parse(savedDataString) as Partial<CardData>;
    return sanitizeCardData(parsedData);
  } catch (error) {
    console.error("Failed to parse card data from localStorage, using defaults.", error);
    localStorage.removeItem('fancyfam-card-data');
    return INITIAL_CARD_DATA;
  }
};

// Determine initial state from URL hash or localStorage
const getInitialState = (): { isShareView: boolean; data: CardData } => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        try {
            const decodedData = atob(hash);
            const parsedData = JSON.parse(decodedData) as Partial<CardData>;
            // Sanitize data from URL to prevent crashes from malformed links
            const sanitizedData = sanitizeCardData(parsedData);
            return { isShareView: true, data: sanitizedData };
        } catch (e) {
            console.error("Invalid data in URL hash. Loading editor.", e);
            history.replaceState(null, '', ' '); // Clear bad hash
        }
    }
    // Default to editor view with data from localStorage
    return { isShareView: false, data: loadCardDataFromLocalStorage() };
};

const App: React.FC = () => {
  // Initialize state once using the robust getInitialState function
  const [initialState] = useState(getInitialState);
  const [cardData, setCardData] = useState<CardData>(initialState.data);
  const [toast, setToast] = useState<ToastMessage>(null);

  const { isShareView } = initialState;

  useEffect(() => {
    // Only save to localStorage if in the editor view
    if (!isShareView) {
      try {
        localStorage.setItem('fancyfam-card-data', JSON.stringify(cardData));
      } catch (error) {
        console.error("Failed to save card data to localStorage", error);
      }
    }
  }, [cardData, isShareView]);

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
      {isShareView ? (
        <ShareView cardData={cardData} theme={activeTheme} />
      ) : (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <CreateCardForm 
              cardData={cardData} 
              setCardData={setCardData} 
              theme={activeTheme}
              setToast={setToast}
          />
        </main>
      )}
      <Footer />
    </div>
  );
};

export default App;
