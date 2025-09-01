import React from 'react';
import { CardData, ThemeColors } from '../../types';
import { THEMES, CUSTOM_THEME_ID } from '../../constants';
import { Palette, X } from 'lucide-react';

interface CustomColorPickerProps {
    colors: Omit<ThemeColors, 'primaryRgb'>;
    onChange: (field: keyof Omit<ThemeColors, 'primaryRgb'>, value: string) => void;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ colors, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-bg-content rounded-lg border border-border-color">
        {Object.entries(colors).map(([key, value]) => (
            <div key={key}>
                <label className="block text-sm font-medium text-text-content-secondary mb-1 capitalize">{key}</label>
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border-color">
                        <div className="w-full h-full" style={{ backgroundColor: value }}></div>
                        <input 
                            type="color" 
                            value={value} 
                            onChange={(e) => onChange(key as any, e.target.value)} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            aria-label={`Select ${key} color`}
                        />
                    </div>
                    <input 
                        type="text" 
                        value={value} 
                        onChange={(e) => onChange(key as any, e.target.value)} 
                        className="form-input w-full"
                        aria-label={`${key} color hex code`}
                    />
                </div>
            </div>
        ))}
    </div>
);


interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({ isOpen, onClose, cardData, setCardData }) => {
    if (!isOpen) return null;

    const handleThemeChange = (themeId: string) => {
        setCardData(prev => {
            const updatedData = { ...prev, themeId };
            if (themeId === CUSTOM_THEME_ID) {
                if (!updatedData.customColors) {
                    updatedData.customColors = { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FDE047' };
                }
            } else {
                delete updatedData.customColors;
            }
            return updatedData;
        });
    };

    const handleCustomColorChange = (field: keyof Omit<ThemeColors, 'primaryRgb'>, value: string) => {
        setCardData(prev => ({ ...prev, customColors: { ...(prev.customColors!), [field]: value } }));
    };

    return (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in-item" style={{ animationDuration: '0.2s' }}
          aria-labelledby="theme-selection-modal-title"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <div 
            className="bg-bg-card rounded-xl shadow-2xl p-4 sm:p-6 m-4 w-full max-w-2xl border border-border-color animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-text-content-primary" id="theme-selection-modal-title">
                Select a Theme
              </h3>
              <button onClick={onClose} className="p-1 rounded-full text-text-content-secondary hover:bg-control-bg" aria-label="Close theme selection">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {THEMES.map((theme) => (
                    <button key={theme.id} type="button" onClick={() => handleThemeChange(theme.id)} className={`w-full p-3 sm:p-4 rounded-lg border-2 text-center transition-all duration-200 ${cardData.themeId === theme.id ? 'border-theme-primary shadow-lg scale-105' : 'border-border-color hover:border-gray-400 dark:hover:border-gray-500'}`}>
                        <div className="flex justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-inner" style={{ backgroundColor: theme.colors.primary }}></div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-inner" style={{ backgroundColor: theme.colors.secondary }}></div>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-inner" style={{ backgroundColor: theme.colors.accent }}></div>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-text-content-secondary">{theme.name}</span>
                    </button>
                ))}
                <button type="button" onClick={() => handleThemeChange(CUSTOM_THEME_ID)} className={`w-full p-3 sm:p-4 rounded-lg border-2 text-center transition-all duration-200 ${cardData.themeId === CUSTOM_THEME_ID ? 'border-theme-primary shadow-lg scale-105' : 'border-border-color hover:border-gray-400 dark:hover:border-gray-500'}`}>
                    <div className="flex justify-center items-center h-5 sm:h-6 mb-2 sm:mb-3">
                         <Palette className={`w-full h-full transition-colors ${cardData.themeId === CUSTOM_THEME_ID ? 'text-theme-primary' : 'text-text-content-secondary'}`} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-text-content-secondary">Custom</span>
                </button>
            </div>

            {cardData.themeId === CUSTOM_THEME_ID && cardData.customColors && (
                <div className="mt-6 border-t border-border-color pt-6">
                    <p className="font-semibold text-text-content-secondary mb-3">Customize Colors</p>
                    <CustomColorPicker colors={cardData.customColors} onChange={handleCustomColorChange} />
                </div>
            )}
             <div className="mt-6 text-right">
                <button
                    type="button"
                    className="px-6 py-2 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white font-semibold rounded-lg hover:brightness-110 transition-all shadow-md shadow-[#EC4899]/30"
                    onClick={onClose}
                >
                    Done
                </button>
            </div>
          </div>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in {
                animation: scaleIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
          `}</style>
        </div>
    );
};

export default ThemeSelectionModal;