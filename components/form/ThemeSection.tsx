import React, { useState, useMemo } from 'react';
import { CardData } from '../../types';
import { THEMES, CUSTOM_THEME_ID } from '../../constants';
import { Palette, ChevronRight } from 'lucide-react';
import ThemeSelectionModal from './ThemeSelectionModal';

interface ThemeSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({ cardData, setCardData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentTheme = useMemo(() => {
        if (cardData.themeId === CUSTOM_THEME_ID) {
            return {
                name: 'Custom',
                colors: cardData.customColors ? {
                    primary: cardData.customColors.primary,
                    secondary: cardData.customColors.secondary,
                    accent: cardData.customColors.accent,
                } : {
                    primary: '#000', secondary: '#000', accent: '#000'
                }
            };
        }
        return THEMES.find(t => t.id === cardData.themeId) || THEMES[0];
    }, [cardData.themeId, cardData.customColors]);

    return (
        <fieldset>
            <legend className="text-xl sm:text-2xl font-bold text-gradient mb-6 text-center lg:text-left">Card Theme</legend>
            <div className="p-4 sm:p-6 bg-bg-card rounded-lg border border-border-color">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex justify-between items-center p-3 bg-bg-content rounded-lg border border-border-color hover:border-theme-primary transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 focus:ring-offset-bg-card"
                    aria-haspopup="dialog"
                    aria-expanded={isModalOpen}
                    aria-label={`Change theme, current theme is ${currentTheme.name}`}
                >
                    <div className="flex items-center gap-3">
                        {cardData.themeId === CUSTOM_THEME_ID ? (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-control-bg">
                                <Palette className="w-4 h-4 text-control-text" />
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <div className="w-7 h-7 -mr-2 rounded-full border-2 border-bg-content shadow-sm" style={{ backgroundColor: currentTheme.colors.primary }}></div>
                                <div className="w-7 h-7 -mr-2 rounded-full border-2 border-bg-content shadow-sm" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                                <div className="w-7 h-7 rounded-full border-2 border-bg-content shadow-sm" style={{ backgroundColor: currentTheme.colors.accent }}></div>
                            </div>
                        )}
                        <span className="font-semibold text-text-content-primary">{currentTheme.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-content-secondary" />
                </button>
            </div>
            
            <ThemeSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cardData={cardData}
                setCardData={setCardData}
            />
        </fieldset>
    );
};

export default ThemeSection;