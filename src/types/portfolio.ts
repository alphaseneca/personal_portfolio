/**
 * Portfolio Data Models and Type Definitions
 * Clean, minimal types matching the active application schema.
 */

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ProfileData {
  name: string;
  nameBlocks: string[];
  role: string;
  shortBio: string;
  email: string;
  avatar: string;
  socials: SocialLink[];
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  confidence: number;
  experience: string;
}

export interface SkillsData {
  tools: SkillItem[];
  languages: SkillItem[];
  placeholders?: SkillItem[];
}

export interface TimelineItem {
  id: string;
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string;
  date: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  type: 'software' | 'hardware';
  title: string;
  description: string;
  link: string;
  image?: string;
}
