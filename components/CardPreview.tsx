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
  } as React.CSSProperties;

  const formatUrl = (url: string): string => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="w-full h-full perspective-1000 flex items-center justify-center">
      <div
        className="relative card-inner w-full max-w-[400px] aspect-video"
        style={isFlipped ? { transform: 'rotateY(180deg)' } : {}}
      >
        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden bg-bg-card shadow-xl border border-border-color/50" style={cardStyle}>
          {profilePicture && <img src={profilePicture} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-10" onError={(e) => (e.currentTarget.style.display = 'none')} />}
          <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-6">
            <div className="header">
              <h2 className="text-xl sm:text-2xl font-bold break-words">
                <span className="text-theme-primary">{name.split(' ')[0]}</span>
                <span className="text-theme-secondary"> {name.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-sm sm:text-base text-text-content-secondary font-medium">{title}</p>
            </div>
            <div className="footer text-right text-[10px] sm:text-xs text-text-content-secondary space-y-0.5">
                {email && <a href={`mailto:${email}`} className="block font-semibold hover:text-theme-primary transition-colors">{email}</a>}
                {phone && <a href={`tel:${phone}`} className="block font-semibold hover:text-theme-primary transition-colors">{phone}</a>}
                {website && <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" className="block font-semibold hover:text-theme-primary transition-colors">{website}</a>}
            </div>
          </div>
        </div>

        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden bg-bg-card shadow-xl border border-border-color/50 [transform:rotateY(180deg)]" style={cardStyle}>
            <div className="h-full overflow-y-auto p-4 sm:p-6 text-text-content-primary card-scrollbar">
                {socialLinks.length > 0 && <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-theme-primary border-b-2 border-theme-primary mb-2 sm:mb-3 pb-1 inline-block">Socials</h3>
                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                        {socialLinks.map(link => (
                            <a key={link.id} href={formatUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-theme-secondary hover:text-theme-primary transition-colors transform hover:scale-110" aria-label={link.type}>
                                <SocialIcon type={link.type} className="w-7 h-7 sm:w-8 sm:h-8"/>
                            </a>
                        ))}
                    </div>
                </div>}

                {funFacts.length > 0 && <div>
                    <h3 className="text-base sm:text-lg font-bold text-theme-primary border-b-2 border-theme-primary mb-2 sm:mb-3 pb-1 inline-block">Fun Facts</h3>
                    <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm mt-2">
                        {funFacts.filter(f => f.answer.trim()).map(fact => (
                            <li key={fact.id}>
                                <p className="font-semibold text-theme-secondary">{fact.question}</p>
                                <p className="text-text-content-secondary pl-1 sm:pl-2">- {fact.answer}</p>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;