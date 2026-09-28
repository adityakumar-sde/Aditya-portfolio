export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  technologies: string[];
  problem: string;
  solution: string;
  architectureDescription: string;
  features: string[];
  engineeringHighlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface ArchitectureNodeData {
  id: string;
  name: string;
  layer: 'frontend' | 'transport' | 'controller' | 'service' | 'data' | 'realtime';
  description: string;
  tech: string;
  responsibilities: string[];
  position: [number, number, number];
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: string;
    detail: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  technologies: string[];
  responsibilities: string[];
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  grade: string;
  location: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt?: string;
}

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}
