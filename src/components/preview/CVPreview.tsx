import React from 'react';
import type { CVSection } from '../../types/cv';
import { ModernTemplate } from './templates/ModernTemplate';

interface CVPreviewProps {
  sections: CVSection[];
  template: string;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ sections, template }) => {
  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="bg-gray-100 p-8 overflow-y-auto">
      <div className="max-w-[8.5in] mx-auto bg-white shadow-lg">
      </div>
    </div>
  );
};
