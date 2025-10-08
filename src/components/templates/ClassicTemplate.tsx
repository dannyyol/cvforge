import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../../types/resume';

interface ClassicTemplateProps {
  personalDetails: PersonalDetails | null;
  professionalSummary: ProfessionalSummary | null;
  workExperiences: WorkExperience[];
  educationEntries: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sections: CVSection[];
}

export default function ClassicTemplate({
  personalDetails,
  professionalSummary,
  workExperiences,
  educationEntries,
  skills,
  projects,
  certifications,
  sections,
}: ClassicTemplateProps) {
  const fullName = personalDetails
    ? `${personalDetails.first_name} ${personalDetails.last_name}`.trim()
    : '';

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <div className="border-b-2 border-gray-900 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {fullName || 'Your Name'}
            </h1>
            <p className="text-sm text-gray-600">
              {personalDetails?.email || 'your.email@example.com'}
            </p>
            {personalDetails?.phone && (
              <p className="text-sm text-gray-600">{personalDetails.phone}</p>
            )}
            {personalDetails?.job_title && (
              <p className="text-sm text-gray-700 font-medium mt-2">{personalDetails.job_title}</p>
            )}
          </div>
        );

      case 'summary':
        if (!professionalSummary?.content) return null;
        return (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {professionalSummary.content}
            </p>
          </div>
        );

      case 'experience':
        if (workExperiences.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Work Experience
            </h2>
            {workExperiences.map((exp, index) => (
              <div key={exp.id} className={index > 0 ? 'mt-4' : ''}>
                <p className="text-sm font-semibold text-gray-900">
                  {exp.job_title || 'Job Title'}
                </p>
                {exp.company && (
                  <p className="text-sm text-gray-700 mt-1">{exp.company}</p>
                )}
                {exp.location && (
                  <p className="text-sm text-gray-600">{exp.location}</p>
                )}
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (educationEntries.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Education
            </h2>
            {educationEntries.map((edu, index) => (
              <div key={edu.id} className={index > 0 ? 'mt-4' : ''}>
                <p className="text-sm font-semibold text-gray-900">
                  {edu.degree || 'Degree'}
                </p>
                {edu.institution && (
                  <p className="text-sm text-gray-700 mt-1">{edu.institution}</p>
                )}
                {edu.field_of_study && (
                  <p className="text-sm text-gray-600 mt-1">{edu.field_of_study}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="text-sm">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  {skill.level && (
                    <span className="text-gray-600 ml-1">({skill.level})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Projects
            </h2>
            {projects.map((project, index) => (
              <div key={project.id} className={index > 0 ? 'mt-4' : ''}>
                <p className="text-sm font-semibold text-gray-900">
                  {project.title || 'Project Title'}
                </p>
                {project.url && (
                  <p className="text-xs text-blue-600 mt-1">{project.url}</p>
                )}
                {project.description && (
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Certifications
            </h2>
            {certifications.map((cert, index) => (
              <div key={cert.id} className={index > 0 ? 'mt-4' : ''}>
                <p className="text-sm font-semibold text-gray-900">
                  {cert.name || 'Certification Name'}
                </p>
                {cert.issuer && (
                  <p className="text-sm text-gray-700 mt-1">{cert.issuer}</p>
                )}
                {cert.credential_id && (
                  <p className="text-xs text-gray-600 mt-1">ID: {cert.credential_id}</p>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <>
      {sortedSections.map((section) => {
        const content = renderSection(section.id);
        if (!content) return null;
        return (
          <div key={section.id} data-cv-section data-section-id={section.id}>
            {content}
          </div>
        );
      })}
    </>
  );
}
