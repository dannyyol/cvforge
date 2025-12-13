import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../../types/resume';
import { getTemplateComponent, TemplateId } from '../templates/registry';
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
  accentColor = '#475569'
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
    const TemplateComponent = getTemplateComponent(templateId);
    return <TemplateComponent {...commonProps} />;
  };

  return (
    <div className="w-full h-screen bg-neutral-100 dark:bg-slate-900 flex flex-col items-center overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col items-center w-full min-h-full">
        <PaginatedPreview scaleMode="fill" templateId={templateId} accentColor={accentColor}>
          {renderTemplate()}
        </PaginatedPreview>
      </div>
    </div>
  );
}
