import React from 'react';
import { CardData, FunFact } from '../../types';
import { FUN_FACT_QUESTIONS } from '../../constants';
import { Plus, Trash2, MessageSquareQuote } from 'lucide-react';

interface FunFactsSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const FunFactsSection: React.FC<FunFactsSectionProps> = ({ cardData, setCardData }) => {
    const handleFunFactChange = (id: string, field: keyof Omit<FunFact, 'id'>, value: string) => {
        setCardData(prev => ({ ...prev, funFacts: prev.funFacts.map(fact => fact.id === id ? { ...fact, [field]: value } : fact) }));
    };

    const addFunFact = () => {
        setCardData(prev => ({ ...prev, funFacts: [...prev.funFacts, { id: Date.now().toString(), question: FUN_FACT_QUESTIONS[0], answer: '' }] }));
    };
    
    const removeFunFact = (id: string) => {
        setCardData(prev => ({ ...prev, funFacts: prev.funFacts.filter(fact => fact.id !== id) }));
    };

    const RemoveButton: React.FC<{onClick: () => void}> = ({onClick}) => (
        <button type="button" onClick={onClick} className="text-text-content-secondary hover:text-red-500 transition-colors p-1" aria-label="Remove fun fact">
            <Trash2 className="h-5 w-5"/>
        </button>
    );

    return (
        <fieldset>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <legend className="text-xl sm:text-2xl font-bold text-gradient">Fun Facts</legend>
                <div className="flex gap-2">
                    <button type="button" onClick={addFunFact} className="bg-control-bg text-control-text text-sm font-semibold py-2 px-3 rounded-md flex items-center gap-2 transition-colors hover:bg-control-hover-bg">
                        <Plus className="h-4 w-4" /> Add Fun Fact
                    </button>
                </div>
            </div>
            <div className="p-4 sm:p-6 bg-bg-card rounded-lg border border-border-color space-y-4">
                {cardData.funFacts.length > 0 ? (
                    cardData.funFacts.map((fact) => (
                        <div key={fact.id} className="bg-bg-content rounded-lg border border-border-color p-4 space-y-3 fade-in-item">
                             <select value={fact.question} onChange={e => handleFunFactChange(fact.id, 'question', e.target.value)} className="form-select p-2.5 w-full">
                                <option value="">Select a question...</option>
                                {FUN_FACT_QUESTIONS.includes(fact.question) || <option value={fact.question}>{fact.question}</option> }
                                {FUN_FACT_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                            <input type="text" placeholder="Your answer..." value={fact.answer} onChange={e => handleFunFactChange(fact.id, 'answer', e.target.value)} className="form-input p-2.5 w-full" />
                            <div className="flex justify-end pt-1">
                                <RemoveButton onClick={() => removeFunFact(fact.id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-text-content-secondary">
                        <MessageSquareQuote className="mx-auto w-10 h-10 mb-2" />
                        <h3 className="font-semibold">No fun facts yet.</h3>
                        <p className="text-sm">Add a fact to get started.</p>
                    </div>
                )}
            </div>
        </fieldset>
    );
};

export default FunFactsSection;