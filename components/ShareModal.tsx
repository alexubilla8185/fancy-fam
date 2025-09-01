import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CardData, Theme, ToastMessage } from '../types';
import { downloadVCard } from '../utils/vcard';
import { Download, X, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: CardData;
  activeTheme: Theme;
  setToast: (toast: ToastMessage) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, cardData, activeTheme, setToast }) => {
  const [pageUrl, setPageUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      try {
        const dataString = JSON.stringify(cardData);
        const encodedData = btoa(dataString);
        const url = `${window.location.origin}${window.location.pathname}#${encodedData}`;
        setPageUrl(url);
      } catch (error) {
        console.error("Failed to encode card data for sharing", error);
        setToast({ id: Date.now(), message: 'Error creating share link.', type: 'error' });
        setPageUrl(window.location.origin + window.location.pathname);
      }
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, cardData, setToast]);
  
  useEffect(() => {
    // Handle Escape key press
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!showModal) {
    return null;
  }

  const handleDownloadVCard = () => {
    downloadVCard(cardData);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${cardData.name}'s FancyFam Card`,
      text: `Check out ${cardData.name}'s modern digital card!`,
      url: pageUrl,
    };

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Silently ignore if the user cancels the share dialog
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          setToast({ id: Date.now(), message: 'Could not share the card.', type: 'error' });
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(pageUrl).then(() => {
        setToast({ id: Date.now(), message: 'Link copied to clipboard!', type: 'success' });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }, () => {
        setToast({ id: Date.now(), message: 'Failed to copy link.', type: 'error' });
      });
    }
  };
  
  const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg bg-bg-card hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-text-content-primary border border-border-color transition-colors">
        {children}
    </button>
  );

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
    >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div 
            className={`relative w-full max-w-md bg-bg-content rounded-2xl shadow-2xl border border-border-color p-6 m-4 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-text-content-secondary hover:bg-control-hover-bg transition-colors" aria-label="Close share modal">
                <X size={20} />
            </button>
            
            <div className="text-center mb-6">
                <h2 id="share-modal-title" className="text-xl sm:text-2xl font-bold text-theme-primary">Share Your Card</h2>
                <p className="text-md text-text-content-secondary">Let others connect with you instantly.</p>
            </div>
            
            <div className="p-4 sm:p-6 rounded-xl bg-bg-card border border-border-color">
                <div className="text-center">
                    <div className="p-2 sm:p-3 rounded-lg inline-block shadow-inner bg-white">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                            <QRCodeSVG 
                                value={pageUrl}
                                className="w-full h-full"
                                bgColor={"#ffffff"}
                                fgColor={activeTheme.colors.primary}
                                level="Q"
                                includeMargin={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="actions-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <ActionButton onClick={handleDownloadVCard}>
                    <Download className="w-5 h-5" /> Download vCard
                </ActionButton>
                <ActionButton onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                    {isCopied ? 'Copied!' : 'Share Link'}
                </ActionButton>
            </div>
        </div>
    </div>
  );
};

export default ShareModal;
