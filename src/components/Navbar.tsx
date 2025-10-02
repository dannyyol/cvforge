import React from 'react';
import { Save, Eye, Download, FileText, Menu, Sparkles } from 'lucide-react';

interface NavbarProps {
  onSave: () => void;
  onPreview: () => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  isSaving?: boolean;
  lastSaved?: string;
  onToggleSidebar: () => void;
  onToggleRightPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSave,
  onPreview,
  onExportPDF,
  onExportDOCX,
  isSaving = false,
  lastSaved,
  onToggleSidebar,
  onToggleRightPanel
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  return (
    <nav className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <FileText className="w-6 h-6 text-primary-500" />
        <div>
          <h1 className="text-base md:text-lg font-semibold text-gray-900">CV Builder</h1>
          {lastSaved && (
            <p className="text-xs text-gray-500 hidden sm:block">Last saved: {lastSaved}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 bg-surface border border-gray-300 rounded-lg hover:bg-surface-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 bg-surface border border-gray-300 rounded-lg hover:bg-surface-muted transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden md:inline">Preview</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-surface bg-blue-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-surface border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={() => {
                    onExportPDF();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-surface-muted rounded-t-lg"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    onExportDOCX();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-surface-muted rounded-b-lg border-t border-gray-100"
                >
                  Export as DOCX
                </button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onToggleRightPanel}
          className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Sparkles className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    </nav>
  );
};
