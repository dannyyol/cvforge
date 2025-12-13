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
import Legacy from './legacy/Legacy';
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

export type TemplateId = 'classic' | 'legacy' | 'professional';

export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  classic: {
    name: 'Classic',
    description: 'Traditional and professional layout',
    thumbnail: '/thumbnails/classic.png',
    component: Classic,
    supportsAccent: false,
  },
  legacy: {
    name: 'Legacy',
    description: 'Clean and contemporary design',
    thumbnail: '/thumbnails/legacy.png',
    component: Legacy,
    supportsAccent: true,
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