import React, { useState, useEffect } from 'react';
import { CardData, Theme, ToastMessage } from '../types';
import MyInfoSection from './form/MyInfoSection';
import SocialLinksSection from './form/SocialLinksSection';
import FunFactsSection from './form/FunFactsSection';
import ThemeSection from './form/ThemeSection';
import CardPreview from './CardPreview';
import { Share2, ArrowUp } from 'lucide-react';

interface CreateCardFormProps {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  theme: Theme;
  setToast: (toast: ToastMessage) => void;
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({ cardData, setCardData, theme, setToast }) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
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
  
  const handleShare = async () => {
    let pageUrl = '';
    try {
      const dataString = JSON.stringify(cardData);
      const uint8Array = new TextEncoder().encode(dataString);
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      const encodedData = btoa(binaryString);
      pageUrl = `${window.location.origin}${window.location.pathname}#${encodedData}`;
    } catch (error) {
      console.error("Failed to encode card data for sharing", error);
      setToast({ id: Date.now(), message: 'Error creating share link.', type: 'error' });
      return;
    }

    const shareData = {
      title: `${cardData.name}'s FancyFam Card`,
      text: `Check out ${cardData.name}'s modern digital card!`,
      url: pageUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          setToast({ id: Date.now(), message: 'Could not share the card.', type: 'error' });
        }
      }
    } else {
      navigator.clipboard.writeText(pageUrl).then(() => {
        setToast({ id: Date.now(), message: 'Link copied to clipboard!', type: 'success' });
      }, () => {
        setToast({ id: Date.now(), message: 'Failed to copy link.', type: 'error' });
      });
    }
  };

  return (
    <>
      <form className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 xl:gap-16" onSubmit={(e) => e.preventDefault()}>
        {/* Preview Section - Appears first on mobile, right on desktop */}
        <div className="lg:order-2 mb-12 lg:mb-0 lg:col-span-7">
          <div className="lg:sticky lg:top-28">
            <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gradient">Live Preview</h2>
                <p className="text-sm text-text-content-secondary">Click the card to flip it.</p>
              </div>
            <div 
              className="w-full max-w-[480px] mx-auto aspect-[5/3] cursor-pointer perspective-1000"
              onClick={(e) => {
                // Prevent card flip when clicking on a link
                if ((e.target as HTMLElement).closest('a')) {
                  return;
                }
                setIsCardFlipped(f => !f);
              }}
            >
              <CardPreview cardData={cardData} theme={theme} isFlipped={isCardFlipped} />
            </div>

            <div className="mt-8">
                <ThemeSection cardData={cardData} setCardData={setCardData} />
            </div>

            <div className="form-actions mt-8 text-center">
              <button
                type="button"
                onClick={handleShare}
                className="bg-gradient-theme hover:opacity-90 transition-opacity duration-300 text-white font-bold py-3 px-12 rounded-full w-full md:w-auto text-lg flex items-center justify-center gap-2 mx-auto shadow-lg shadow-[rgba(139,92,246,0.3)] hover:shadow-xl"
              >
                Share Card <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Form Section - Appears second on mobile, left on desktop */}
        <div className="lg:order-1 lg:col-span-5">
          <div className="space-y-8 lg:space-y-12">
            <MyInfoSection cardData={cardData} setCardData={setCardData} />
            <SocialLinksSection cardData={cardData} setCardData={setCardData} />
            <FunFactsSection cardData={cardData} setCardData={setCardData} />
          </div>
        </div>
      </form>

      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-30 fade-in-item" style={{ animationDuration: '0.3s' }}>
            <button
                onClick={scrollToTop}
                className="p-3 rounded-full bg-theme-primary text-white shadow-lg transition-all duration-300 transform hover:scale-110 hover:opacity-90"
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
