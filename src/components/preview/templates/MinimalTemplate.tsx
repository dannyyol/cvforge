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

interface MinimalTemplateProps {
  sections: CVSection[];
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="px-16 py-10">
      <h1 className="text-5xl font-light mb-2 text-secondary-900 tracking-tight">{content.fullName}</h1>
      <p className="text-xl text-secondary-600 mb-6 font-light">{content.title}</p>

      <div className="flex flex-wrap gap-x-6 text-sm text-secondary-600 font-light">
        <span>{content.email}</span>
        <span>{content.phone}</span>
        <span>{content.location}</span>
        {content.linkedin && <span>{content.linkedin}</span>}
        {content.github && <span>{content.github}</span>}
        {content.website && <span>{content.website}</span>}
      </div>
    </div>
  );

  const renderSummary = (content: SummaryContent) => (
    <div className="px-16 py-6">
      <p className="text-secondary-700 leading-relaxed font-light">{content.text}</p>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-16 py-8">
      <h2 className="text-sm font-semibold text-secondary-900 mb-6 uppercase tracking-widest">
        Experience
      </h2>
      <div className="space-y-6">
        {content.map((exp) => (
          <div key={exp.id} className="grid grid-cols-4 gap-6">
            <div className="col-span-1 text-right">
              <p className="text-secondary-600 text-xs font-light">
                {new Date(exp.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
                {' — '}
                {exp.current
                  ? 'Present'
                  : new Date(exp.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
              </p>
            </div>
            <div className="col-span-3">
              <h3 className="text-base font-medium text-secondary-900 mb-1">{exp.position}</h3>
              <p className="text-secondary-700 text-sm font-light mb-3">
                {exp.company} • {exp.location}
              </p>
              <ul className="space-y-2">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="text-secondary-700 text-sm leading-relaxed font-light">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = (content: EducationItem[]) => (
    <div className="px-16 py-8">
      <h2 className="text-sm font-semibold text-secondary-900 mb-6 uppercase tracking-widest">
        Education
      </h2>
      <div className="space-y-6">
        {content.map((edu) => (
          <div key={edu.id} className="grid grid-cols-4 gap-6">
            <div className="col-span-1 text-right">
              <p className="text-secondary-600 text-xs font-light">
                {new Date(edu.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
                {' — '}
                {new Date(edu.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="col-span-3">
              <h3 className="text-base font-medium text-secondary-900 mb-1">{edu.institution}</h3>
              <p className="text-secondary-700 text-sm font-light mb-1">
                {edu.degree} in {edu.field}
              </p>
              <p className="text-secondary-600 text-sm font-light">{edu.location}</p>
              {edu.gpa && (
                <p className="text-secondary-600 text-sm font-light mt-1">GPA: {edu.gpa}</p>
              )}
              {edu.honors && edu.honors.length > 0 && (
                <p className="text-secondary-600 text-sm font-light mt-1">{edu.honors.join(', ')}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-16 py-8">
      <h2 className="text-sm font-semibold text-secondary-900 mb-6 uppercase tracking-widest">
        Skills
      </h2>
      <div className="space-y-3">
        {content.map((category) => (
          <div key={category.id} className="grid grid-cols-4 gap-6">
            <div className="col-span-1 text-right">
              <p className="text-secondary-600 text-sm font-light">{category.category}</p>
            </div>
            <div className="col-span-3">
              <p className="text-secondary-700 text-sm font-light">{category.skills.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = (content: ProjectItem[]) => (
    <div className="px-16 py-8">
      <h2 className="text-sm font-semibold text-secondary-900 mb-6 uppercase tracking-widest">
        Projects
      </h2>
      <div className="space-y-6">
        {content.map((project) => (
          <div key={project.id}>
            <h3 className="text-base font-medium text-secondary-900 mb-2">{project.name}</h3>
            <p className="text-secondary-700 text-sm font-light mb-2">{project.description}</p>
            <p className="text-secondary-600 text-xs font-light mb-3">
              {project.technologies.join(' • ')}
            </p>
            <ul className="space-y-2">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-sm leading-relaxed font-light">
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
    <div className="px-16 py-8">
      <h2 className="text-sm font-semibold text-secondary-900 mb-6 uppercase tracking-widest">
        Certifications
      </h2>
      <div className="space-y-4">
        {content.map((cert) => (
          <div key={cert.id} className="grid grid-cols-4 gap-6">
            <div className="col-span-1 text-right">
              <p className="text-secondary-600 text-xs font-light">
                {new Date(cert.date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="col-span-3">
              <h3 className="text-base font-medium text-secondary-900">{cert.name}</h3>
              <p className="text-secondary-700 text-sm font-light">{cert.issuer}</p>
              {cert.credentialId && (
                <p className="text-secondary-600 text-xs font-light">ID: {cert.credentialId}</p>
              )}
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
