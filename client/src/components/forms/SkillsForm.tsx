import { SkillEntry } from '../../types/resume';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsFormProps {
  skills: SkillEntry[];
  onChange: (skills: SkillEntry[]) => void;
}

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const handleAdd = () => {
    const newSkill: SkillEntry = {
      id: crypto.randomUUID(),
      resume_id: skills[0]?.resume_id || '',
      name: '',
      level: 'Intermediate',
      sort_order: skills.length,
    };
    onChange([...skills, newSkill]);
  };

  const handleRemove = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id));
  };

  const handleChange = (id: string, field: keyof SkillEntry, value: string) => {
    onChange(
      skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  return (
    <div className="form-container">
      <div className="grid grid-cols-1 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleChange(skill.id, 'name', e.target.value)}
                className="form-input"
                placeholder="e.g. JavaScript, Project Management"
              />
            </div>
            <div className="w-40">
              <select
                value={skill.level}
                onChange={(e) => handleChange(skill.id, 'level', e.target.value)}
                className="form-select"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleRemove(skill.id)}
              className="form-delete-btn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="form-add-btn"
      >
        <Plus className="w-5 h-5" />
        Add Skill
      </button>
    </div>
  );
}
