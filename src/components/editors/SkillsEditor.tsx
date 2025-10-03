import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { SkillCategory } from '../../types/cv';

interface SkillsEditorProps {
  content: SkillCategory[];
  onChange: (content: SkillCategory[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ content, onChange }) => {
  const [newSkill, setNewSkill] = React.useState<{ [key: string]: string }>({});

  const addCategory = () => {
    const newCategory: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: '',
      skills: []
    };
    onChange([...content, newCategory]);
  };

  const updateCategory = (id: string, field: keyof SkillCategory, value: any) => {
    onChange(
      content.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteCategory = (id: string) => {
    onChange(content.filter((item) => item.id !== id));
  };

  const addSkill = (categoryId: string) => {
    const skill = newSkill[categoryId]?.trim();
    if (!skill) return;

    onChange(
      content.map((item) =>
        item.id === categoryId
          ? { ...item, skills: [...item.skills, skill] }
          : item
      )
    );
    setNewSkill({ ...newSkill, [categoryId]: '' });
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    onChange(
      content.map((item) =>
        item.id === categoryId
          ? { ...item, skills: item.skills.filter((_, i) => i !== skillIndex) }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {content.map((category) => (
        <div key={category.id} className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
          <div className="flex items-center justify-between mb-3">
            <input
              type="text"
              value={category.category}
              onChange={(e) => updateCategory(category.id, 'category', e.target.value)}
              placeholder="Category Name (e.g., Technical Skills)"
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={() => deleteCategory(category.id)}
              className="ml-3 text-error-600 hover:text-error-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {category.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(category.id, idx)}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill[category.id] || ''}
              onChange={(e) => setNewSkill({ ...newSkill, [category.id]: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(category.id);
                }
              }}
              placeholder="Add a skill and press Enter"
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={() => addSkill(category.id)}
              className="px-3 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addCategory}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Skill Category
      </button>
    </div>
  );
};
