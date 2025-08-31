export enum SocialNetwork {
  LinkedIn = 'linkedin',
  Twitter = 'twitter',
  GitHub = 'github',
  Instagram = 'instagram',
  Facebook = 'facebook',
  Other = 'other',
}

export interface SocialLink {
  id: string;
  type: SocialNetwork;
  url: string;
}

export interface FunFact {
  id:string;
  question: string;
  answer: string;
  isGenerating?: boolean;
}

export interface ThemeColors {
  primary: string;
  primaryRgb: string;
  secondary: string;
  accent: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error';
} | null;

export interface CardData {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  profilePicture: string; // This will now be a base64 string
  socialLinks: SocialLink[];
  funFacts: FunFact[];
  themeId: string;
  customColors?: Omit<ThemeColors, 'primaryRgb'>;
}