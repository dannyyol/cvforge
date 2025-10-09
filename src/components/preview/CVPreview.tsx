import { Grid, Grid2X2, Grid2X2Icon, Grid3x3, LayoutGrid, LayoutGridIcon, LucideEggFried, LucideGrape, LucideGrid2X2, LucideGrid3X3, LucideGripHorizontal, LucideGripVertical, LucideLayout, LucideLayoutGrid, LucideLayoutList, LucideLayoutPanelTop, LucideLayoutTemplate, Palette, Settings } from 'lucide-react';
import DownloadDropdown from '../DownloadDropdown';
import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection, TemplateId } from '../../types/resume';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalistTemplate from '../templates/MinimalistTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import PaginatedPreview from './PaginatedPreview';
import AIReviewPanel from '../AIReviewPanel';

interface CVPreviewProps {
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
  activeTab: 'preview' | 'ai-review';
  onTabChange: (tab: 'preview' | 'ai-review') => void;
  onOpenTemplateSelector: () => void;
  isMobilePreview?: boolean;
}

export default function CVPreview({ personalDetails, professionalSummary, workExperiences, educationEntries, skills, projects, certifications, sections, templateId, accentColor = 'slate', activeTab, onTabChange, onOpenTemplateSelector, isMobilePreview = false }: CVPreviewProps) {
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
    <div className="preview-page">
      <div className="preview-toolbar">
        <button
          onClick={onOpenTemplateSelector}
          className="preview-customize-btn"
        >
          <Palette className="w-4 h-4 preview-icon-muted" />
          <span className="text-sm font-medium text-neutral-700">Customise</span>
        </button>

        <div className="preview-tab-container">
          <button
            onClick={() => onTabChange('preview')}
            className={`preview-tab-btn preview-tab-btn--left ${activeTab === 'preview' ? 'preview-tab-btn--active' : 'preview-tab-btn--inactive'}`}
          >
            Preview
          </button>
          <div className="preview-tab-divider"></div>
          <button
            onClick={() => onTabChange('ai-review')}
            className={`preview-tab-btn preview-tab-btn--right ${activeTab === 'ai-review' ? 'preview-tab-btn--active' : 'preview-tab-btn--inactive'}`}
          >
            AI Review
          </button>
        </div>

        <div className="flex items-center gap-2">
          <DownloadDropdown className="preview-download-btn" />

          <button className="preview-settings-btn">
            <LucideLayoutGrid className="w-6 h-6 header-icon-muted" />
          </button>
        </div>
      </div>

      <div className={`preview-content ${isMobilePreview ? 'pb-16' : ''}`}>
        {activeTab === 'ai-review' ? (
          <AIReviewPanel overallScore={75} />
        ) : (
          <PaginatedPreview>
            {renderTemplate()}
          </PaginatedPreview>
        )}
      </div>

      {isMobilePreview && (
        <div className="preview-mobile-actions">
          <button
            onClick={onOpenTemplateSelector}
            className="preview-mobile-customize"
          >
            <Palette className="w-4 h-4 preview-icon-muted" />
            Customise
          </button>
          <DownloadDropdown variant="mobile" />
        </div>
      )}
    </div>
  );
}
