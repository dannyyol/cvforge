// module: templates registry
import React from 'react';
import {
  PersonalDetails,
  ProfessionalSummary,
  WorkExperience,
  EducationEntry,
  SkillEntry,
  ProjectEntry,
  CertificationEntry,
  CVSection,
} from '../../types/resume';

import Classic from './classic/Classic';
import Modern from './modern/Modern';
import Minimalist from './minimalist/Minimalist';
import Professional from './professional/Professional';

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

export interface TemplateDefinition {
  name: string;
  description: string;
  thumbnail: string;
  component: React.ComponentType<TemplateProps>;
  supportsAccent: boolean;
}

export type TemplateId = 'classic' | 'modern' | 'minimalist' | 'professional';

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  classic: {
    name: 'Classic',
    description: 'Traditional and professional layout',
    thumbnail: '/thumbnails/classic.png',
    component: Classic,
    supportsAccent: false,
  },
  modern: {
    name: 'Modern',
    description: 'Clean and contemporary design',
    thumbnail: '/thumbnails/modern.png',
    component: Modern,
    supportsAccent: true,
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Simple and elegant style',
    thumbnail: '/thumbnails/minimalist.png',
    component: Minimalist,
    supportsAccent: false,
  },
  professional: {
    name: 'Professional',
    description: 'Bold and executive appearance',
    thumbnail: '/thumbnails/professional.png',
    component: Professional,
    supportsAccent: true,
  },
};

export function getTemplateComponent(id: TemplateId): React.ComponentType<TemplateProps> {
  const def = TEMPLATE_REGISTRY[id] ?? TEMPLATE_REGISTRY.classic;
  return def.component;
}

export function getTemplatesList() {
  return Object.entries(TEMPLATE_REGISTRY).map(([id, def]) => ({
    id: id as TemplateId,
    name: def.name,
    description: def.description,
    thumbnail: def.thumbnail,
  }));
}