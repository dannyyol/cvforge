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

interface ElegantTemplateProps {
  sections: CVSection[];
}

export const ElegantTemplate: React.FC<ElegantTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="text-center px-12 py-10 bg-gradient-to-b from-amber-50 to-white">
      <h1 className="text-5xl font-serif font-light mb-3 text-amber-900 tracking-wide">{content.fullName}</h1>
      <div className="w-20 h-0.5 bg-amber-600 mx-auto mb-4"></div>
      <p className="text-lg text-amber-800 mb-6 font-light italic">{content.title}</p>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-amber-700">
        <span>{content.email}</span>
        <span className="text-amber-400">|</span>
        <span>{content.phone}</span>
        <span className="text-amber-400">|</span>
        <span>{content.location}</span>
        {content.linkedin && (
          <>
            <span className="text-amber-400">|</span>
            <span>{content.linkedin}</span>
          </>
        )}
        {content.github && (
          <>
            <span className="text-amber-400">|</span>
            <span>{content.github}</span>
          </>
        )}
        {content.website && (
          <>
            <span className="text-amber-400">|</span>
            <span>{content.website}</span>
          </>
        )}
      </div>
    </div>
  );

  const renderSummary = (content: SummaryContent) => (
    <div className="px-12 py-6 text-center">
      <p className="text-secondary-700 leading-relaxed italic font-light max-w-3xl mx-auto">{content.text}</p>
      <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-6"></div>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-12 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-light text-amber-900 inline-block">
          Professional Experience
        </h2>
        <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2"></div>
      </div>
      <div className="space-y-7 max-w-4xl mx-auto">
        {content.map((exp) => (
          <div key={exp.id}>
            <div className="text-center mb-3">
              <h3 className="text-lg font-serif font-semibold text-secondary-900">{exp.position}</h3>
              <p className="text-amber-700 font-medium italic">{exp.company}</p>
              <p className="text-secondary-600 text-sm mt-1">
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
                {' • '}
                {exp.location}
              </p>
            </div>
            <ul className="space-y-2">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-sm leading-relaxed text-center">
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
    <div className="px-12 py-8 bg-amber-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-light text-amber-900 inline-block">
          Education
        </h2>
        <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2"></div>
      </div>
      <div className="space-y-6 max-w-4xl mx-auto">
        {content.map((edu) => (
          <div key={edu.id} className="text-center">
            <h3 className="text-lg font-serif font-semibold text-secondary-900">{edu.institution}</h3>
            <p className="text-amber-700 font-medium italic">
              {edu.degree} in {edu.field}
            </p>
            <p className="text-secondary-600 text-sm mt-1">
              {new Date(edu.startDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}{' '}
              -{' '}
              {new Date(edu.endDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
              {' • '}
              {edu.location}
            </p>
            {edu.gpa && (
              <p className="text-secondary-600 text-sm mt-1">GPA: {edu.gpa}</p>
            )}
            {edu.honors && edu.honors.length > 0 && (
              <p className="text-secondary-600 text-sm mt-1 italic">{edu.honors.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-12 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-light text-amber-900 inline-block">
          Expertise
        </h2>
        <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2"></div>
      </div>
      <div className="space-y-4 max-w-4xl mx-auto">
        {content.map((category) => (
          <div key={category.id} className="text-center">
            <h3 className="text-sm font-serif font-semibold text-amber-900 mb-2">
              {category.category}
            </h3>
            <p className="text-secondary-700 text-sm font-light">{category.skills.join(' • ')}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = (content: ProjectItem[]) => (
    <div className="px-12 py-8 bg-amber-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-light text-amber-900 inline-block">
          Notable Projects
        </h2>
        <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2"></div>
      </div>
      <div className="space-y-7 max-w-4xl mx-auto">
        {content.map((project) => (
          <div key={project.id}>
            <div className="text-center mb-3">
              <h3 className="text-lg font-serif font-semibold text-secondary-900">{project.name}</h3>
              <p className="text-secondary-700 text-sm font-light italic mt-1">{project.description}</p>
              <p className="text-amber-700 text-xs mt-2">{project.technologies.join(' • ')}</p>
            </div>
            <ul className="space-y-2">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-sm leading-relaxed text-center font-light">
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
    <div className="px-12 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-light text-amber-900 inline-block">
          Certifications
        </h2>
        <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2"></div>
      </div>
      <div className="space-y-5 max-w-4xl mx-auto">
        {content.map((cert) => (
          <div key={cert.id} className="text-center">
            <h3 className="text-base font-serif font-semibold text-secondary-900">{cert.name}</h3>
            <p className="text-amber-700 font-medium italic text-sm">{cert.issuer}</p>
            <p className="text-secondary-600 text-sm mt-1">
              {new Date(cert.date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
            {cert.credentialId && (
              <p className="text-secondary-600 text-xs mt-1">Credential: {cert.credentialId}</p>
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
