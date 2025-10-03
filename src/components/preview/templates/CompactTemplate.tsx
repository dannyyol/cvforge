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

interface CompactTemplateProps {
  sections: CVSection[];
}

export const CompactTemplate: React.FC<CompactTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="px-10 py-5 bg-secondary-900 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-1">{content.fullName}</h1>
          <p className="text-base text-secondary-300">{content.title}</p>
        </div>
        <div className="text-right text-xs space-y-0.5">
          <div>{content.email}</div>
          <div>{content.phone}</div>
          <div>{content.location}</div>
          {content.linkedin && <div>{content.linkedin}</div>}
          {content.github && <div>{content.github}</div>}
          {content.website && <div>{content.website}</div>}
        </div>
      </div>
    </div>
  );

  const renderSummary = (content: SummaryContent) => (
    <div className="px-10 py-4 border-b border-secondary-200">
      <p className="text-secondary-700 text-sm leading-relaxed">{content.text}</p>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-10 py-4 border-b border-secondary-200">
      <h2 className="text-base font-bold text-secondary-900 mb-3 uppercase">
        Experience
      </h2>
      <div className="space-y-4">
        {content.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-sm font-bold text-secondary-900">{exp.position}</h3>
              <p className="text-xs text-secondary-600">
                {new Date(exp.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}{' '}
                -{' '}
                {exp.current
                  ? 'Now'
                  : new Date(exp.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
              </p>
            </div>
            <p className="text-xs text-secondary-700 mb-1">
              {exp.company} • {exp.location}
            </p>
            <ul className="list-disc list-outside ml-4 space-y-0.5">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-xs leading-snug">
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
    <div className="px-10 py-4 border-b border-secondary-200">
      <h2 className="text-base font-bold text-secondary-900 mb-3 uppercase">
        Education
      </h2>
      <div className="space-y-3">
        {content.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-sm font-bold text-secondary-900">{edu.institution}</h3>
              <p className="text-xs text-secondary-600">
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
            </div>
            <p className="text-xs text-secondary-700">
              {edu.degree} in {edu.field}
              {edu.gpa && ` • GPA: ${edu.gpa}`}
            </p>
            {edu.honors && edu.honors.length > 0 && (
              <p className="text-xs text-secondary-600 mt-0.5">{edu.honors.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-10 py-4 border-b border-secondary-200">
      <h2 className="text-base font-bold text-secondary-900 mb-3 uppercase">
        Skills
      </h2>
      <div className="space-y-2">
        {content.map((category) => (
          <div key={category.id}>
            <p className="text-xs text-secondary-700">
              <span className="font-bold">{category.category}:</span> {category.skills.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = (content: ProjectItem[]) => (
    <div className="px-10 py-4 border-b border-secondary-200">
      <h2 className="text-base font-bold text-secondary-900 mb-3 uppercase">
        Projects
      </h2>
      <div className="space-y-3">
        {content.map((project) => (
          <div key={project.id}>
            <h3 className="text-sm font-bold text-secondary-900 mb-0.5">{project.name}</h3>
            <p className="text-xs text-secondary-700 mb-1">{project.description}</p>
            <p className="text-xs text-secondary-600 mb-1">
              {project.technologies.join(', ')}
            </p>
            <ul className="list-disc list-outside ml-4 space-y-0.5">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-xs leading-snug">
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
    <div className="px-10 py-4">
      <h2 className="text-base font-bold text-secondary-900 mb-3 uppercase">
        Certifications
      </h2>
      <div className="space-y-2">
        {content.map((cert) => (
          <div key={cert.id} className="flex justify-between items-baseline">
            <div>
              <h3 className="text-sm font-bold text-secondary-900">{cert.name}</h3>
              <p className="text-xs text-secondary-700">
                {cert.issuer}
                {cert.credentialId && ` • ID: ${cert.credentialId}`}
              </p>
            </div>
            <p className="text-xs text-secondary-600">
              {new Date(cert.date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </p>
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
