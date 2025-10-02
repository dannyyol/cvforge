import React from 'react';
import type{
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

  const renderSummary = (content: SummaryContent) => (
    <div className="px-12 py-6 border-b border-gray-200">
      <p className="text-gray-700 leading-relaxed">{content.text}</p>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-12 py-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
        Experience
      </h2>
      <div className="space-y-5">
        {content.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-gray-700 font-medium">{exp.company}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">
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
                <p className="text-gray-500 text-sm">{exp.location}</p>
              </div>
            </div>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-gray-700 text-sm leading-relaxed">
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
    <div className="px-12 py-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
        Education
      </h2>
      <div className="space-y-4">
        {content.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{edu.institution}</h3>
                <p className="text-gray-700">
                  {edu.degree} in {edu.field}
                </p>
                {edu.gpa && (
                  <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <p className="text-gray-600 text-sm">{edu.honors.join(', ')}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">
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
                <p className="text-gray-500 text-sm">{edu.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-12 py-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
        Skills
      </h2>
      <div className="space-y-3">
        {content.map((category) => (
          <div key={category.id}>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {category.category}:
            </h3>
            <p className="text-gray-700 text-sm">{category.skills.join(' • ')}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = (content: ProjectItem[]) => (
    <div className="px-12 py-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
        Projects
      </h2>
      <div className="space-y-4">
        {content.map((project) => (
          <div key={project.id}>
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 text-sm mb-1">{project.description}</p>
              <p className="text-gray-600 text-xs">
                <span className="font-medium">Technologies:</span>{' '}
                {project.technologies.join(', ')}
              </p>
            </div>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-gray-700 text-sm leading-relaxed">
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
      <h2 className="text-2xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
        Certifications
      </h2>
      <div className="space-y-3">
        {content.map((cert) => (
          <div key={cert.id} className="flex justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">{cert.name}</h3>
              <p className="text-gray-700 text-sm">{cert.issuer}</p>
              {cert.credentialId && (
                <p className="text-gray-600 text-xs">ID: {cert.credentialId}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">
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
    <div className="min-h-[11in]">
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
          default:
            return null;
        }
      })}
    </div>
  );
};
