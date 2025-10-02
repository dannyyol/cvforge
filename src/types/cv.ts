export type SectionType =
  | 'header'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications';

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  visible: boolean;
  content: any;
}

export interface HeaderContent {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface SummaryContent {
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface AISuggestion {
  id: string;
  type: 'bullet' | 'keyword' | 'rephrase';
  sectionId: string;
  itemId?: string;
  original?: string;
  suggestion: string;
  reason: string;
  accepted?: boolean;
}

export interface KeywordCoverage {
  keyword: string;
  present: boolean;
  count: number;
  importance: 'high' | 'medium' | 'low';
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'minimal' | 'creative';
}

export interface CVData {
  id: string;
  sections: CVSection[];
  template: string;
  createdAt: string;
  updatedAt: string;
}
