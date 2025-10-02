import React from 'react';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import type { CVSection } from '../types/cv';

interface SidebarProps {
  sections: CVSection[];
  activeSection: string | null;
  onSectionClick: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string) => void;
  onReorderSections: (sections: CVSection[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  onSectionClick,
  onToggleVisibility,
  onReorderSections,
  isOpen,
  onClose
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

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed lg:relative
          w-64 bg-white border-r border-gray-200 flex flex-col h-full
          z-30 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">CV Sections</h2>
        <p className="text-xs text-gray-500 mt-1">Drag to reorder</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragOver={(e) => handleDragOver(e, section.id)}
            onDragEnd={handleDragEnd}
            onClick={() => handleSectionClick(section.id)}
            className={`
              flex items-center gap-2 px-4 py-3 cursor-pointer border-b border-gray-100
              transition-colors
              ${activeSection === section.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}
              ${draggedItem === section.id ? 'opacity-50' : ''}
            `}
          >
            <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

            <span className={`flex-1 text-sm font-medium ${section.visible ? 'text-gray-900' : 'text-gray-400'}`}>
              {section.title}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(section.id);
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {section.visible ? (
                <Eye className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};
