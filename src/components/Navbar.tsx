import { FileText } from 'lucide-react';
import React from 'react';

export const Navbar: React.FC = () => {

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">CV Builder</h1>
          </div>
        </div>
    </nav>
  );
};
