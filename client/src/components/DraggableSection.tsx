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
      className="draggable-card"
    >
      <div
        className="draggable-header group"
        onClick={onToggle}
      >
        <div
          className="draggable-grip"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 flex items-center gap-3">
          <div className="draggable-toggle-icon group-hover:text-primary-600">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          <h3 className="draggable-title group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
            {title}
          </h3>
        </div>
      </div>

      {isOpen && (
        <div className="draggable-content">
          {children}
        </div>
      )}
    </div>
  );
}
