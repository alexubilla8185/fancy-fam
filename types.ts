export enum SocialNetwork {
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter',
  GitHub = 'GitHub',
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  Other = 'Other',
}

export interface SocialLink {
  id: string;
  type: SocialNetwork;
  url: string;
}

export interface FunFact {
  id: string;
  question: string;
  answer: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  primaryRgb: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export interface CardData {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  profilePicture: string | null;
  profilePictureUrl?: string | null;
  socialLinks: SocialLink[];
  funFacts: FunFact[];
  themeId: string;
  customColors?: Omit<ThemeColors, 'primaryRgb'>;
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error';
} | null;