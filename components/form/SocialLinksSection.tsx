import React, { useState } from 'react';
import { CardData, SocialLink, SocialNetwork } from '../../types';
import { SOCIAL_OPTIONS } from '../../constants';
import { SocialIcon } from '../icons/SocialIcons';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import ConfirmationDialog from '../ConfirmationDialog';

interface SocialLinksSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ cardData, setCardData }) => {
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const handleSocialLinkChange = (id: string, value: string) => {
        setCardData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map(link =>
                link.id === id ? { ...link, url: value } : link
            ),
        }));
    };

    const addSocialLink = (type: SocialNetwork) => {
        const newLink: SocialLink = {
            id: Date.now().toString(),
            type,
            url: '',
        };
        setCardData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, newLink],
        }));
        setIsAddMenuOpen(false);
    };

    const removeSocialLink = (id: string) => {
        setCardData(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter(link => link.id !== id),
        }));
    };
    
    const requestRemoveSocialLink = (id: string) => {
        setItemToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            removeSocialLink(itemToDelete);
        }
        setShowConfirm(false);
        setItemToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setItemToDelete(null);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, link: SocialLink) => {
        setDraggedId(link.id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', link.id);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropOnLink: SocialLink) => {
        e.preventDefault();
        if (!draggedId || draggedId === dropOnLink.id) {
            return;
        }

        const links = [...cardData.socialLinks];
        const draggedIndex = links.findIndex(link => link.id === draggedId);
        const targetIndex = links.findIndex(link => link.id === dropOnLink.id);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const [removed] = links.splice(draggedIndex, 1);
        links.splice(targetIndex, 0, removed);

        setCardData(prev => ({
            ...prev,
            socialLinks: links,
        }));
        
        setDraggedId(null);
    };
    
    const handleDragEnd = () => {
        setDraggedId(null);
    };

    const availableSocialOptions = SOCIAL_OPTIONS.filter(
        option => !cardData.socialLinks.some(link => link.type === option.value)
    );

    return (
        <fieldset>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <legend className="text-xl sm:text-2xl font-bold text-gradient">Social Links</legend>
                <div className="relative">
                    <button 
                        type="button" 
                        onClick={() => setIsAddMenuOpen(prev => !prev)}
                        className="bg-control-bg text-control-text text-sm font-semibold py-2 px-3 rounded-md flex items-center gap-2 transition-colors hover:bg-control-hover-bg"
                        disabled={availableSocialOptions.length === 0}
                        aria-haspopup="true"
                        aria-expanded={isAddMenuOpen}
                    >
                        <Plus className="h-4 w-4" /> Add Link
                    </button>
                    {isAddMenuOpen && availableSocialOptions.length > 0 && (
                        <div className="absolute right-0 mt-2 w-48 bg-bg-card rounded-md shadow-lg z-10 border border-border-color">
                            <ul className="py-1" role="menu">
                                {availableSocialOptions.map(option => (
                                    <li key={option.value}>
                                        <button 
                                            type="button"
                                            role="menuitem"
                                            onClick={() => addSocialLink(option.value as SocialNetwork)}
                                            className="w-full text-left px-4 py-2 text-sm text-text-content-primary hover:bg-control-bg flex items-center gap-3"
                                        >
                                            <SocialIcon type={option.value as SocialNetwork} className="w-4 h-4" />
                                            {option.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 sm:p-6 bg-bg-card rounded-lg border border-border-color space-y-4">
                {cardData.socialLinks.length > 0 ? (
                    cardData.socialLinks.map((link) => {
                        const isDragging = draggedId === link.id;
                        return (
                            <div 
                                key={link.id} 
                                className={`flex items-center gap-2 transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, link)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, link)}
                                onDragEnd={handleDragEnd}
                            >
                                <span className="cursor-grab text-text-content-secondary/50 hover:text-text-content-secondary p-1" aria-label="Drag to reorder">
                                    <GripVertical className="h-6 w-6" />
                                </span>
                                <div className="flex-grow">
                                    <label htmlFor={`social-${link.id}`} className="flex items-center gap-2 text-sm font-medium mb-1.5 text-text-content-secondary">
                                        <SocialIcon type={link.type} className="w-4 h-4" />
                                        {link.type}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id={`social-${link.id}`}
                                            type="text"
                                            placeholder={`https://www.${link.type.toLowerCase()}.com/...`}
                                            value={link.url}
                                            onChange={(e) => handleSocialLinkChange(link.id, e.target.value)}
                                            className="form-input p-2.5 w-full"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => requestRemoveSocialLink(link.id)} 
                                            className="text-text-content-secondary hover:text-red-500 transition-colors p-2 flex-shrink-0" 
                                            aria-label={`Remove ${link.type} link`}
                                        >
                                            <Trash2 className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-8 text-text-content-secondary">
                        <p>No social links added.</p>
                    </div>
                )}
            </div>
            <ConfirmationDialog 
                isOpen={showConfirm}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this social link?"
            />
        </fieldset>
    );
};

export default SocialLinksSection;