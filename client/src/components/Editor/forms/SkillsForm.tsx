import { useCVStore } from '../../../store/useCVStore';
import { Plus, X, Wrench, Code2 } from 'lucide-react';
import { Input } from '../../ui/Form';

export const SkillsForm = () => {
    const { cvData, addSkill, removeSkill, updateSkill } = useCVStore();

    return (
        <div className="skills-container">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                    <p className="text-sm text-gray-500">List your technical and soft skills.</p>
                 </div>
            </div>
            
            {cvData.skills.length === 0 ? (
                <div className="skills-empty-state">
                    <div className="skills-empty-icon">
                        <Wrench className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-900 mb-1 text-lg">No skills added yet</p>
                    <p className="text-sm text-gray-500 mb-6">Add skills to showcase your expertise.</p>
                    <button 
                        onClick={addSkill}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Add Skill
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cvData.skills.map((skill) => (
                            <div key={skill.id} className="skill-item group">
                                <Input
                                    value={skill.name}
                                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                                    placeholder="e.g. React, Leadership, Python"
                                    icon={<Code2 className="w-4 h-4" />}
                                    className="pr-10"
                                />
                                 <button
                                    onClick={() => removeSkill(skill.id)}
                                    className="skill-delete-btn"
                                    title="Remove skill"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <button
                        onClick={addSkill}
                        className="skill-add-btn"
                    >
                         <div className="skill-add-icon">
                            <Plus className="w-4 h-4" /> 
                        </div>
                        Add Another Skill
                    </button>
                </div>
            )}
        </div>
    );
};
