import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CardData, Theme, ToastMessage } from '../types';
import { downloadVCard } from '../utils/vcard';
import { Download, Copy, X } from 'lucide-react';

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
    // This effect controls the fade-in/out animation
    if (isOpen) {
      setShowModal(true);
      setPageUrl(window.location.href.split('#')[0]); // Get clean URL without hash
    } else {
      const timer = setTimeout(() => setShowModal(false), 300); // Wait for fade-out animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
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

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setToast({ id: Date.now(), message: 'Link copied to clipboard!', type: 'success' });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }, () => {
      setToast({ id: Date.now(), message: 'Failed to copy link.', type: 'error' });
    });
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
                <h2 id="share-modal-title" className="text-2xl font-bold text-theme-primary">Share Your Card</h2>
                <p className="text-md text-text-content-secondary">Let others connect with you instantly.</p>
            </div>
            
            <div className="p-6 rounded-xl bg-bg-card border border-border-color">
                <div className="text-center">
                    <div className="p-3 rounded-lg inline-block shadow-inner" style={{backgroundColor: '#ffffff'}}>
                        <QRCodeSVG 
                            value={pageUrl} 
                            size={160}
                            bgColor={"#ffffff"}
                            fgColor={activeTheme.colors.primary}
                            level="Q"
                            includeMargin={false}
                        />
                    </div>
                </div>
            </div>
            
            <div className="actions-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <ActionButton onClick={handleDownloadVCard}>
                    <Download className="w-5 h-5" /> Download vCard
                </ActionButton>
                <ActionButton onClick={handleCopyUrl}>
                    <Copy className="w-5 h-5" />
                    {isCopied ? 'Copied!' : 'Copy Link'}
                </ActionButton>
            </div>
        </div>
    </div>
  );
};

export default ShareModal;