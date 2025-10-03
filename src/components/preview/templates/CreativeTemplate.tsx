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

interface CreativeTemplateProps {
  sections: CVSection[];
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-12 py-10">
      <h1 className="text-5xl font-extrabold mb-3 tracking-tight">{content.fullName}</h1>
      <p className="text-2xl font-light mb-6 text-blue-100">{content.title}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
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
    <div className="px-12 py-6 bg-blue-50">
      <p className="text-secondary-700 leading-relaxed text-center font-light italic">{content.text}</p>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-12 py-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <div className="w-2 h-8 bg-blue-600 rounded"></div>
        Experience
      </h2>
      <div className="space-y-6">
        {content.map((exp) => (
          <div key={exp.id} className="relative pl-6 border-l-2 border-blue-200">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
            <div className="mb-2">
              <h3 className="text-lg font-bold text-secondary-900">{exp.position}</h3>
              <p className="text-blue-600 font-semibold">{exp.company}</p>
              <div className="flex gap-4 text-sm text-secondary-600 mt-1">
                <span>
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
                </span>
                <span>•</span>
                <span>{exp.location}</span>
              </div>
            </div>
            <ul className="space-y-2 mt-3">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-sm leading-relaxed flex gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = (content: EducationItem[]) => (
    <div className="px-12 py-6 bg-blue-50">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <div className="w-2 h-8 bg-blue-600 rounded"></div>
        Education
      </h2>
      <div className="space-y-5">
        {content.map((edu) => (
          <div key={edu.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
            <h3 className="text-lg font-bold text-secondary-900">{edu.institution}</h3>
            <p className="text-blue-600 font-semibold">
              {edu.degree} in {edu.field}
            </p>
            <div className="flex gap-4 text-sm text-secondary-600 mt-2">
              <span>
                {new Date(edu.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}{' '}
                -{' '}
                {new Date(edu.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <span>•</span>
              <span>{edu.location}</span>
            </div>
            {edu.gpa && (
              <p className="text-secondary-600 text-sm mt-1">GPA: {edu.gpa}</p>
            )}
            {edu.honors && edu.honors.length > 0 && (
              <p className="text-secondary-600 text-sm mt-1">{edu.honors.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-12 py-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <div className="w-2 h-8 bg-blue-600 rounded"></div>
        Skills
      </h2>
      <div className="space-y-4">
        {content.map((category) => (
          <div key={category.id} className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base font-bold text-blue-600 mb-2">{category.category}</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white text-secondary-700 text-sm rounded-full border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = (content: ProjectItem[]) => (
    <div className="px-12 py-6 bg-blue-50">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <div className="w-2 h-8 bg-blue-600 rounded"></div>
        Projects
      </h2>
      <div className="space-y-5">
        {content.map((project) => (
          <div key={project.id} className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-secondary-900 mb-2">{project.name}</h3>
            <p className="text-secondary-700 text-sm mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            <ul className="space-y-2">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-700 text-sm leading-relaxed flex gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>{bullet}</span>
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
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <div className="w-2 h-8 bg-blue-600 rounded"></div>
        Certifications
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {content.map((cert) => (
          <div key={cert.id} className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-base font-bold text-secondary-900 mb-1">{cert.name}</h3>
            <p className="text-blue-600 text-sm font-semibold">{cert.issuer}</p>
            <p className="text-secondary-600 text-xs mt-2">
              {new Date(cert.date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
            {cert.credentialId && (
              <p className="text-secondary-600 text-xs mt-1">ID: {cert.credentialId}</p>
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
