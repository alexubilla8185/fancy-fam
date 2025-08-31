import React, { useState, useEffect } from 'react';
import { CardData, Theme, ToastMessage } from '../types';
import MyInfoSection from './form/MyInfoSection';
import SocialLinksSection from './form/SocialLinksSection';
import FunFactsSection from './form/FunFactsSection';
import ThemeSection from './form/ThemeSection';
import CardPreview from './CardPreview';
import ShareModal from './ShareModal';
import { Share2, ArrowUp } from 'lucide-react';

interface CreateCardFormProps {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  theme: Theme;
  setToast: (toast: ToastMessage) => void;
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({ cardData, setCardData, theme, setToast }) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Preview Section - Appears first on mobile, right on desktop */}
        <div className="lg:order-2 mb-12 lg:mb-0">
          <div className="lg:sticky lg:top-28">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gradient">Live Preview</h2>
                <p className="text-sm text-text-content-secondary">Click the card to flip it.</p>
              </div>
            <div 
              className="w-full max-w-[420px] mx-auto aspect-[5/3] cursor-pointer perspective-1000"
              onClick={() => setIsCardFlipped(f => !f)}
            >
              <CardPreview cardData={cardData} theme={theme} isFlipped={isCardFlipped} />
            </div>
            <div className="form-actions mt-8 text-center">
              <button 
                type="button" 
                onClick={() => setIsShareModalOpen(true)}
                className="bg-theme-primary hover:opacity-90 text-white font-bold py-3 px-12 rounded-full w-full md:w-auto text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto" 
                style={{boxShadow: `0 4px 20px -5px rgba(var(--primary-color-rgb), 0.5)`}}>
                Share Card <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Form Section - Appears second on mobile, left on desktop */}
        <div className="lg:order-1">
          <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
            <MyInfoSection cardData={cardData} setCardData={setCardData} />
            <SocialLinksSection cardData={cardData} setCardData={setCardData} />
            <FunFactsSection cardData={cardData} setCardData={setCardData} />
            <ThemeSection cardData={cardData} setCardData={setCardData} />
          </form>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cardData={cardData}
        activeTheme={theme}
        setToast={setToast}
      />

      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-30 fade-in-item" style={{ animationDuration: '0.3s' }}>
            <button
                onClick={scrollToTop}
                className="p-3 rounded-full bg-control-bg text-control-text shadow-lg hover:bg-control-hover-bg transition-all duration-300 transform hover:scale-110"
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-6 w-6" />
            </button>
        </div>
      )}
    </>
  );
};

export default CreateCardForm;