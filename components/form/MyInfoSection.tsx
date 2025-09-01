import React, { useState } from 'react';
import { CardData } from '../../types';
import { ImageUp } from 'lucide-react';

interface MyInfoSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const MyInfoSection: React.FC<MyInfoSectionProps> = ({ cardData, setCardData }) => {
    const [websiteError, setWebsiteError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');

    const validateWebsite = (url: string): string => {
        if (!url) {
            return ''; // It's an optional field, so no error if empty
        }
        // A standard regex for URL validation. It's not perfect but covers most common cases.
        const urlRegex = /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlRegex.test(url)) {
            return 'Please enter a valid URL (e.g., yoursite.com).';
        }
        return '';
    };

    const validateEmail = (email: string): string => {
        if (!email) return ''; // Optional field, so no error if empty
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }
        return '';
    };

    const formatPhoneNumber = (value: string): string => {
        if (!value) return value;
        const numericValue = value.replace(/\D/g, '').slice(0, 10);
        if (numericValue.length > 6) {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        }
        if (numericValue.length > 3) {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
        }
        return numericValue;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            setCardData(prev => ({ ...prev, phone: formatPhoneNumber(value) }));
            return;
        }
        
        if (name === 'website') {
            setWebsiteError(validateWebsite(value));
        }
        if (name === 'email') {
            setEmailError(validateEmail(value));
        }
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setCardData(prev => ({ ...prev, profilePicture: base64 }));
        }
    };

    return (
        <fieldset>
            <legend className="text-xl sm:text-2xl font-bold text-gradient mb-6">My Info</legend>
            <div className="p-4 sm:p-6 bg-bg-card rounded-lg border border-border-color">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-text-content-secondary">Full Name</label>
                        <input id="name" name="name" type="text" value={cardData.name} onChange={handleInputChange} className="form-input w-full" required />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1 text-text-content-secondary">Professional Title</label>
                        <input id="title" name="title" type="text" value={cardData.title} onChange={handleInputChange} className="form-input w-full" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1 text-text-content-secondary">Email</label>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={cardData.email} 
                            onChange={handleInputChange} 
                            className={`form-input w-full ${emailError ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : ''}`}
                            aria-invalid={!!emailError}
                            aria-describedby="email-error"
                        />
                         {emailError && <p id="email-error" className="text-sm text-red-500 mt-1">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1 text-text-content-secondary">Phone</label>
                        <input 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            value={cardData.phone} 
                            onChange={handleInputChange} 
                            className="form-input w-full" 
                            inputMode="tel"
                            maxLength={14}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="website" className="block text-sm font-medium mb-1 text-text-content-secondary">Website</label>
                        <input 
                            id="website" 
                            name="website" 
                            type="text" 
                            placeholder="yourwebsite.com" 
                            value={cardData.website} 
                            onChange={handleInputChange} 
                            className={`form-input w-full ${websiteError ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : ''}`}
                            aria-invalid={!!websiteError}
                            aria-describedby="website-error"
                        />
                        {websiteError && <p id="website-error" className="text-sm text-red-500 mt-1">{websiteError}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-text-content-secondary">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            <img 
                                src={cardData.profilePicture || `https://i.pravatar.cc/400?u=${cardData.name}`} 
                                alt="Profile Preview" 
                                className="w-16 h-16 rounded-full object-cover bg-gray-200"
                                onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/400?u=fallback`; }}
                            />
                            <label htmlFor="profilePicture" className="cursor-pointer flex-grow text-center px-4 py-2 bg-bg-content border-2 border-dashed border-border-color rounded-lg hover:border-theme-primary transition-colors">
                                <div className="flex items-center justify-center gap-2 text-text-content-secondary">
                                    <ImageUp className="w-5 h-5" />
                                    <span className="font-semibold text-sm">Upload Image</span>
                                </div>
                                <input id="profilePicture" name="profilePicture" type="file" onChange={handleProfilePictureChange} className="sr-only" accept="image/png, image/jpeg, image/gif" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    );
};

export default MyInfoSection;