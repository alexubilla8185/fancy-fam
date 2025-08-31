import React from 'react';
import { CardData, SocialLink, SocialNetwork } from '../../types';
import { SOCIAL_OPTIONS } from '../../constants';
import { Plus, Trash2, Link2 } from 'lucide-react';

interface SocialLinksSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ cardData, setCardData }) => {

    const handleSocialLinkChange = (id: string, field: keyof Omit<SocialLink, 'id'>, value: string) => {
        setCardData(prev => ({ ...prev, socialLinks: prev.socialLinks.map(link => link.id === id ? { ...link, [field]: value } : link) }));
    };
    
    const addSocialLink = () => {
        setCardData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { id: Date.now().toString(), type: SocialNetwork.LinkedIn, url: '' }] }));
    };

    const removeSocialLink = (id: string) => {
        setCardData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(link => link.id !== id) }));
    };

    const AddButton: React.FC<{onClick: () => void}> = ({onClick}) => (
        <button type="button" onClick={onClick} className="bg-control-bg text-control-text text-sm font-semibold py-2 px-3 rounded-md flex items-center gap-2 transition-colors hover:bg-control-hover-bg">
            <Plus className="h-4 w-4" /> Add Link
        </button>
    );
      
    const RemoveButton: React.FC<{onClick: () => void}> = ({onClick}) => (
        <button type="button" onClick={onClick} className="text-text-content-secondary hover:text-red-500 transition-colors p-1" aria-label="Remove link">
            <Trash2 className="h-5 w-5"/>
        </button>
    );

    return (
        <fieldset>
            <div className="flex justify-between items-center mb-6">
                <legend className="text-2xl font-bold text-theme-primary">Social Links</legend>
                <AddButton onClick={addSocialLink} />
            </div>
            <div className="p-6 bg-bg-card rounded-lg border border-border-color space-y-4">
                {cardData.socialLinks.length > 0 ? (
                    cardData.socialLinks.map((link) => (
                        <div key={link.id} className="bg-bg-content rounded-lg border border-border-color p-4 space-y-3 fade-in-item">
                            <select value={link.type} onChange={(e) => handleSocialLinkChange(link.id, 'type', e.target.value)} className="form-select p-2.5 w-full">
                                {SOCIAL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <input type="text" placeholder="https://..." value={link.url} onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)} className="form-input p-2.5 w-full" />
                            <div className="flex justify-end pt-1">
                                <RemoveButton onClick={() => removeSocialLink(link.id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-text-content-secondary">
                        <Link2 className="mx-auto w-10 h-10 mb-2" />
                        <h3 className="font-semibold">No social links yet.</h3>
                        <p className="text-sm">Click "Add Link" to get started.</p>
                    </div>
                )}
            </div>
        </fieldset>
    );
};

export default SocialLinksSection;