import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../../types/resume';
import { renderWorkExperience, renderSkills, renderProjects, renderCertifications } from '../template-sections';
import { getColorClasses } from '../../utils/colorMapping';

interface ModernTemplateProps {
  personalDetails: PersonalDetails | null;
  professionalSummary: ProfessionalSummary | null;
  workExperiences: WorkExperience[];
  educationEntries: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sections: CVSection[];
  accentColor?: string;
}

export default function ModernTemplate({
  personalDetails,
  professionalSummary,
  workExperiences,
  educationEntries,
  skills,
  projects,
  certifications,
  sections,
  accentColor = 'slate',
}: ModernTemplateProps) {
  const fullName = personalDetails
    ? `${personalDetails.first_name} ${personalDetails.last_name}`.trim()
    : '';

  const colors = getColorClasses(accentColor);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'header':
        return (
          <div className={`bg-gradient-to-r ${colors.bg.gradient} text-white p-8 -mx-12 -mt-12 mb-8`}>
            <h1 className="text-4xl font-bold mb-2">
              {fullName || 'Your Name'}
            </h1>
            {personalDetails?.job_title && (
              <p className={`text-xl ${colors.text.secondary} mb-3`}>{personalDetails.job_title}</p>
            )}
            <div className={`flex flex-wrap gap-4 text-sm ${colors.text.secondary}`}>
              <span>{personalDetails?.email || 'your.email@example.com'}</span>
              {personalDetails?.phone && <span>{personalDetails.phone}</span>}
            </div>
          </div>
        );

      case 'summary':
        if (!professionalSummary?.content) return null;
        return (
          <div className="mb-8">
            <h2 className={`text-lg font-bold ${colors.text.primary} mb-3 pb-2 border-b-2 ${colors.border.secondary}`}>
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {professionalSummary.content}
            </p>
          </div>
        );

      case 'experience':
        const experienceContent = renderWorkExperience(workExperiences);
        if (!experienceContent) return null;
        return (
          <div className="mb-8">
            <h2 className={`text-lg font-bold ${colors.text.primary} mb-3 pb-2 border-b-2 ${colors.border.secondary}`}>
              Work Experience
            </h2>
            {experienceContent}
          </div>
        );

      case 'education':
        if (educationEntries.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className={`text-lg font-bold ${colors.text.primary} mb-3 pb-2 border-b-2 ${colors.border.secondary}`}>
              Education
            </h2>
            {educationEntries.map((edu, index) => (
              <div key={edu.id} className={index > 0 ? 'mt-4' : ''}>
                <p className="text-sm font-semibold text-gray-900">
                  {edu.degree || 'Degree'}
                </p>
                {edu.institution && (
                  <p className={`text-sm ${colors.text.primary} mt-1`}>{edu.institution}</p>
                )}
                {edu.field_of_study && (
                  <p className="text-sm text-gray-600 mt-1">{edu.field_of_study}</p>
                )}
              </div>
            ))}
          </div>
        );

      case 'skills':
        const skillsContent = renderSkills(skills);
        if (!skillsContent) return null;
        return (
          <div className="mb-8">
            <h2 className={`text-lg font-bold ${colors.text.primary} mb-3 pb-2 border-b-2 ${colors.border.secondary}`}>
              Skills
            </h2>
            {skillsContent}
          </div>
        );

      case 'projects':
        const projectsContent = renderProjects(projects);
        if (!projectsContent) return null;
        return (
          <div className="mb-8">
            <h2 className={`text-lg font-bold ${colors.text.primary} mb-3 pb-2 border-b-2 ${colors.border.secondary}`}>
              Projects
            </h2>
            {projectsContent}
          </div>
        );

      case 'certifications':
        const certificationsContent = renderCertifications(certifications);
        if (!certificationsContent) return null;
        return (
          <div className="mb-8">
            <h2 className={`text-lg font-bold ${colors.text.primary} mb-3 pb-2 border-b-2 ${colors.border.secondary}`}>
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
