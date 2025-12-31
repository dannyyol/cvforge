import React from 'react';
import { useCVStore } from '../../../store/useCVStore';
import { Input, Checkbox } from '../../ui/Form';
import { RichTextEditor } from '../../ui/RichTextEditor';
import { Plus, Trash2, ChevronDown, GraduationCap, Calendar } from 'lucide-react';
import type { Education } from '../../../types/resume';

const EducationItem = ({ education, isOpen, onToggle }: { education: Education; isOpen: boolean; onToggle: () => void }) => {
  const { updateEducation, removeEducation } = useCVStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateEducation(education.id, { [name]: value });
  };

  const handleDescriptionChange = (value: string) => {
    updateEducation(education.id, { description: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateEducation(education.id, { current: e.target.checked });
  };

  return (
    <div className="item-card group">
      <div 
        className="item-header"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
             <div className="item-icon-container">
                <GraduationCap className="w-4 h-4" />
            </div>
            <div>
                <div className="font-bold text-gray-800">
                    {education.institution || 'New Education'}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    {education.degree ? education.degree : 'Degree'}
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeEducation(education.id);
                }}
                className="item-delete-btn"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <div className={`text-gray-400 p-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="item-content">
          <div className="form-grid-2">
             <Input
                label="Institution"
                name="institution"
                value={education.institution}
                onChange={handleChange}
                icon={<GraduationCap className="w-4 h-4" />}
                placeholder="e.g. University of Technology"
              />
             <Input
                label="Degree"
                name="degree"
                value={education.degree}
                onChange={handleChange}
                icon={<GraduationCap className="w-4 h-4" />}
                placeholder="e.g. Bachelor of Science"
              />
          </div>

          <Input
            label="Field of Study"
            name="fieldOfStudy"
            value={education.fieldOfStudy}
            onChange={handleChange}
            icon={<GraduationCap className="w-4 h-4" />}
            placeholder="e.g. Computer Science"
          />

           <div className="form-grid-2">
             <Input
                label="Start Date"
                name="startDate"
                placeholder="MM/YYYY"
                value={education.startDate}
                onChange={handleChange}
                icon={<Calendar className="w-4 h-4" />}
              />
             <Input
                label="End Date"
                name="endDate"
                placeholder="MM/YYYY"
                value={education.endDate}
                onChange={handleChange}
                disabled={education.current}
                icon={<Calendar className="w-4 h-4" />}
              />
          </div>
          <Checkbox
            label="I currently study here"
            checked={education.current}
            onChange={handleCheckboxChange}
          />
          
          <RichTextEditor
            label="Description"
            value={education.description}
            onChange={handleDescriptionChange}
            placeholder="Describe your studies, achievements, etc..."
          />
        </div>
      )}
    </div>
  );
};

export const EducationForm = () => {
    const { cvData, addEducation } = useCVStore();
    const [openId, setOpenId] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="form-container">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                    <p className="text-sm text-gray-500">Add your educational background.</p>
                 </div>
            </div>
            
            {cvData.education.length === 0 ? (
                 <div className="empty-state-dashed">
                    <div className="empty-state-icon-dashed">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-gray-900 mb-2 text-lg">No education added yet</p>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Add your educational background.</p>
                    <button 
                        onClick={() => addEducation()}
                        className="btn-cta-blue"
                    >
                        <Plus className="w-4 h-4" />
                        Add Education
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cvData.education.map((edu) => (
                        <EducationItem
                            key={edu.id}
                            education={edu}
                            isOpen={openId === edu.id}
                            onToggle={() => handleToggle(edu.id)}
                        />
                    ))}
                    
                    <button
                        onClick={() => addEducation()}
                        className="empty-state-add-btn group"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add Another Education
                    </button>
                </div>
            )}
        </div>
    );
};
