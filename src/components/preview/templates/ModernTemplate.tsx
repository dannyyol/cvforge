import React from 'react';
import type {
  CVSection,
  HeaderContent,
  SummaryContent,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem
} from '../../../types/cv';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface ModernTemplateProps {
  sections: CVSection[];
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="bg-slate-800 text-white px-12 py-8">
      <h1 className="text-4xl font-bold mb-2">{content.fullName}</h1>
      <p className="text-xl text-slate-300 mb-4">{content.title}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span>{content.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span>{content.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{content.location}</span>
        </div>
        {content.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            <span>{content.linkedin}</span>
          </div>
        )}
        {content.github && (
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <span>{content.github}</span>
          </div>
        )}
        {content.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{content.website}</span>
          </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="min-h-[11in]">
      {sections.map((section) => {
        switch (section.type) {
          case 'header':
            return <div key={section.id}>{renderHeader(section.content)}</div>;
          default:
            return null;
        }
      })}
    </div>
  );
};
