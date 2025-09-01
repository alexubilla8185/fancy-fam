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
      const encodedData = btoa(dataString);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Preview Section - Appears first on mobile, right on desktop */}
        <div className="lg:order-2 mb-12 lg:mb-0">
          <div className="lg:sticky lg:top-28">
            <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gradient">Live Preview</h2>
                <p className="text-sm text-text-content-secondary">Click the card to flip it.</p>
              </div>
            <div 
              className="w-full max-w-[420px] mx-auto aspect-[5/3] cursor-pointer perspective-1000"
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
            <div className="form-actions mt-8 text-center">
              <button
                type="button"
                onClick={handleShare}
                className="bg-[linear-gradient(to_right,#EC4899,#8B5CF6)] hover:brightness-110 transition-all duration-300 text-white font-bold py-3 px-12 rounded-full w-full md:w-auto text-lg flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl dark:shadow-[0_8px_25px_rgba(236,72,153,0.4)]"
              >
                Share Card <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Form Section - Appears second on mobile, left on desktop */}
        <div className="lg:order-1">
          <form className="space-y-8 lg:space-y-12" onSubmit={(e) => e.preventDefault()}>
            <MyInfoSection cardData={cardData} setCardData={setCardData} />
            <SocialLinksSection cardData={cardData} setCardData={setCardData} />
            <FunFactsSection cardData={cardData} setCardData={setCardData} />
            <ThemeSection cardData={cardData} setCardData={setCardData} />
          </form>
        </div>
      </div>

      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-30 fade-in-item" style={{ animationDuration: '0.3s' }}>
            <button
                onClick={scrollToTop}
                className="p-3 rounded-full bg-[linear-gradient(45deg,#EC4899,#8B5CF6)] text-white shadow-lg transition-all duration-300 transform hover:scale-110 hover:brightness-110"
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