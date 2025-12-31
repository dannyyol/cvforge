import React, { useState } from 'react';
import { useCVStore } from '../store/useCVStore';
import { CVPreview } from '../components/Preview/CVPreview';
import { clsx } from 'clsx';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronUp, Eye, EyeOff, Edit3 } from 'lucide-react';
import { PersonalDetailsForm } from '../components/Editor/forms/PersonalDetailsForm';
import { SummaryForm } from '../components/Editor/forms/SummaryForm';
import { ExperienceForm } from '../components/Editor/forms/ExperienceForm';
import { EducationForm } from '../components/Editor/forms/EducationForm';
import { SkillsForm } from '../components/Editor/forms/SkillsForm';
import { ProjectsForm } from '../components/Editor/forms/ProjectsForm';
import { CertificationsForm } from '../components/Editor/forms/CertificationsForm';
import { AwardsForm } from '../components/Editor/forms/AwardsForm';
import { PublicationsForm } from '../components/Editor/forms/PublicationsForm';
import { AIAnalysis } from '../components/Editor/AIAnalysis';
import { ThemeSettingsForm } from '../components/Editor/forms/ThemeSettingsForm';
import type { CVSection as Section } from '../types/resume';
import DownloadDropdown from '../components/DownloadDropdown';

// Map section types to form components
const sectionForms: Record<string, React.FC> = {
  personal: PersonalDetailsForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
  awards: AwardsForm,
  publications: PublicationsForm,
};

const SortableSectionItem = ({ section, isOpen, onToggle }: { section: Section; isOpen: boolean; onToggle: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const { toggleSectionVisibility } = useCVStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const FormComponent = sectionForms[section.type];

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 transition-all duration-200 hover:shadow-md overflow-hidden group">
      <div className="flex items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
        <div {...attributes} {...listeners} className="cursor-move text-gray-300 hover:text-gray-500 mr-3 transition-colors outline-none p-1 rounded hover:bg-gray-100">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex-1 font-semibold text-gray-700 cursor-pointer select-none" onClick={onToggle}>
            {section.title}
        </div>
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={() => toggleSectionVisibility(section.id)}
                className="text-gray-400 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition-all duration-200"
                title={section.isVisible ? "Hide section" : "Show section"}
            >
                {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button 
                onClick={onToggle} 
                className="text-gray-400 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition-all duration-200"
            >
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="editor-section-content">
          {FormComponent ? <FormComponent /> : <p className="text-sm text-gray-500">Form not implemented for {section.type}</p>}
        </div>
      )}
    </div>
  );
};

export const EditorPage = () => {
  const { cvData, setSections } = useCVStore();
  const [openSectionId, setOpenSectionId] = useState<string | null>('personal');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cvData.sections.findIndex((s) => s.id === active.id);
      const newIndex = cvData.sections.findIndex((s) => s.id === over.id);

      setSections(arrayMove(cvData.sections, oldIndex, newIndex));
    }
  };

  const handleToggle = (id: string) => {
      setOpenSectionId(openSectionId === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col md:flex-row relative overflow-hidden">
      {/* Mobile Tab Switcher */}
      <div className="md:hidden bg-white border-b border-gray-200 p-2 flex gap-2 shrink-0 z-20 shadow-sm">
        <button 
          onClick={() => setActiveTab('editor')}
          className={clsx(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2",
            activeTab === 'editor' ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Edit3 className="w-4 h-4" />
          Editor
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={clsx(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2",
            activeTab === 'preview' ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Editor Panel */}
      <div className={clsx(
        "w-full md:w-1/2 lg:w-5/12 flex-1 md:h-full overflow-hidden flex flex-col border-r border-gray-200 bg-gray-50",
        activeTab === 'editor' ? 'flex' : 'hidden md:flex'
      )}>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Editor</h2>
              <p className="text-gray-600">Customize your CV content and layout.</p>
          </div>

          <AIAnalysis />

          <ThemeSettingsForm />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cvData.sections}
              strategy={verticalListSortingStrategy}
            >
              {cvData.sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isOpen={openSectionId === section.id}
                  onToggle={() => handleToggle(section.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Preview Panel */}
      <div className={clsx(
        "w-full md:w-1/2 lg:w-7/12 flex-1 md:h-full bg-gray-200 relative overflow-hidden flex flex-col",
        activeTab === 'preview' ? 'flex' : 'hidden md:flex'
      )}>
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10 shrink-0">
            <span className="font-medium text-gray-600">Live Preview</span>
            <div className="flex items-center gap-2">
                <DownloadDropdown />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-gray-200">
          <div className="min-h-full p-4 md:p-8 flex justify-center">
             <CVPreview />
          </div>
        </div>
      </div>
    </div>
  );
};
