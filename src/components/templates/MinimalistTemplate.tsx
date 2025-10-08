import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../../types/resume';
import { renderWorkExperience, renderSkills, renderProjects, renderCertifications } from '../template-sections';

interface MinimalistTemplateProps {
  personalDetails: PersonalDetails | null;
  professionalSummary: ProfessionalSummary | null;
  workExperiences: WorkExperience[];
  educationEntries: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sections: CVSection[];
}

export default function MinimalistTemplate({
  personalDetails,
  professionalSummary,
  workExperiences,
  educationEntries,
  skills,
  projects,
  certifications,
  sections,
}: MinimalistTemplateProps) {
  const fullName = personalDetails
    ? `${personalDetails.first_name} ${personalDetails.last_name}`.trim()
    : '';

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <div className="mb-12">
            <h1 className="text-5xl font-light text-gray-900 mb-3">
              {fullName || 'Your Name'}
            </h1>
            {personalDetails?.job_title && (
              <p className="text-lg text-gray-600 mb-4">{personalDetails.job_title}</p>
            )}
            <div className="flex gap-6 text-sm text-gray-500">
              <span>{personalDetails?.email || 'your.email@example.com'}</span>
              {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            </div>
          </div>
        );

      case 'summary':
        if (!professionalSummary?.content) return null;
        return (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-loose whitespace-pre-wrap">
              {professionalSummary.content}
            </p>
          </div>
        );

      case 'experience':
        const experienceContent = renderWorkExperience(workExperiences);
        if (!experienceContent) return null;
        return (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Experience
            </h2>
            {experienceContent}
          </div>
        );

      case 'education':
        if (educationEntries.length === 0) return null;
        return (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Education
            </h2>
            {educationEntries.map((edu, index) => (
              <div key={edu.id} className={index > 0 ? 'mt-6' : ''}>
                <p className="text-sm font-medium text-gray-900">
                  {edu.degree || 'Degree'}
                </p>
                {edu.institution && (
                  <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                )}
                {edu.field_of_study && (
                  <p className="text-sm text-gray-500 mt-1">{edu.field_of_study}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 'skills':
        const skillsContent = renderSkills(skills);
        if (!skillsContent) return null;
        return (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Skills
            </h2>
            {skillsContent}
          </div>
        );

      case 'projects':
        const projectsContent = renderProjects(projects);
        if (!projectsContent) return null;
        return (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Projects
            </h2>
            {projectsContent}
          </div>
        );

      case 'certifications':
        const certificationsContent = renderCertifications(certifications);
        if (!certificationsContent) return null;
        return (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Certifications
            </h2>
            {certificationsContent}
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
