import React, { useState, useEffect } from 'react';
import { CardData, Theme } from '../types';
import { SocialIcon } from './icons/SocialIcons';
import { QRCodeSVG } from 'qrcode.react';
import { encodeCardData } from '../utils/compression';

// Debounce hook to prevent expensive operations from running on every render.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time useEffect is re-called.
    // This prevents debouncedValue from changing if value is changed within the delay period.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

interface CardPreviewProps {
  cardData: CardData;
  theme: Theme;
  isFlipped: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData, theme, isFlipped }) => {
  const { name, title, email, phone, website, profilePicture, socialLinks, funFacts } = cardData;
  const [shareUrl, setShareUrl] = useState('');
  
  // Debounce cardData to prevent the expensive encodeCardData function from running on every keystroke.
  const debouncedCardData = useDebounce(cardData, 500);

  useEffect(() => {
    try {
      // Use the debounced data to generate the share URL for the QR code.
      const encodedData = encodeCardData(debouncedCardData);
      const url = `${window.location.origin}${window.location.pathname}#${encodedData}`;
      setShareUrl(url);
    } catch (e) {
      console.error('Failed to generate share URL for QR code', e);
      setShareUrl('');
    }
  }, [debouncedCardData]); // Effect now depends on the debounced data

  const cardStyle: React.CSSProperties = {
    '--primary-color': theme.colors.primary,
    '--secondary-color': theme.colors.secondary,
    '--accent-color': theme.colors.accent,
    '--primary-color-rgb': theme.colors.primaryRgb,
    // By overriding the global theme variables locally,
    // we can make Tailwind's theme classes work with the card's specific theme.
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
  } as React.CSSProperties;

  const formatUrl = (url: string): string => {
    if (!url) return '#';
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return '#';
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    return `https://${trimmedUrl}`;
  };

  return (
    <div className="relative w-full h-full card-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none', ...cardStyle }}>
      {/* Card Front */}
      <div 
        className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-bg-card shadow-2xl border border-border-color/50"
        style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-[#111]"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(var(--primary-color-rgb), 0.2) 0%, transparent 70%)`
          }}
        />
        <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <img
              src={profilePicture ? `data:image/webp;base64,${profilePicture}` : `https://i.pravatar.cc/400?u=${encodeURIComponent(name)}`}
              alt={name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/50 shadow-lg mb-3"
              onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/400?u=fallback`; }}
            />
            <h2 className="text-xl sm:text-2xl font-bold break-words text-shadow">
              <span style={{ color: 'var(--primary-color)' }}>{name.split(' ')[0]}</span>
              <span style={{ color: 'var(--secondary-color)' }}> {name.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-sm sm:text-base font-medium text-white/80">{title}</p>
          </div>
          <div className="footer text-center text-[10px] sm:text-xs text-white/70 space-y-0.5">
            <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1">
              {email && <a href={`mailto:${email}`} className="font-semibold hover:text-white transition-colors">{email}</a>}
              {phone && <a href={`tel:${phone}`} className="font-semibold hover:text-white transition-colors">{phone}</a>}
              {website && website.trim() && <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-white transition-colors">{website}</a>}
            </div>
          </div>
        </div>
      </div>

      {/* Card Back */}
      <div 
        className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-black shadow-2xl border border-white/20 [transform:rotateY(180deg)]"
        style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
      >
        <div className="h-full flex flex-col p-4 sm:p-5 text-white">
          {/* Connect Section */}
          {(socialLinks.filter(l => l.url && l.url.trim()).length > 0 || shareUrl) && (
            <div className="flex-shrink-0">
              <h3 
                className="text-base sm:text-lg font-bold border-b-2 mb-2 sm:mb-3 pb-1 inline-block"
                style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              >Connect</h3>
              <div className="flex justify-between items-start mt-2">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {socialLinks.filter(l => l.url && l.url.trim()).map(link => (
                    <a 
                      key={link.id} href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" 
                      className="hover:text-theme-primary transition-colors transform hover:scale-110" 
                      style={{ color: 'var(--secondary-color)'}} 
                      aria-label={link.type}
                    >
                      <SocialIcon type={link.type} className="w-7 h-7 sm:w-8 sm:h-8" />
                    </a>
                  ))}
                </div>
                {shareUrl && (
                    <div className="p-1 rounded-lg bg-white shadow-md border border-black/5">
                         <QRCodeSVG 
                            value={shareUrl}
                            className="w-12 h-12 sm:w-14 sm:h-14"
                            bgColor={"#ffffff"}
                            fgColor={theme.colors.primary}
                            level="Q"
                            includeMargin={false}
                        />
                    </div>
                )}
              </div>
            </div>
          )}

          {/* Fun Facts Section */}
          {funFacts.filter(f => f.answer.trim()).length > 0 && (
            <div className="flex-1 min-h-0 flex flex-col mt-4 sm:mt-5">
              <h3 
                className="flex-shrink-0 text-base sm:text-lg font-bold border-b-2 mb-2 sm:mb-3 pb-1 inline-block"
                style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}
              >Fun Facts</h3>
              <ul className="flex-1 overflow-y-auto card-scrollbar pr-2 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                {funFacts.filter(f => f.answer.trim()).map(fact => (
                  <li key={fact.id}>
                    <p 
                      className="font-semibold"
                      style={{ color: 'var(--secondary-color)'}}
                    >{fact.question}</p>
                    <p className="text-white/70 pl-1 sm:pl-2">- {fact.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;