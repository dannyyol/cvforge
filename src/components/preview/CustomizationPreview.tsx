import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection, TemplateId } from '../../types/resume';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalistTemplate from '../templates/MinimalistTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import PaginatedPreview from './PaginatedPreview';

interface CustomizationPreviewProps {
  personalDetails: PersonalDetails | null;
  professionalSummary: ProfessionalSummary | null;
  workExperiences: WorkExperience[];
  educationEntries: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sections: CVSection[];
  templateId: TemplateId;
  accentColor?: string;
}

export default function CustomizationPreview({
  personalDetails,
  professionalSummary,
  workExperiences,
  educationEntries,
  skills,
  projects,
  certifications,
  sections,
  templateId,
  accentColor = 'slate'
}: CustomizationPreviewProps) {
  const commonProps = {
    personalDetails,
    professionalSummary,
    workExperiences,
    educationEntries,
    skills,
    projects,
    certifications,
    sections,
    accentColor,
  };

  const renderTemplate = () => {
    switch (templateId) {
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
    <div className="w-full h-screen bg-neutral-100 flex flex-col items-center overflow-hidden">
      <div className="flex-1 flex flex-col items-center overflow-hidden w-full">
        <PaginatedPreview>
          {renderTemplate()}
        </PaginatedPreview>
      </div>
    </div>
  );
}
