import { FileEdit, Eye, Sparkles, Settings, ArrowLeft } from 'lucide-react';

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
      <div className="flex flex-col">
        <div className="mobile-nav-top">
          <button
            onClick={onSettingsClick}
            className="mobile-nav-settings-btn"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 mobile-nav-icon-muted" />
          </button>
        </div>
        <div className="mobile-nav-tabs">
          <button
            onClick={() => onTabChange('editor')}
            className={`mobile-nav-tab-btn ${
              activeTab === 'editor'
                ? 'mobile-nav-tab-btn--active'
                : 'mobile-nav-tab-btn--inactive'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            Editor
          </button>
          <button
            onClick={() => onTabChange('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => onTabChange('ai-review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ai-review'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Review
          </button>
        </div>
      </div>
    </div>
  );
}
