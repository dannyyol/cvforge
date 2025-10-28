import { Menu, CreditCard as Edit2, ChevronDown, Sparkles, Grid3x3, Settings, LucideLayoutGrid } from 'lucide-react';
import DownloadDropdown from './DownloadDropdown';

interface HeaderProps {
  resumeTitle: string;
  language: string;
  cvScore: number;
  onTitleChange: (title: string) => void;
  onOpenTemplateSelector: () => void;
  activeTab: 'preview' | 'ai-review';
  onTabChange: (tab: 'preview' | 'ai-review') => void;
}

export default function Header({ resumeTitle, language, cvScore, onTitleChange, onOpenTemplateSelector, activeTab, onTabChange }: HeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-success-500';
    if (score >= 40) return 'bg-warning-500';
    return 'bg-error-500';
  };

  return (
    <header className="header">
      <div className="flex items-center gap-4">
        <button className="header-btn-icon">
          <Menu className="w-5 h-5 header-icon-muted" />
        </button>

        <span className="header-breadcrumb">Dashboard</span>
      </div>

      <div className="header-center">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={resumeTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="header-title-input"
          />
          <Edit2 className="header-edit-icon" />
        </div>

        <div className="header-lang">
          <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4 h-3" />
          <span>{language}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`${getScoreColor(cvScore)} header-score-pill`}>
            {cvScore}%
          </div>
          <span className="header-score-label">Your CV score</span>
        </div>

        <button className="header-improve-btn">
          <Sparkles className="w-4 h-4" />
          Improve CV
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="header-actions">
        <button
          onClick={onOpenTemplateSelector}
          className="header-customize-btn"
        >
          <Settings className="w-4 h-4" />
          Edit More
        </button>

        <div className="header-tabs">
          <button
            onClick={() => onTabChange('preview')}
            className={`header-tab-btn ${activeTab === 'preview' ? 'header-tab-btn--active' : 'header-tab-btn--inactive'}`}
          >
            Preview
          </button>
          <button
            onClick={() => onTabChange('ai-review')}
            className={`header-tab-btn ${activeTab === 'ai-review' ? 'header-tab-btn--active' : 'header-tab-btn--inactive'}`}
          >
            AI Review
          </button>
        </div>

        <DownloadDropdown className="header-download-btn" />

        <button className="header-settings-btn">
          <LucideLayoutGrid className="w-6 h-6 header-icon-muted" />
        </button>
      </div>
    </header>
  );
}
