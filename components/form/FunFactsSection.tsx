import React, { useState } from 'react';
import { CardData, FunFact, ToastMessage } from '../../types';
import { FUN_FACT_QUESTIONS } from '../../constants';
import { Plus, Trash2, MessageSquareQuote, Sparkles } from 'lucide-react';
import ConfirmationDialog from '../ConfirmationDialog';
import { generateFunFactAnswer } from '../../lib/gemini';
import Spinner from '../Spinner';

interface FunFactsSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
    setToast: (toast: ToastMessage) => void;
}

const FunFactsSection: React.FC<FunFactsSectionProps> = ({ cardData, setCardData, setToast }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const handleFunFactChange = (id: string, field: keyof Omit<FunFact, 'id'>, value: string) => {
        setCardData(prev => ({ ...prev, funFacts: prev.funFacts.map(fact => fact.id === id ? { ...fact, [field]: value } : fact) }));
    };

    const addFunFact = () => {
        setCardData(prev => ({ ...prev, funFacts: [...prev.funFacts, { id: Date.now().toString(), question: FUN_FACT_QUESTIONS[0], answer: '' }] }));
    };
    
    const removeFunFact = (id: string) => {
        setCardData(prev => ({ ...prev, funFacts: prev.funFacts.filter(fact => fact.id !== id) }));
    };

    const requestRemoveFunFact = (id: string) => {
        setItemToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            removeFunFact(itemToDelete);
        }
        setShowConfirm(false);
        setItemToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    };

    const handleGenerateAnswer = async (factId: string, question: string) => {
        if (generatingId) return; // Prevent multiple requests

        if (!question) {
            setToast({ id: Date.now(), message: 'Please select a question first.', type: 'error' });
            return;
        }

        setGeneratingId(factId);
        try {
            const answer = await generateFunFactAnswer(cardData.name, cardData.title, question);
            handleFunFactChange(factId, 'answer', answer);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setToast({ id: Date.now(), message: errorMessage, type: 'error' });
        } finally {
            setGeneratingId(null);
        }
    };

    const RemoveButton: React.FC<{onClick: () => void}> = ({onClick}) => (
        <button type="button" onClick={onClick} className="text-text-content-secondary hover:text-red-500 transition-colors p-2" aria-label="Remove fun fact">
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
                        <div key={fact.id} className="flex items-start gap-4 bg-bg-content rounded-lg border border-border-color p-4 fade-in-item">
                            <div className="flex-grow space-y-3">
                                <select value={fact.question} onChange={e => handleFunFactChange(fact.id, 'question', e.target.value)} className="form-select p-2.5 w-full">
                                    <option value="">Select a question...</option>
                                    {FUN_FACT_QUESTIONS.includes(fact.question) || <option value={fact.question}>{fact.question}</option> }
                                    {FUN_FACT_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                                <div className="relative flex items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Your answer..." 
                                        value={fact.answer} 
                                        onChange={e => handleFunFactChange(fact.id, 'answer', e.target.value)} 
                                        className="form-input p-2.5 w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleGenerateAnswer(fact.id, fact.question)}
                                        disabled={!!generatingId}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-text-content-secondary rounded-full hover:bg-control-hover-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Auto-suggest answer"
                                        title="Auto-suggest answer"
                                    >
                                        {generatingId === fact.id ? (
                                            <Spinner className="w-5 h-5 text-theme-primary" />
                                        ) : (
                                            <Sparkles className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <RemoveButton onClick={() => requestRemoveFunFact(fact.id)} />
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
            <ConfirmationDialog 
                isOpen={showConfirm}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this fun fact?"
            />
        </fieldset>
    );
};

export default FunFactsSection;