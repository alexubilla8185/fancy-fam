import { SocialNetwork, Theme, CardData } from './types';

export const CUSTOM_THEME_ID = 'custom';

export const SOCIAL_OPTIONS = [
  { value: SocialNetwork.LinkedIn, label: 'LinkedIn' },
  { value: SocialNetwork.Twitter, label: 'Twitter' },
  { value: SocialNetwork.GitHub, label: 'GitHub' },
  { value: SocialNetwork.Instagram, label: 'Instagram' },
  { value: SocialNetwork.Facebook, label: 'Facebook' },
  { value: SocialNetwork.Other, label: 'Other' },
];

export const FUN_FACT_QUESTIONS = [
  'Dream Dinner Guest?',
  'Vacay Goals?',
  'Secret Talent?',
  'Top Flick?',
  'Karaoke Jam?',
  'Wisdom Drop?',
  'Shock & Awe?',
  'Bacon?',
  'Time Warp?',
  'Weekend Vibes?',
  'Foodie Fun?',
  'Passions?',
  'Heartfelt Cause?',
  'Coke or Pepsi?',
  'Android or iPhone?',
];

export const THEMES: Theme[] = [
  {
    id: 'hyper-pink',
    name: 'Hyper Pink',
    colors: { primary: '#F43F5E', primaryRgb: '244, 63, 94', secondary: '#38BDF8', accent: '#FACC15' },
  },
  {
    id: 'oceanic',
    name: 'Oceanic',
    colors: { primary: '#38BDF8', primaryRgb: '56, 189, 248', secondary: '#34D399', accent: '#F97316' },
  },
    {
    id: 'synthwave',
    name: 'Synthwave',
    colors: { primary: '#EC4899', primaryRgb: '236, 72, 153', secondary: '#8B5CF6', accent: '#FDE047' },
  },
  {
    id: 'gilded-gold',
    name: 'Gilded Gold',
    colors: { primary: '#FBBF24', primaryRgb: '251, 191, 36', secondary: '#9CA3AF', accent: '#F9FAFB' },
  },
  {
    id: 'noir',
    name: 'Noir',
    colors: { primary: '#D4AF37', primaryRgb: '212, 175, 55', secondary: '#E5E7EB', accent: '#F9FAFB' },
  },
];

export const INITIAL_CARD_DATA: CardData = {
  name: 'Alexa Johnson',
  title: 'Full Stack Developer',
  email: 'alexa@example.com',
  phone: '(555) 123-4567',
  website: 'alexajohnson.dev',
  profilePicture: `https://i.pravatar.cc/400?u=alexajohnson`,
  socialLinks: [
    { id: '1', type: SocialNetwork.LinkedIn, url: 'https://linkedin.com/in/alexajohnson' },
    { id: '2', type: SocialNetwork.GitHub, url: 'https://github.com/alexajohnson' },
    { id: '3', type: SocialNetwork.Twitter, url: 'https://twitter.com/alexajohnson' },
  ],
  funFacts: [
    { id: '1', question: 'Secret Talent?', answer: "I can solve a Rubik's cube in under a minute!" },
    { id: '2', question: 'Time Warp?', answer: 'Teleportation - no more commuting!' },
  ],
  themeId: 'synthwave',
};