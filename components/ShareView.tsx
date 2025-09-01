import React, { useState } from 'react';
import { CardData, Theme } from '../types';
import CardPreview from './CardPreview';
import { downloadVCard } from '../utils/vcard';
import { Download } from 'lucide-react';

interface ShareViewProps {
    cardData: CardData;
    theme: Theme;
}

const ShareView: React.FC<ShareViewProps> = ({ cardData, theme }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gradient">
                    {cardData.name}
                </h2>
                <p className="text-md text-text-content-secondary">Here's my modern digital card. Click to flip!</p>
            </div>
            
            <div 
              className="w-full max-w-[480px] mx-auto aspect-[5/3] cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(f => !f)}
            >
              <CardPreview cardData={cardData} theme={theme} isFlipped={isFlipped} />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs mx-auto">
                <button 
                    onClick={() => downloadVCard(cardData)}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg bg-bg-card hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-text-content-primary border border-border-color transition-colors"
                >
                    <Download className="w-5 h-5" /> Download vCard
                </button>
            </div>
            <p className="mt-8 text-center text-sm text-text-content-secondary">
                Want to create your own? <a href="/" className="font-semibold text-theme-primary hover:underline">Create a FancyFam Card</a>.
            </p>
        </main>
    );
};

export default ShareView;
