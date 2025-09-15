import { CardData, SocialNetwork, Theme } from './types';

export const CUSTOM_THEME_ID = 'custom';

export const INITIAL_CARD_DATA: CardData = {
  name: 'Alex Doe',
  title: 'Software Engineer & Designer',
  email: 'alex.doe@example.com',
  phone: '(123) 456-7890',
  website: 'alexdoe.dev',
  profilePicture: null,
  socialLinks: [
    { id: '1', type: SocialNetwork.LinkedIn, url: 'https://www.linkedin.com/in/alexdoe' },
    { id: '2', type: SocialNetwork.Instagram, url: 'https://www.instagram.com/alexdoe' },
  ],
  funFacts: [
    { id: '1', question: 'Coffee or Tea?', answer: 'Both! Espresso in the morning, Green Tea in the afternoon.' },
    { id: '2', question: 'Favorite coding language?', answer: 'TypeScript for its safety and scalability.' },
  ],
  themeId: 'neon-dream',
};

export const SOCIAL_OPTIONS = Object.values(SocialNetwork).map(value => ({
  value,
  label: value,
}));

export const FUN_FACT_QUESTIONS: string[] = [
  "What's your secret talent?",
  "What's your favorite productivity hack?",
  "Coffee or Tea?",
  "What's a book that changed your perspective?",
  "What's your go-to karaoke song?",
  "Favorite coding language?",
  "What's the most interesting project you've worked on?",
  "If you weren't in your current role, what would you be doing?",
  "What's a skill you're currently learning?",
];

export const THEMES: Theme[] = [
  {
    id: 'neon-dream',
    name: 'Neon Dream',
    colors: { primary: '#EC4899', secondary: '#8B5CF6', accent: '#FDE047', primaryRgb: '236, 72, 153' },
  },
  {
    id: 'oceanic-calm',
    name: 'Oceanic Calm',
    colors: { primary: '#0EA5E9', secondary: '#14B8A6', accent: '#A3E635', primaryRgb: '14, 165, 233' },
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    colors: { primary: '#F97316', secondary: '#EF4444', accent: '#FACC15', primaryRgb: '249, 115, 22' },
  },
  {
    id: 'forest-hues',
    name: 'Forest Hues',
    colors: { primary: '#16A34A', secondary: '#65A30D', accent: '#FBBF24', primaryRgb: '22, 163, 74' },
  },
  {
    id: 'lavender-bliss',
    name: 'Lavender Bliss',
    colors: { primary: '#9333EA', secondary: '#C084FC', accent: '#F0ABFC', primaryRgb: '147, 51, 234' },
  },
  {
    id: 'monochrome-sleek',
    name: 'Monochrome Sleek',
    colors: { primary: '#6B7280', secondary: '#D1D5DB', accent: '#F9FAFB', primaryRgb: '107, 114, 128' },
  },
];