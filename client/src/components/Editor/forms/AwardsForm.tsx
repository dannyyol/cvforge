import React from 'react';
import { useCVStore } from '../../../store/useCVStore';
import { Plus, Trash2, ChevronDown, Award, Building, Calendar } from 'lucide-react';
import { Input } from '../../ui/Form';
import { RichTextEditor } from '../../ui/RichTextEditor';
import type { Award as AwardType } from '../../../types/resume';

const AwardItem = ({ award, isOpen, onToggle }: { award: AwardType; isOpen: boolean; onToggle: () => void }) => {
  const { updateAward, removeAward } = useCVStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateAward(award.id, { [name]: value });
  };

  const handleDescriptionChange = (value: string) => {
    updateAward(award.id, { description: value });
  };

  return (
    <div className="item-card group">
      <div 
        className="item-header"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
            <div className="item-icon-container">
                <Award className="w-4 h-4" />
            </div>
            <div>
                <div className="font-bold text-gray-800">{award.title || 'New Award'}</div>
                <div className="text-sm text-gray-500 font-medium">{award.issuer ? award.issuer : 'Issuer'}</div>
            </div>
        </div>
        <div className="item-controls">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeAward(award.id);
                }}
                className="item-delete-btn"
                title="Delete award"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <div className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="item-content">
          <div className="form-grid-2">
             <Input
                label="Award Title"
                name="title"
                value={award.title}
                onChange={handleChange}
                placeholder="e.g. Employee of the Year"
                icon={<Award className="w-4 h-4" />}
             />
             <Input
                label="Issuer"
                name="issuer"
                value={award.issuer}
                onChange={handleChange}
                placeholder="e.g. Company Inc."
                icon={<Building className="w-4 h-4" />}
             />
          </div>
          
           <Input
              label="Date"
              name="date"
              value={award.date}
              onChange={handleChange}
              placeholder="e.g. 2023"
              icon={<Calendar className="w-4 h-4" />}
           />
           
           <RichTextEditor
              label="Description"
              value={award.description}
              onChange={handleDescriptionChange}
              placeholder="Describe the award and its significance..."
            />
        </div>
      )}
    </div>
  );
};

export const AwardsForm = () => {
    const { cvData, addAward } = useCVStore();
    const [openId, setOpenId] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Awards</h3>
                    <p className="text-sm text-gray-500">Highlight your achievements and recognition.</p>
                 </div>
            </div>
            
            {cvData.awards.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">No awards added yet</p>
                    <p className="text-sm text-gray-500 mb-4">Add awards to showcase your excellence.</p>
                    <button 
                        onClick={() => addAward()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Award
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cvData.awards.map((award) => (
                        <AwardItem
                            key={award.id}
                            award={award}
                            isOpen={openId === award.id}
                            onToggle={() => handleToggle(award.id)}
                        />
                    ))}
                    
                    <button
                        onClick={() => addAward()}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Another Award
                    </button>
                </div>
            )}
        </div>
    );
};
