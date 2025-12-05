import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../../types/resume';
import { TemplateId } from '../templates/registry';
import Classic from '../templates/classic/Classic';
import Modern from '../templates/modern/Modern';
import Minimalist from '../templates/minimalist/Minimalist';
import Professional from '../templates/professional/Professional';
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
        return <Modern {...commonProps} />;
      case 'minimalist':
        return <Minimalist {...commonProps} />;
      case 'professional':
        return <Professional {...commonProps} />;
      case 'classic':
      default:
        return <Classic {...commonProps} />;
    }
  };

  return (
    <div className="w-full h-screen bg-neutral-100 dark:bg-slate-900 flex flex-col items-center overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col items-center w-full min-h-full">
        <PaginatedPreview scaleMode="fill" templateId={templateId}>
          {renderTemplate()}
        </PaginatedPreview>
      </div>
    </div>
  );
}
