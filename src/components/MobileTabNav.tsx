import { FileEdit, Eye, Sparkles, Settings, ArrowLeft, LayoutGrid } from 'lucide-react';

interface MobileTabNavProps {
  activeTab: 'editor' | 'preview' | 'ai-review';
  onTabChange: (tab: 'editor' | 'preview' | 'ai-review') => void;
  onSettingsClick: () => void;
  isCustomizing?: boolean;
  onBackToEdit?: () => void;
}

export default function MobileTabNav({ activeTab, onTabChange, onSettingsClick, isCustomizing, onBackToEdit }: MobileTabNavProps) {
  if (isCustomizing) {
    return (
      <div className="mobile-nav">
        <div className="mobile-nav-back-container">
          <button
            onClick={onBackToEdit}
            className="mobile-nav-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Edit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-content">
        <div className="mobile-nav-pill-group">
          <button
            onClick={() => onTabChange('editor')}
            className={`mobile-nav-pill-btn ${
              activeTab === 'editor'
                ? 'mobile-nav-pill-btn--active'
                : 'mobile-nav-pill-btn--inactive'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => onTabChange('preview')}
            className={`mobile-nav-pill-btn ${
              activeTab === 'preview'
                ? 'mobile-nav-pill-btn--active'
                : 'mobile-nav-pill-btn--inactive'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => onTabChange('ai-review')}
            className={`mobile-nav-pill-btn ${
              activeTab === 'ai-review'
                ? 'mobile-nav-pill-btn--active'
                : 'mobile-nav-pill-btn--inactive'
            }`}
          >
            AI Review
          </button>
        </div>
        <button
          onClick={onSettingsClick}
          className="mobile-nav-settings-icon"
          aria-label="Menu"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
