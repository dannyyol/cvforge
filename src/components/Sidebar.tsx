import React from 'react';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { CVSection } from '../types/cv';

interface SidebarProps {
  sections: CVSection[];
  activeSection: string | null;
  onSectionClick: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string) => void;
  onReorderSections: (sections: CVSection[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  onSectionClick,
  onToggleVisibility,
  onReorderSections
}) => {
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === sectionId) return;

    const draggedIndex = sections.findIndex(s => s.id === draggedItem);
    const targetIndex = sections.findIndex(s => s.id === sectionId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    const reordered = newSections.map((section, index) => ({
      ...section,
      order: index
    }));

    onReorderSections(reordered);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="w-64 bg-surface border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">CV Sections</h2>
        <p className="text-xs text-gray-500 mt-1">Drag to reorder</p>
      </div>


    </div>
  );
};
