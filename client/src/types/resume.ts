export interface Resume {
  id: string;
  user_id: string;
  title: string;
  language: string;
  cv_score: number;
  created_at: string;
  updated_at: string;
}

export interface PersonalDetails {
  id: string;
  resume_id: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city_state: string;
  country: string;
}

export interface ProfessionalSummary {
  id: string;
  resume_id: string;
  content: string;
}

export interface EducationEntry {
  id: string;
  resume_id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
  sort_order: number;
}

export interface WorkExperience {
  id: string;
  resume_id: string;
  job_title: string;
  company: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  description: string;
  sort_order: number;
}

export interface SkillEntry {
  id: string;
  resume_id: string;
  name: string;
  level: string;
  sort_order: number;
}

export interface ProjectEntry {
  id: string;
  resume_id: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  url: string;
  sort_order: number;
}

export interface LanguageEntry {
  id: string;
  resume_id: string;
  language: string;
  proficiency: string;
  sort_order?: number;
}

export interface AwardEntry {
  id: string;
  resume_id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  sort_order?: number;
}

export interface PublicationEntry {
  id: string;
  resume_id: string;
  title: string;
  publisher: string;
  year: string;
  url: string;
  sort_order?: number;
}

export interface CertificationEntry {
  id: string;
  resume_id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string;
  url: string;
  sort_order: number;
}

export type SectionType =
  | 'header'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'publications';

export interface CVSection {
  id: SectionType;
  title: string;
  isOpen: boolean;
  order: number;
}

export type TemplateId = 'classic' | 'modern' | 'minimalist' | 'professional';

export interface CVTemplate {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
}
