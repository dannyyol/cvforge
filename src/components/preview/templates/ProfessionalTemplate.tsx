import React from 'react';
import {
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

interface ProfessionalTemplateProps {
  sections: CVSection[];
}

export const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="px-12 py-8 bg-slate-50 border-b-4 border-slate-700">
      <h1 className="text-4xl font-bold mb-2 text-slate-900">{content.fullName}</h1>
      <p className="text-xl text-slate-700 mb-4 font-medium">{content.title}</p>

      <div className="grid grid-cols-3 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-500" />
          <span>{content.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-500" />
          <span>{content.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span>{content.location}</span>
        </div>
        {content.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-slate-500" />
            <span>{content.linkedin}</span>
          </div>
        )}
        {content.github && (
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-500" />
            <span>{content.github}</span>
          </div>
        )}
        {content.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <span>{content.website}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderSummary = (content: SummaryContent) => (
    <div className="px-12 py-6 bg-white">
      <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-wide border-l-4 border-slate-700 pl-3">
        Professional Summary
      </h2>
      <p className="text-slate-700 leading-relaxed pl-3">{content.text}</p>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-12 py-6 bg-slate-50">
      <h2 className="text-lg font-bold text-slate-900 mb-5 uppercase tracking-wide border-l-4 border-slate-700 pl-3">
        Professional Experience
      </h2>
      <div className="space-y-6 pl-3">
        {content.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                <p className="text-slate-700 font-semibold">{exp.company}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-600 text-sm font-medium">
                  {new Date(exp.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}{' '}
                  -{' '}
                  {exp.current
                    ? 'Present'
                    : new Date(exp.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                </p>
                <p className="text-slate-500 text-sm">{exp.location}</p>
              </div>
            </div>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-slate-700 text-sm leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = (content: EducationItem[]) => (
    <div className="px-12 py-6 bg-white">
      <h2 className="text-lg font-bold text-slate-900 mb-5 uppercase tracking-wide border-l-4 border-slate-700 pl-3">
        Education
      </h2>
      <div className="space-y-4 pl-3">
        {content.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">{edu.institution}</h3>
                <p className="text-slate-700 font-medium">
                  {edu.degree} in {edu.field}
                </p>
                {edu.gpa && (
                  <p className="text-slate-600 text-sm">GPA: {edu.gpa}</p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-slate-600 text-sm">{edu.honors.join(', ')}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-slate-600 text-sm font-medium">
                  {new Date(edu.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}{' '}
                  -{' '}
                  {new Date(edu.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-slate-500 text-sm">{edu.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-12 py-6 bg-slate-50">
      <h2 className="text-lg font-bold text-slate-900 mb-5 uppercase tracking-wide border-l-4 border-slate-700 pl-3">
        Core Competencies
      </h2>
      <div className="space-y-3 pl-3">
        {content.map((category) => (
          <div key={category.id}>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {category.category}
            </h3>
            <p className="text-slate-700 text-sm">{category.skills.join(' | ')}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = (content: ProjectItem[]) => (
    <div className="px-12 py-6 bg-white">
      <h2 className="text-lg font-bold text-slate-900 mb-5 uppercase tracking-wide border-l-4 border-slate-700 pl-3">
        Key Projects
      </h2>
      <div className="space-y-5 pl-3">
        {content.map((project) => (
          <div key={project.id}>
            <h3 className="text-base font-bold text-slate-900 mb-1">{project.name}</h3>
            <p className="text-slate-700 text-sm mb-2">{project.description}</p>
            <p className="text-slate-600 text-xs mb-2">
              <span className="font-semibold">Tech Stack:</span> {project.technologies.join(', ')}
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-slate-700 text-sm leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = (content: CertificationItem[]) => (
    <div className="px-12 py-6 bg-slate-50">
      <h2 className="text-lg font-bold text-slate-900 mb-5 uppercase tracking-wide border-l-4 border-slate-700 pl-3">
        Certifications
      </h2>
      <div className="space-y-3 pl-3">
        {content.map((cert) => (
          <div key={cert.id} className="flex justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">{cert.name}</h3>
              <p className="text-slate-700 text-sm font-medium">{cert.issuer}</p>
              {cert.credentialId && (
                <p className="text-slate-600 text-xs">Credential: {cert.credentialId}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-slate-600 text-sm font-medium">
                {new Date(cert.date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[11in] bg-white">
      {sections.map((section) => {
        switch (section.type) {
          case 'header':
            return <div key={section.id}>{renderHeader(section.content)}</div>;
          case 'summary':
            return <div key={section.id}>{renderSummary(section.content)}</div>;
          case 'experience':
            return <div key={section.id}>{renderExperience(section.content)}</div>;
          case 'education':
            return <div key={section.id}>{renderEducation(section.content)}</div>;
          case 'skills':
            return <div key={section.id}>{renderSkills(section.content)}</div>;
          case 'projects':
            return <div key={section.id}>{renderProjects(section.content)}</div>;
          case 'certifications':
            return <div key={section.id}>{renderCertifications(section.content)}</div>;
          default:
            return null;
        }
      })}
    </div>
  );
};
