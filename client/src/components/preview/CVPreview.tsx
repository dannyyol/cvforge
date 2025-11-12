import { useState } from 'react';
import { Settings, Download as DownloadIcon, Sun, Moon } from 'lucide-react';
import DownloadDropdown from '../DownloadDropdown';
import RenderPreview from './RenderPreview';
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
            className="inline-flex items-center justify-center h-10 w-10 bg-transparent hover:bg-transparent text-neutral-600 dark:text-slate-200 hover:text-neutral-900 dark:hover:text-slate-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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

      <div className={`flex-1 relative ${activeTab === 'ai-review' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <div className={`${activeTab === 'ai-review' ? 'ai-panel' : 'preview-content'} ${isMobilePreview ? 'pb-16' : ''}`}>
          {activeTab === 'ai-review' ? (
            <div className="ai-container">
              <AIReviewPanel overallScore={75} cvData={cvData} />
            </div>
          ) : (
            <RenderPreview
              personalDetails={personalDetails}
              professionalSummary={professionalSummary}
              workExperiences={workExperiences}
              educationEntries={educationEntries}
              skills={skills}
              projects={projects}
              certifications={certifications}
              sections={sections}
              accentColor={accentColor}
              templateId={templateId}
              // NEW: capture the blob URL
              onPdfReady={setPdfUrl}
            />
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
