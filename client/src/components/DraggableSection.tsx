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
      className="bg-white rounded-xl shadow-sm border border-neutral-200 transition-all duration-300 hover:shadow-lg hover:border-neutral-300"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
      }}
    >
      <div
        className="flex items-center gap-3 p-6 cursor-pointer select-none group"
        onClick={onToggle}
      >
        <div
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 transition-colors duration-200 p-1 rounded-md hover:bg-neutral-100"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 flex items-center gap-3">
          <div className="text-neutral-600 group-hover:text-primary-600 transition-colors duration-200">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 group-hover:text-neutral-900 transition-colors duration-200">
            {title}
          </h3>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-neutral-200 pt-6 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
