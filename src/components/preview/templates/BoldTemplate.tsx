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

interface BoldTemplateProps {
  sections: CVSection[];
}

export const BoldTemplate: React.FC<BoldTemplateProps> = ({ sections }) => {
  const renderHeader = (content: HeaderContent) => (
    <div className="bg-black text-white px-12 py-10">
      <h1 className="text-6xl font-black mb-4 uppercase tracking-tight">{content.fullName}</h1>
      <p className="text-2xl font-bold text-yellow-400 mb-6 uppercase tracking-wide">{content.title}</p>

      <div className="grid grid-cols-2 gap-4 text-sm font-medium">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-yellow-400" />
          <span>{content.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-yellow-400" />
          <span>{content.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-yellow-400" />
          <span>{content.location}</span>
        </div>
        {content.linkedin && (
          <div className="flex items-center gap-3">
            <Linkedin className="w-5 h-5 text-yellow-400" />
            <span>{content.linkedin}</span>
          </div>
        )}
        {content.github && (
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-yellow-400" />
            <span>{content.github}</span>
          </div>
        )}
        {content.website && (
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-yellow-400" />
            <span>{content.website}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderSummary = (content: SummaryContent) => (
    <div className="px-12 py-6 bg-yellow-50">
      <p className="text-secondary-900 leading-relaxed font-semibold text-center text-lg">{content.text}</p>
    </div>
  );

  const renderExperience = (content: ExperienceItem[]) => (
    <div className="px-12 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">
          Experience
        </h2>
        <div className="flex-1 h-1 bg-yellow-400"></div>
      </div>
      <div className="space-y-6">
        {content.map((exp) => (
          <div key={exp.id} className="border-l-4 border-black pl-6">
            <div className="mb-2">
              <h3 className="text-xl font-black text-black uppercase">{exp.position}</h3>
              <p className="text-lg font-bold text-yellow-600">{exp.company}</p>
              <p className="text-sm font-semibold text-secondary-600 mt-1">
                {new Date(exp.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}{' '}
                -{' '}
                {exp.current
                  ? 'PRESENT'
                  : new Date(exp.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                {' | '}
                {exp.location}
              </p>
            </div>
            <ul className="space-y-2 mt-3">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-800 text-sm leading-relaxed font-medium flex gap-3">
                  <span className="text-yellow-500 font-black text-lg">▸</span>
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
    <div className="px-12 py-8 bg-secondary-50">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">
          Education
        </h2>
        <div className="flex-1 h-1 bg-yellow-400"></div>
      </div>
      <div className="space-y-5">
        {content.map((edu) => (
          <div key={edu.id} className="bg-white p-5 border-l-4 border-yellow-400 shadow-md">
            <h3 className="text-xl font-black text-black uppercase">{edu.institution}</h3>
            <p className="text-lg font-bold text-secondary-800">
              {edu.degree} in {edu.field}
            </p>
            <p className="text-sm font-semibold text-secondary-600 mt-1">
              {new Date(edu.startDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}{' '}
              -{' '}
              {new Date(edu.endDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
              {' | '}
              {edu.location}
            </p>
            {edu.gpa && (
              <p className="text-sm font-bold text-secondary-700 mt-2">GPA: {edu.gpa}</p>
            )}
            {edu.honors && edu.honors.length > 0 && (
              <p className="text-sm font-semibold text-secondary-700 mt-1">{edu.honors.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = (content: SkillCategory[]) => (
    <div className="px-12 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">
          Skills
        </h2>
        <div className="flex-1 h-1 bg-yellow-400"></div>
      </div>
      <div className="space-y-4">
        {content.map((category) => (
          <div key={category.id} className="bg-yellow-50 p-4 border-l-4 border-black">
            <h3 className="text-base font-black text-black uppercase mb-2">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-black text-white text-sm font-bold uppercase"
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
    <div className="px-12 py-8 bg-secondary-50">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">
          Projects
        </h2>
        <div className="flex-1 h-1 bg-yellow-400"></div>
      </div>
      <div className="space-y-6">
        {content.map((project) => (
          <div key={project.id} className="bg-white p-5 shadow-md">
            <h3 className="text-xl font-black text-black uppercase mb-2">{project.name}</h3>
            <p className="text-secondary-800 text-sm font-semibold mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
            <ul className="space-y-2">
              {project.bullets.map((bullet, idx) => (
                <li key={idx} className="text-secondary-800 text-sm leading-relaxed font-medium flex gap-3">
                  <span className="text-yellow-500 font-black text-lg">▸</span>
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
    <div className="px-12 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">
          Certifications
        </h2>
        <div className="flex-1 h-1 bg-yellow-400"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {content.map((cert) => (
          <div key={cert.id} className="bg-yellow-50 p-4 border-l-4 border-black">
            <h3 className="text-base font-black text-black uppercase mb-1">{cert.name}</h3>
            <p className="text-sm font-bold text-secondary-800">{cert.issuer}</p>
            <p className="text-xs font-semibold text-secondary-600 mt-2">
              {new Date(cert.date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </p>
            {cert.credentialId && (
              <p className="text-xs font-semibold text-secondary-600 mt-1">ID: {cert.credentialId}</p>
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
