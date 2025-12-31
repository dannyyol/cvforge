import React from 'react';
import { useCVStore } from '../../../store/useCVStore';
import { Plus, Trash2, ChevronDown, Briefcase, Building2, Calendar, MapPin } from 'lucide-react';
import { Input, Checkbox } from '../../ui/Form';
import { RichTextEditor } from '../../ui/RichTextEditor';
import type { WorkExperience } from '../../../types/resume';

const ExperienceItem = ({ experience, isOpen, onToggle }: { experience: WorkExperience; isOpen: boolean; onToggle: () => void }) => {
  const { updateExperience, removeExperience } = useCVStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateExperience(experience.id, { [name]: value });
  };

  const handleDescriptionChange = (value: string) => {
    updateExperience(experience.id, { description: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateExperience(experience.id, { current: e.target.checked });
  };

  return (
    <div className="item-card group">
      <div 
        className="item-header"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
            <div className="item-icon-container">
                <Briefcase className="w-4 h-4" />
            </div>
            <div>
                <div className="font-bold text-gray-800">{experience.position || 'New Position'}</div>
                <div className="text-sm text-gray-500 font-medium">{experience.company ? experience.company : 'Company'}</div>
            </div>
        </div>
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeExperience(experience.id);
                }}
                className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                title="Delete experience"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <div className={`text-gray-400 transition-transform duration-200 p-2 ${isOpen ? 'transform rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="item-content">
          <div className="form-grid-2">
             <Input
                label="Position"
                name="position"
                value={experience.position}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                icon={<Briefcase className="w-4 h-4" />}
             />
             <Input
                label="Company"
                name="company"
                value={experience.company}
                onChange={handleChange}
                placeholder="e.g. Tech Corp Inc."
                icon={<Building2 className="w-4 h-4" />}
             />
          </div>

          <Input
            label="Location"
            name="location"
            value={experience.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
            icon={<MapPin className="w-4 h-4" />}
          />

           <div className="form-grid-2">
             <Input
                label="Start Date"
                name="startDate"
                placeholder="MM/YYYY"
                value={experience.startDate}
                onChange={handleChange}
                icon={<Calendar className="w-4 h-4" />}
             />
             <Input
                label="End Date"
                name="endDate"
                placeholder="MM/YYYY"
                value={experience.endDate}
                onChange={handleChange}
                disabled={experience.current}
                icon={<Calendar className="w-4 h-4" />}
             />
          </div>
          
          <div className="flex items-center pt-1">
            <Checkbox
                id={`current-exp-${experience.id}`}
                checked={experience.current}
                onChange={handleCheckboxChange}
                label="I currently work here"
            />
          </div>
          
           <RichTextEditor
              label="Description"
              value={experience.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your responsibilities and achievements..."
            />
        </div>
      )}
    </div>
  );
};

export const ExperienceForm = () => {
    const { cvData, addExperience } = useCVStore();
    const [openId, setOpenId] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
                    <p className="text-sm text-gray-500">Add your professional experience.</p>
                 </div>
            </div>
            
            {cvData.workExperiences.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">No experience added yet</p>
                    <p className="text-sm text-gray-500 mb-4">Add your past work positions.</p>
                    <button 
                        onClick={() => addExperience()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Experience
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cvData.workExperiences.map((exp) => (
                        <ExperienceItem 
                            key={exp.id} 
                            experience={exp} 
                            isOpen={openId === exp.id}
                            onToggle={() => handleToggle(exp.id)}
                        />
                    ))}
                    
                    <button
                        onClick={() => addExperience()}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Another Position
                    </button>
                </div>
            )}
        </div>
    );
};
