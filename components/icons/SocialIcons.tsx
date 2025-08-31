import React from 'react';
import { SocialNetwork } from '../../types';
import { Github, Linkedin, Twitter, Instagram, Facebook, Link, type LucideProps } from 'lucide-react';

const socialIconMap: Record<SocialNetwork, React.FC<LucideProps>> = {
  [SocialNetwork.GitHub]: Github,
  [SocialNetwork.LinkedIn]: Linkedin,
  [SocialNetwork.Twitter]: Twitter,
  [SocialNetwork.Instagram]: Instagram,
  [SocialNetwork.Facebook]: Facebook,
  [SocialNetwork.Other]: Link,
};

export const SocialIcon: React.FC<{ type: SocialNetwork; className?: string }> = ({ type, className }) => {
    const IconComponent = socialIconMap[type] || Link;
    return <IconComponent className={className} strokeWidth={2} />;
};
