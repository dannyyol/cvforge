import { FileText } from 'lucide-react';
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
    </nav>
  );
};
