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

interface ClassicTemplateProps {
  sections: CVSection[];
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="text-center px-12 py-8 border-b-2 border-secondary-900">
      <h1 className="text-4xl font-serif font-bold mb-3 text-secondary-900">{content.fullName}</h1>
      <p className="text-lg text-secondary-700 mb-4">{content.title}</p>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-secondary-600">
        <span>{content.email}</span>
        <span>•</span>
        <span>{content.phone}</span>
        <span>•</span>
        <span>{content.location}</span>
        {content.linkedin && (
          <>
            <span>•</span>
            <span>{content.linkedin}</span>
          </>
        )}
        {content.github && (
          <>
            <span>•</span>
            <span>{content.github}</span>
          </>
        )}
        {content.website && (
          <>
            <span>•</span>
            <span>{content.website}</span>
          </>
        )}
      </div>
    </div>
  );

  const renderSummary = (content: SummaryContent) => (
    <div className="px-12 py-6">
      <p className="text-secondary-700 leading-relaxed text-justify">{content.text}</p>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-12 py-6">
      <h2 className="text-xl font-serif font-bold text-secondary-900 mb-4 pb-2 border-b border-secondary-300">
        PROFESSIONAL EXPERIENCE
      </h2>
      <div className="space-y-5">
        {content.map((exp) => (
          <div key={exp.id}>
            <div className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-secondary-900">{exp.position}</h3>
                <p className="text-secondary-600 text-sm">
                  {new Date(exp.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}{' '}
                  -{' '}
                  {exp.current
                    ? 'Present'
                    : new Date(exp.endDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                </p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-secondary-700 italic">{exp.company}</p>
                <p className="text-secondary-600 text-sm">{exp.location}</p>
              </div>
            </div>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-sm leading-relaxed">
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
    <div className="px-12 py-6">
      <h2 className="text-xl font-serif font-bold text-secondary-900 mb-4 pb-2 border-b border-secondary-300">
        EDUCATION
      </h2>
      <div className="space-y-4">
        {content.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-base font-bold text-secondary-900">{edu.institution}</h3>
              <p className="text-secondary-600 text-sm">
                {new Date(edu.startDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}{' '}
                -{' '}
                {new Date(edu.endDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="flex justify-between items-baseline">
              <p className="text-secondary-700 italic">
                {edu.degree} in {edu.field}
              </p>
              <p className="text-secondary-600 text-sm">{edu.location}</p>
            </div>
            {edu.gpa && (
              <p className="text-secondary-600 text-sm">GPA: {edu.gpa}</p>
            )}
            {edu.honors && edu.honors.length > 0 && (
              <p className="text-secondary-600 text-sm">Honors: {edu.honors.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-12 py-6">
      <h2 className="text-xl font-serif font-bold text-secondary-900 mb-4 pb-2 border-b border-secondary-300">
        SKILLS
      </h2>
      <div className="space-y-2">
        {content.map((category) => (
          <div key={category.id}>
            <p className="text-secondary-700 text-sm">
              <span className="font-bold">{category.category}:</span> {category.skills.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = (content: ProjectItem[]) => (
    <div className="px-12 py-6">
      <h2 className="text-xl font-serif font-bold text-secondary-900 mb-4 pb-2 border-b border-secondary-300">
        PROJECTS
      </h2>
      <div className="space-y-4">
        {content.map((project) => (
          <div key={project.id}>
            <h3 className="text-base font-bold text-secondary-900 mb-1">{project.name}</h3>
            <p className="text-secondary-700 text-sm mb-1 italic">{project.description}</p>
            <p className="text-secondary-600 text-xs mb-2">
              Technologies: {project.technologies.join(', ')}
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-sm leading-relaxed">
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
    <div className="px-12 py-6">
      <h2 className="text-xl font-serif font-bold text-secondary-900 mb-4 pb-2 border-b border-secondary-300">
        CERTIFICATIONS
      </h2>
      <div className="space-y-3">
        {content.map((cert) => (
          <div key={cert.id}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-base font-bold text-secondary-900">{cert.name}</h3>
              <p className="text-secondary-600 text-sm">
                {new Date(cert.date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <p className="text-secondary-700 text-sm italic">{cert.issuer}</p>
            {cert.credentialId && (
              <p className="text-secondary-600 text-xs">Credential ID: {cert.credentialId}</p>
            )}
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
