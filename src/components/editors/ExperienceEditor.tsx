import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ExperienceItem } from '../../types/cv';

interface ExperienceEditorProps {
  content: ExperienceItem[];
  onChange: (content: ExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ content, onChange }) => {
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['']
    };
    onChange([...content, newItem]);
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      content.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteExperience = (id: string) => {
    onChange(content.filter((item) => item.id !== id));
  };

  const addBullet = (id: string) => {
    onChange(
      content.map((item) =>
        item.id === id ? { ...item, bullets: [...item.bullets, ''] } : item
      )
    );
  };

  const updateBullet = (id: string, index: number, value: string) => {
    onChange(
      content.map((item) =>
        item.id === id
          ? {
              ...item,
              bullets: item.bullets.map((b, i) => (i === index ? value : b))
            }
          : item
      )
    );
  };

  const deleteBullet = (id: string, index: number) => {
    onChange(
      content.map((item) =>
        item.id === id
          ? { ...item, bullets: item.bullets.filter((_, i) => i !== index) }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {content.map((exp, idx) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                Experience {idx + 1}
              </span>
            </div>
            <button
              onClick={() => deleteExperience(exp.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Company Name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Position"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <input
              type="text"
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              placeholder="Location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex items-center gap-3">
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              {!exp.current && (
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              <label className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Current</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Responsibilities & Achievements
              </label>
              {exp.bullets.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-2">•</span>
                  <textarea
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, bulletIdx, e.target.value)}
                    placeholder="Describe your achievement with metrics..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  {exp.bullets.length > 1 && (
                    <button
                      onClick={() => deleteBullet(exp.id, bulletIdx)}
                      className="text-red-600 hover:text-red-700 mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addBullet(exp.id)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add bullet point
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Experience
      </button>
    </div>
  );
};
