import React from 'react';
import { CardData } from '../types';
import MyInfoSection from './form/MyInfoSection';
import SocialLinksSection from './form/SocialLinksSection';
import FunFactsSection from './form/FunFactsSection';
import ThemeSection from './form/ThemeSection';

interface CreateCardFormProps {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  onPreview: () => void;
}

const CreateCardForm: React.FC<CreateCardFormProps> = ({ cardData, setCardData, onPreview }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPreview();
  };

  return (
    <form className="space-y-12" onSubmit={handleSubmit}>
      <MyInfoSection cardData={cardData} setCardData={setCardData} />
      <SocialLinksSection cardData={cardData} setCardData={setCardData} />
      <FunFactsSection cardData={cardData} setCardData={setCardData} />
      <ThemeSection cardData={cardData} setCardData={setCardData} />

      <div className="form-actions mt-8 pt-8 border-t border-border-color text-center">
        <button type="submit" className="bg-theme-primary hover:opacity-90 text-white font-bold py-3 px-12 rounded-full w-full md:w-auto text-lg shadow-lg hover:shadow-xl" style={{boxShadow: `0 4px 20px -5px rgba(var(--primary-color-rgb), 0.5)`}}>
          Preview My Card
        </button>
      </div>
    </form>
  );
};

export default CreateCardForm;