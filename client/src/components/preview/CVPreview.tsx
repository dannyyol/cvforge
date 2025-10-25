import { useState } from 'react';
import { LucideLayoutGrid, Palette} from 'lucide-react';
import DownloadDropdown from '../DownloadDropdown';
import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection, TemplateId, Resume } from '../../types/resume';
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
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
  resumeMeta?: Partial<Resume>;
}

export default function CVPreview({ 
    personalDetails, professionalSummary, workExperiences, educationEntries, skills, projects, certifications, 
    sections, templateId, accentColor = 'slate', activeTab, onTabChange, onOpenTemplateSelector, 
    isMobilePreview = false, showMobileMenu = false, onMobileMenuToggle, resumeMeta 
  }: CVPreviewProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMenuVisible = isMobilePreview ? showMobileMenu : isMenuOpen;
  const handleMenuToggle = () => {
    if (isMobilePreview && onMobileMenuToggle) {
      onMobileMenuToggle();
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

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

  const cvData = {
    resume: resumeMeta ?? { id: personalDetails?.resume_id ?? workExperiences[0]?.resume_id ?? 'unknown' },
    sections: {
      personalDetails,
      professionalSummary,
      workExperiences,
      education: educationEntries,
      skills,
      projects,
      certifications,
    },
    templateId,
    accentColor,
    sectionStatus: sections,
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

          <button className="preview-settings-btn" onClick={handleMenuToggle}>
            <LucideLayoutGrid className="w-6 h-6 header-icon-muted" />
          </button>
        </div>
      </div>

      <div className={`flex-1 relative ${activeTab === 'ai-review' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <div className={`${activeTab === 'ai-review' ? '' : 'preview-content'} ${isMobilePreview ? 'pb-16' : ''}`}>
          {activeTab === 'ai-review' ? (
            <AIReviewPanel overallScore={75} cvData={cvData} />
          ) : (
            <PaginatedPreview>
              {renderTemplate()}
            </PaginatedPreview>
          )}
        </div>
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

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasArrow?: boolean;
  badge?: string;
  badgeColor?: 'blue' | 'gray';
}

function MenuItem({ icon, label, active = false, hasArrow = false, badge, badgeColor = 'gray' }: MenuItemProps) {
  return (
    <button
      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg mb-1 transition-colors ${
        active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-neutral-700' : 'text-neutral-400'}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              badgeColor === 'blue'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            {badge}
          </span>
        )}
        {hasArrow && <span className="text-neutral-400">›</span>}
      </div>
    </button>
  );
}
