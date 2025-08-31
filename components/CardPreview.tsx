import React from 'react';
import { CardData, Theme } from '../types';
import { SocialIcon } from './icons/SocialIcons';

interface CardPreviewProps {
  cardData: CardData;
  theme: Theme;
  isFlipped: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData, theme, isFlipped }) => {
  const { name, title, email, phone, website, profilePicture, socialLinks, funFacts } = cardData;

  const cardStyle: React.CSSProperties = {
    '--primary-color': theme.colors.primary,
    '--secondary-color': theme.colors.secondary,
    '--accent-color': theme.colors.accent,
    '--primary-color-rgb': theme.colors.primaryRgb,
  } as React.CSSProperties;

  const formatUrl = (url: string): string => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="relative w-full h-full card-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none', ...cardStyle }}>
      {/* Card Front */}
      <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-bg-card shadow-2xl border border-border-color/50">
        <div 
          className="absolute inset-0 w-full h-full bg-[#111]"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(var(--primary-color-rgb), 0.2) 0%, transparent 70%)`
          }}
        />
        <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {profilePicture &&
              <img
                src={profilePicture}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/50 shadow-lg mb-3"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            }
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
              {website && <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-white transition-colors">{website}</a>}
            </div>
          </div>
        </div>
      </div>

      {/* Card Back */}
      <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden bg-bg-card shadow-2xl border border-border-color/50 [transform:rotateY(180deg)]">
        <div className="h-full overflow-y-auto p-4 sm:p-5 text-text-content-primary card-scrollbar">
          {socialLinks.filter(l => l.url).length > 0 && (
            <div className="mb-4 sm:mb-5">
              <h3 className="text-base sm:text-lg font-bold text-theme-primary border-b-2 border-theme-primary mb-2 sm:mb-3 pb-1 inline-block">Connect</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                {socialLinks.filter(l => l.url).map(link => (
                  <a key={link.id} href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-theme-secondary hover:text-theme-primary transition-colors transform hover:scale-110" aria-label={link.type}>
                    <SocialIcon type={link.type} className="w-7 h-7 sm:w-8 sm:h-8" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {funFacts.filter(f => f.answer.trim()).length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-theme-primary border-b-2 border-theme-primary mb-2 sm:mb-3 pb-1 inline-block">Fun Facts</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm mt-2">
                {funFacts.filter(f => f.answer.trim()).map(fact => (
                  <li key={fact.id}>
                    <p className="font-semibold text-theme-secondary">{fact.question}</p>
                    <p className="text-text-content-secondary pl-1 sm:pl-2">- {fact.answer}</p>
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