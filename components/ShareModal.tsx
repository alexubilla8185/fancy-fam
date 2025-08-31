import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CardData, Theme, ToastMessage } from '../types';
import { downloadVCard } from '../utils/vcard';
import { Download, Copy, RefreshCw, X } from 'lucide-react';

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
  const [qrFgColor, setQrFgColor] = useState(activeTheme.colors.primary);
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // This effect controls the fade-in/out animation
    if (isOpen) {
      setShowModal(true);
      setPageUrl(window.location.href.split('#')[0]); // Get clean URL without hash
      setQrFgColor(activeTheme.colors.primary);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300); // Wait for fade-out animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTheme]);
  
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
  
  const handleResetQrColors = () => {
    setQrFgColor('#000000');
    setQrBgColor('#ffffff');
    setToast({ id: Date.now(), message: 'QR code colors reset.', type: 'success' });
  };

  const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg bg-bg-card hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-text-content-primary border border-border-color transition-colors">
        {children}
    </button>
  );

  const ColorSwatch: React.FC<{ color: string, name: string }> = ({ color, name }) => (
    <button
        onClick={() => setQrFgColor(color)}
        className="w-7 h-7 rounded-full border-2 border-white/20 shadow-md transition transform hover:scale-110"
        style={{ backgroundColor: color }}
        aria-label={`Set QR color to theme ${name}`}
        title={`Theme ${name}`}
    />
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
            
            <div className="p-6 rounded-xl bg-bg-card border border-border-color space-y-6">
                <div className="text-center">
                    <div className="p-3 rounded-lg inline-block shadow-inner" style={{backgroundColor: qrBgColor}}>
                        <QRCodeSVG 
                            value={pageUrl} 
                            size={160}
                            bgColor={qrBgColor}
                            fgColor={qrFgColor}
                            level="Q"
                            includeMargin={false}
                        />
                    </div>
                </div>

                <div className="space-y-4 border-t border-border-color pt-6">
                    <h3 className="text-base font-bold text-center text-text-content-primary">Customize QR Code</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-content-secondary">Code</label>
                            <input type="color" value={qrFgColor} onChange={(e) => setQrFgColor(e.target.value)} className="w-full h-10 p-1 bg-bg-card border border-border-color rounded-md cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-content-secondary">Background</label>
                            <input type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="w-full h-10 p-1 bg-bg-card border border-border-color rounded-md cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center bg-control-bg p-2 rounded-md">
                        <p className="text-sm font-medium text-control-text">Theme Colors:</p>
                        <div className="flex items-center gap-3">
                            <ColorSwatch color={activeTheme.colors.primary} name="primary" />
                            <ColorSwatch color={activeTheme.colors.secondary} name="secondary" />
                            <ColorSwatch color={activeTheme.colors.accent} name="accent" />
                        </div>
                    </div>
                    <button onClick={handleResetQrColors} className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-text-content-secondary hover:text-theme-primary transition-colors py-2 rounded-md border border-border-color hover:border-current">
                        <RefreshCw className="w-3 h-3" /> Reset for Scannability
                    </button>
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
