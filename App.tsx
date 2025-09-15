import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateCardForm from './components/CreateCardForm';
import ShareView from './components/ShareView';
import Toast from './components/Toast';
import { CardData, Theme, ToastMessage } from './types';
import { INITIAL_CARD_DATA, THEMES, CUSTOM_THEME_ID } from './constants';

const hexToRgb = (hex: string): string => {
  if (!hex) return '0,0,0';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

const getTheme = (data: CardData): Theme => {
  if (data.themeId === CUSTOM_THEME_ID && data.customColors) {
    return {
      id: CUSTOM_THEME_ID,
      name: 'Custom',
      colors: {
        ...data.customColors,
        primaryRgb: hexToRgb(data.customColors.primary),
      },
    };
  }
  return THEMES.find(t => t.id === data.themeId) || THEMES[0];
};


const App: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>(INITIAL_CARD_DATA);
  const [toast, setToast] = useState<ToastMessage>(null);
  const [mode, setMode] = useState<'create' | 'share'>('create');
  const [sharedCardData, setSharedCardData] = useState<CardData | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        try {
          // Unicode-safe base64 decoding
          const decodedData = decodeURIComponent(atob(hash));
          const parsedData = JSON.parse(decodedData) as CardData;
          setSharedCardData(parsedData);
          setMode('share');
        } catch (error) {
          console.error("Failed to parse card data from URL hash", error);
          setMode('create');
        }
      } else {
        setMode('create');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const activeTheme = useMemo(() => getTheme(mode === 'share' && sharedCardData ? sharedCardData : cardData), [cardData, sharedCardData, mode]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans">
      <Header />
      {mode === 'share' && sharedCardData ? (
        <ShareView cardData={sharedCardData} theme={activeTheme} />
      ) : (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center mb-10 fade-in-item">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gradient">Create Your Digital Card</h2>
            <p className="mt-2 text-md sm:text-lg text-text-content-secondary max-w-2xl mx-auto">
              Design a modern, shareable card with your info, social links, and fun facts in minutes.
            </p>
          </div>
          <CreateCardForm cardData={cardData} setCardData={setCardData} theme={activeTheme} setToast={setToast} />
        </main>
      )}
      <Footer />
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};

export default App;