import React from 'react';
import {
  CVTemplate,
  TemplateId,
  PersonalDetails,
  ProfessionalSummary,
  WorkExperience,
  EducationEntry,
  SkillEntry,
  ProjectEntry,
  CertificationEntry,
  CVSection,
} from '../../types/resume';

import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';

export interface TemplateProps {
  personalDetails: PersonalDetails | null;
  professionalSummary: ProfessionalSummary | null;
  workExperiences: WorkExperience[];
  educationEntries: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sections: CVSection[];
  accentColor?: string;
}

export interface TemplateDefinition extends CVTemplate {
  component: React.ComponentType<TemplateProps>;
}

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional layout',
    thumbnail: '/thumbnails/classic.png',
    component: ClassicTemplate,
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    thumbnail: '/thumbnails/modern.png',
    component: ModernTemplate,
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and elegant style',
    thumbnail: '/thumbnails/minimalist.png',
    component: MinimalistTemplate,
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Bold and executive appearance',
    thumbnail: '/thumbnails/professional.png',
    component: ProfessionalTemplate,
  },
};

export function getTemplateComponent(id: TemplateId): React.ComponentType<TemplateProps> {
  const def = TEMPLATE_REGISTRY[id] ?? TEMPLATE_REGISTRY.classic;
  return def.component;
}

export function getTemplatesList(): CVTemplate[] {
  return Object.values(TEMPLATE_REGISTRY).map(({ id, name, description, thumbnail }) => ({
    id,
    name,
    description,
    thumbnail,
  }));
}