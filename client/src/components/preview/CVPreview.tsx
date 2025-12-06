import { useState } from 'react';
import { Settings, Sun, Moon } from 'lucide-react';
import DownloadDropdown from '../DownloadDropdown';
import PaginatedPreview from './PaginatedPreview';
import { useTheme } from '../../theme/ThemeProvider';
import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection, Resume } from '../../types/resume';
import AIReviewPanel from '../AIReviewPanel';
import { getTemplateComponent, TemplateId } from '../templates/registry';

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
  const { theme, toggleTheme } = useTheme();

  // NEW: hold the generated PDF blob URL from RenderPreview
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isMenuVisible = isMobilePreview ? showMobileMenu : isMenuOpen;
  const toggleMenu = () => {
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

  // console.log('accentColor', accentColor);

  const renderTemplate = () => {
    const TemplateComponent = getTemplateComponent(templateId);
    return <TemplateComponent {...commonProps} />;
  };

  return (
    <div className="preview-page">
      <div className="preview-toolbar">
        <button
          onClick={onOpenTemplateSelector}
          className="preview-customize-btn"
        >
          <Settings className="w-4 h-4 preview-icon-muted" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Edit More</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="preview-theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`${theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}`}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          {/* Pass the URL down to the dropdown; templateId optional now */}
          <DownloadDropdown className="preview-download-btn" downloadUrl={pdfUrl ?? undefined} />
        </div>
      </div>

      <div className='m-2 flex justify-center self-center'>
        <div className="flex items-center bg-gray-200 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => onTabChange('preview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'preview'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100'
            }`}
          >
            CV Output
          </button>
          <button
            onClick={() => onTabChange('ai-review')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'ai-review'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100'
            }`}
          >
            AI Analysis
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto custom-scrollbar">
        <div className={`${activeTab === 'ai-review' ? 'ai-panel' : 'preview-content'} ${isMobilePreview ? 'pb-16' : ''}`}>
          {activeTab === 'ai-review' ? (
            <div className="ai-container">
              <AIReviewPanel overallScore={75} cvData={cvData} />
            </div>
          ) : (
            // Use HTML paginator for live CV preview
            <PaginatedPreview templateId={templateId} accentColor={accentColor}>
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
            <Settings className="w-4 h-4 preview-icon-muted" />
            Edit More
          </button>
          {/* Provide url for mobile dropdown too */}
          <DownloadDropdown variant="mobile" downloadUrl={pdfUrl ?? undefined} />
        </div>
      )}
    </div>
  );
}
