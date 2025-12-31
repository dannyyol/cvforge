export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ProfessionalSummary {
  content: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  link: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  description: string;
  link: string;
}

export type SectionType = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

export type TemplateId = 'classic' | 'legacy' | 'professional';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface Template {
  id: TemplateId;
  name: string;
  thumbnail: string;
}

export interface TemplateProps {
  personalDetails: PersonalDetails;
  professionalSummary: ProfessionalSummary;
  workExperiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  // awards: Award[];
  // publications: Publication[];
  sections: CVSection[];
  theme: ThemeConfig;
  // accentColor?: string;
  // fontFamily?: string;
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  isVisible: boolean;
  order: number;
}
