import { Download, Eye, FileText, Save } from 'lucide-react';
import React from 'react';

interface NavbarProps {
  onSave: () => void;
  onPreview: () => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  isSaving?: boolean;
  lastSaved?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSave,
  onPreview,
  onExportPDF,
  onExportDOCX,
  isSaving = false,
  lastSaved
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  return (
    <nav className="h-16 bg-surface-muted border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-primary-500" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">CV Forge</h1>
          {lastSaved && (
            <p className="text-xs text-gray-500">Last saved: {lastSaved}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        <button onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  Export as PDF
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg border-t border-gray-100"
                >
                  Export as DOCX
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
