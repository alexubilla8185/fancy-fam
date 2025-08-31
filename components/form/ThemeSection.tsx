import React from 'react';
import { CardData, ThemeColors } from '../../types';
import { THEMES, CUSTOM_THEME_ID } from '../../constants';

interface ThemeSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const CustomColorPicker: React.FC<{
    colors: Omit<ThemeColors, 'primaryRgb'>;
    onChange: (field: keyof Omit<ThemeColors, 'primaryRgb'>, value: string) => void;
}> = ({ colors, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-bg-content rounded-lg border border-border-color">
        {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
                <label className="block text-sm font-medium text-text-content-secondary mb-1 capitalize">{key}</label>
                <div className="flex items-center form-input p-0 overflow-hidden">
                    <input type="color" value={value} onChange={(e) => onChange(key as any, e.target.value)} className="w-10 h-10 border-none bg-transparent cursor-pointer" />
                    <input type="text" value={value} onChange={(e) => onChange(key as any, e.target.value)} className="w-full py-2 px-3 bg-transparent border-none focus:ring-0" />
                </div>
            </div>
        ))}
    </div>
);


const ThemeSection: React.FC<ThemeSectionProps> = ({ cardData, setCardData }) => {

    const handleThemeChange = (themeId: string) => {
        setCardData(prev => ({ 
            ...prev, 
            themeId,
            customColors: themeId === CUSTOM_THEME_ID && !prev.customColors 
                ? { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FDE047' } 
                : prev.customColors
        }));
    };

    const handleCustomColorChange = (field: keyof Omit<ThemeColors, 'primaryRgb'>, value: string) => {
        setCardData(prev => ({ ...prev, customColors: { ...(prev.customColors!), [field]: value } }));
    };

    return (
        <fieldset>
            <legend className="text-2xl font-bold text-theme-primary mb-6">Card Theme</legend>
            <div className="p-6 bg-bg-card rounded-lg border border-border-color">
                <div className="flex overflow-x-auto space-x-4 pb-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:space-x-0 md:gap-4 horizontal-scrollbar">
                    {THEMES.map((theme) => (
                        <button key={theme.id} type="button" onClick={() => handleThemeChange(theme.id)} className={`flex-shrink-0 w-36 md:w-full p-4 rounded-lg border-2 text-center transition-all duration-200 ${cardData.themeId === theme.id ? 'border-theme-primary shadow-lg scale-105' : 'border-border-color hover:border-gray-400 dark:hover:border-gray-500'}`}>
                            <div className="flex justify-center gap-2 mb-3"><div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: theme.colors.primary }}></div><div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: theme.colors.secondary }}></div><div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: theme.colors.accent }}></div></div>
                            <span className="text-sm font-semibold text-text-content-secondary">{theme.name}</span>
                        </button>
                    ))}
                    <button type="button" onClick={() => handleThemeChange(CUSTOM_THEME_ID)} className={`flex-shrink-0 w-36 md:w-full p-4 rounded-lg border-2 text-center transition-all duration-200 ${cardData.themeId === CUSTOM_THEME_ID ? 'border-theme-primary shadow-lg scale-105' : 'border-border-color hover:border-gray-400 dark:hover:border-gray-500'}`}>
                        <div className="flex justify-center items-center gap-2 mb-3"><div className="w-14 h-7 rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"></div></div>
                        <span className="text-sm font-semibold text-text-content-secondary">Custom</span>
                    </button>
                </div>

                {cardData.themeId === CUSTOM_THEME_ID && (
                    <div className="mt-6 border-t border-border-color pt-6">
                        <p className="font-semibold text-text-content-secondary mb-3">Customize Colors</p>
                        <CustomColorPicker colors={cardData.customColors!} onChange={handleCustomColorChange} />
                    </div>
                )}
            </div>
        </fieldset>
    );
};

export default ThemeSection;