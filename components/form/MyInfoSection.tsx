import React, { useState } from 'react';
import { CardData, ToastMessage } from '../../types';
import { ImageUp } from 'lucide-react';

interface MyInfoSectionProps {
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
    setToast: (toast: ToastMessage) => void;
}

const resizeAndEncodeImage = (file: File, maxSize: number = 320): Promise<string> => {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = objectUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > height) {
                if (width > maxSize) {
                    height = Math.round(height * (maxSize / width));
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round(width * (maxSize / height));
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                return reject(new Error('Could not get canvas context'));
            }
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(objectUrl);
            
            // Use WebP for superior compression, with a quality of 75%
            const dataUrl = canvas.toDataURL('image/webp', 0.75);
            // Strip the data URL prefix to save space
            const base64String = dataUrl.split(',')[1];
            resolve(base64String);
        };

        img.onerror = (error) => {
            URL.revokeObjectURL(objectUrl);
            reject(error);
        };
    });
};

const MyInfoSection: React.FC<MyInfoSectionProps> = ({ cardData, setCardData, setToast }) => {
    const [websiteError, setWebsiteError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');

    const validateWebsite = (url: string): string => {
        if (!url) {
            return ''; // It's an optional field, so no error if empty
        }
        const trimmedUrl = url.trim();
        if (/\s/.test(trimmedUrl)) {
            return 'Website URL cannot contain spaces.';
        }
        // Prepend a protocol for robust parsing if one isn't present.
        let urlToTest = trimmedUrl;
        if (!urlToTest.startsWith('http://') && !urlToTest.startsWith('https://')) {
            urlToTest = `https://${urlToTest}`;
        }
    
        try {
            const parsedUrl = new URL(urlToTest);
            // A simple heuristic for a public website is that the hostname has a dot.
            if (!parsedUrl.hostname.includes('.')) {
                 return 'Please enter a valid domain name (e.g., yoursite.com).';
            }
        } catch (error) {
            return 'Please enter a valid URL format.';
        }
        
        return '';
    };

    const validateEmail = (email: string): string => {
        if (!email) return ''; // Optional field
        
        const trimmedEmail = email.trim();
        if (/\s/.test(trimmedEmail)) {
            return 'Email address cannot contain spaces.';
        }
        
        const atIndex = trimmedEmail.indexOf('@');
        if (atIndex === -1) {
            return "Email must include an '@' symbol.";
        }
        
        if (atIndex === 0) {
            return "Please enter a part before the '@' symbol.";
        }

        const domainPart = trimmedEmail.substring(atIndex + 1);
        if (domainPart.length === 0) {
            return "Please enter a domain after the '@' symbol.";
        }

        if (!domainPart.includes('.')) {
            return "The domain must contain a '.' (e.g., example.com).";
        }

        if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
            return 'The domain is improperly formatted.';
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
            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

            if (file.size > MAX_FILE_SIZE) {
                setToast({ id: Date.now(), message: 'Image size cannot exceed 10MB.', type: 'error' });
                return;
            }

            try {
                const resizedImage = await resizeAndEncodeImage(file);
                setCardData(prev => ({ ...prev, profilePicture: resizedImage }));
            } catch (error) {
                console.error("Failed to process image:", error);
                setToast({ id: Date.now(), message: 'Failed to process image.', type: 'error' });
            }
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
                    <div>
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
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-content-secondary">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            <img 
                                src={cardData.profilePicture ? `data:image/webp;base64,${cardData.profilePicture}` : `https://i.pravatar.cc/400?u=${cardData.name}`} 
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