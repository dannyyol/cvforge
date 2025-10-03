import React from 'react';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';
import type { CVSection } from '../types/cv';
import { CVPreview } from './preview/CVPreview';

interface FloatingPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  sections: CVSection[];
  template: string;
}

export const FloatingPreview: React.FC<FloatingPreviewProps> = ({
  isOpen,
  onClose,
  sections,
  template
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - (isExpanded ? 500 : 280), e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - (isExpanded ? 680 : 360), e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset, isExpanded]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-secondary-300 flex flex-col overflow-hidden animate-slide-up"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isExpanded ? '500px' : '280px',
        height: isExpanded ? '680px' : '360px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="drag-handle flex items-center justify-between px-3 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white cursor-grab active:cursor-grabbing shadow-md">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4" />
          <span className="text-sm font-medium">Live Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-primary-500 rounded transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-primary-500 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-secondary-100 p-2">
        <div
          className="bg-white shadow-sm origin-top-left"
          style={{
            transform: isExpanded ? 'scale(0.58)' : 'scale(0.32)',
            width: isExpanded ? '172%' : '312%',
            transformOrigin: 'top left'
          }}
        >
          <CVPreview sections={sections} template={template} />
        </div>
      </div>

      <div className="px-3 py-2 bg-secondary-50 border-t border-secondary-200 text-xs text-secondary-600 text-center">
        Drag to move • Click expand to see more
      </div>
    </div>
  );
};
