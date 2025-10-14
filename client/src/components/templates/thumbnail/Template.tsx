import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection, TemplateId } from '../../../types/resume';
import ClassicTemplate from '../ClassicTemplate';
import ModernTemplate from '../ModernTemplate';
import MinimalistTemplate from '../MinimalistTemplate';
import ProfessionalTemplate from '../ProfessionalTemplate';
import { sampleCVData } from '../../../data/sampleCVData';

const A4_UK = {
  width: 794,
  height: 1123,
  margin: 40,
};

function getSections(): CVSection[] {
  return [
    { id: 'header', title: 'Personal Details', isOpen: true, order: 0 },
    { id: 'summary', title: 'Professional Summary', isOpen: true, order: 1 },
    { id: 'experience', title: 'Work Experience', isOpen: true, order: 2 },
    { id: 'education', title: 'Education', isOpen: true, order: 3 },
    { id: 'skills', title: 'Skills', isOpen: true, order: 4 },
    { id: 'projects', title: 'Projects', isOpen: true, order: 5 },
    { id: 'certifications', title: 'Certifications', isOpen: true, order: 6 },
  ];
}

export default function Template() {
  const params = new URLSearchParams(window.location.search);
  const templateParam = (params.get('template') as TemplateId) || 'classic';
  const accent = params.get('accent') || 'slate';

  const commonProps: {
    personalDetails: PersonalDetails | null;
    professionalSummary: ProfessionalSummary | null;
    workExperiences: WorkExperience[];
    educationEntries: EducationEntry[];
    skills: SkillEntry[];
    projects: ProjectEntry[];
    certifications: CertificationEntry[];
    sections: CVSection[];
    accentColor?: string;
  } = {
    personalDetails: sampleCVData.personalDetails,
    professionalSummary: sampleCVData.professionalSummary,
    workExperiences: sampleCVData.workExperience,
    educationEntries: sampleCVData.education,
    skills: sampleCVData.skills,
    projects: sampleCVData.projects,
    certifications: sampleCVData.certifications,
    sections: getSections(),
    accentColor: accent,
  };

  const renderTemplate = () => {
    switch (templateParam) {
      case 'modern':
        return <ModernTemplate {...commonProps} />;
      case 'minimalist':
        return <MinimalistTemplate {...commonProps} />;
      case 'professional':
        return <ProfessionalTemplate {...commonProps} />;
      case 'classic':
      default:
        return <ClassicTemplate {...commonProps} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex items-center justify-center py-8">
      <div
        className="page bg-white"
        style={{
          width: `${A4_UK.width}px`,
          height: `${A4_UK.height}px`,
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <div
          className="page-inner cv-preview-container"
          style={{
            boxSizing: 'border-box',
            width: `${A4_UK.width}px`,
            height: `${A4_UK.height}px`,
            padding: `${A4_UK.margin}px`,
            overflow: 'hidden',
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}