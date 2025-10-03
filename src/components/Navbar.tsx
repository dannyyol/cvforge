import React from 'react';
import { Save, Eye, Download, FileText, Menu, Sparkles, EyeOff, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onSave: () => void;
  onPreview: () => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  isSaving?: boolean;
  lastSaved?: string;
  onToggleSidebar: () => void;
  onToggleRightPanel: () => void;
  onToggleFloatingPreview: () => void;
  showFloatingPreview: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSave,
  onPreview,
  onExportPDF,
  onExportDOCX,
  isSaving = false,
  lastSaved,
  onToggleSidebar,
  onToggleRightPanel,
  onToggleFloatingPreview,
  showFloatingPreview
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const [showPreviewMenu, setShowPreviewMenu] = React.useState(false);

  return (
    <nav className="h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-50 relative">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-secondary-700" />
        </button>
        <FileText className="w-6 h-6 text-primary-600" />
        <div>
          <h1 className="text-base md:text-lg font-semibold text-secondary-900">CV Builder</h1>
          {lastSaved && (
            <p className="text-xs text-secondary-500 hidden sm:block">Last saved: {lastSaved}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowPreviewMenu(!showPreviewMenu)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Preview</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showPreviewMenu && (
            <>
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setShowPreviewMenu(false)}
              />
              <div className="absolute left-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-xl z-[70] animate-slide-up">
                <button
                  onClick={() => {
                    onPreview();
                    setShowPreviewMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-t-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Full Preview
                </button>
                <button
                  onClick={() => {
                    onToggleFloatingPreview();
                    setShowPreviewMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-b-lg border-t border-secondary-100 transition-colors"
                >
                  {showFloatingPreview ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Live Preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show Live Preview
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-secondary-200 rounded-lg shadow-xl z-[70] animate-slide-up">
                <button
                  onClick={() => {
                    onExportPDF();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-t-lg transition-colors"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    onExportDOCX();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-b-lg border-t border-secondary-100 transition-colors"
                >
                  Export as DOCX
                </button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onToggleRightPanel}
          className="xl:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <Sparkles className="w-5 h-5 text-primary-600" />
        </button>
      </div>
    </nav>
  );
};
