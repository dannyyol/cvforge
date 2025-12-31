// module: templates registry
import React from 'react';
import type { 
  PersonalDetails,
  ProfessionalSummary,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  CVSection,
  TemplateProps,
  TemplateId
} from '../../../types/resume';

import Classic from './classic/Classic';
import Legacy from './legacy/Legacy';
import Professional from './professional/Professional';

export {
  type PersonalDetails,
  type ProfessionalSummary,
  type WorkExperience,
  type Education,
  type Skill,
  type Project,
  type Certification,
  type CVSection,
  type TemplateId,
  type TemplateProps
};

export interface TemplateDefinition {
  name: string;
  description: string;
  thumbnail: string;
  component: React.ComponentType<TemplateProps>;
  supportsAccent: boolean;
}

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
    supportsAccent: def.supportsAccent,
  }));
}

export function mapCVDataToTemplateProps(data: TemplateProps): TemplateProps {
  return {
    personalDetails: {
      fullName: data.personalDetails.fullName,
      email: data.personalDetails.email,
      phone: data.personalDetails.phone,
      address: data.personalDetails.address,
      jobTitle: data.personalDetails.jobTitle,
      website: data.personalDetails.website,
      linkedin: data.personalDetails.linkedin,
      github: data.personalDetails.github,
    },
    professionalSummary: {
      content: data.professionalSummary?.content,
    },
    workExperiences: data.workExperiences.map(exp => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
    })),
    education: data.education.map(edu => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      current: edu.current,
      description: edu.description,
    })),
    skills: data.skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level,
    })),
    projects: data.projects.map(proj => ({
      id: proj.id,
      name: proj.name,
      description: proj.description,
      technologies: proj.technologies,
      link: proj.link,
      startDate: proj.startDate,
      endDate: proj.endDate,
    })),
    certifications: data.certifications.map(cert => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      credentialId: cert.credentialId,
      link: cert.link,
    })),
    // awards: data.awards.map(award => ({
    //   id: award.id,
    //   title: award.title,
    //   issuer: award.issuer,
    //   date: award.date,
    //   description: award.description,
    // })),
    // publications: data.publications.map(pub => ({
    //   id: pub.id,
    //   title: pub.title,
    //   publisher: pub.publisher,
    //   date: pub.date,
    //   description: pub.description,
    //   link: pub.link,
    // })),
    sections: data.sections.map(sec => ({
      id: sec.id,
      type: sec.type,
      title: sec.title,
      isVisible: sec.isVisible,
      order: sec.order,
    })),
    theme: data.theme
  };
}