import { Download, Eye, FileText, Save } from 'lucide-react';
import React from 'react';

export const Navbar: React.FC = () => {

  return (
    <nav className="h-16 bg-surface-muted border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary-500" />
          <div>
            <h1 className="text-lg font-semibold text-gray-700">CV Forge</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <Save className="w-4 h-4" />
          {/* {isSaving ? 'Saving...' : 'Save'} */}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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

          
        </div>
        </div>
    </nav>
  );
};
