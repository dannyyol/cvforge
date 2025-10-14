import { ReactNode, DragEvent } from 'react';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  children: ReactNode;
}

export default function DraggableSection({
  id,
  title,
  isOpen,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  children,
}: DraggableSectionProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 transition-shadow hover:shadow-md"
    >
      <div
        className="flex items-center gap-2 p-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={20} />
        </div>

        <div className="flex-1 flex items-center gap-2">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
