import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { EducationItem } from '../../types/cv';

interface EducationEditorProps {
  content: EducationItem[];
  onChange: (content: EducationItem[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ content, onChange }) => {
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: []
    };
    onChange([...content, newItem]);
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: any) => {
    onChange(
      content.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteEducation = (id: string) => {
    onChange(content.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {content.map((edu, idx) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                Education {idx + 1}
              </span>
            </div>
            <button
              onClick={() => deleteEducation(edu.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
              placeholder="Institution Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Degree (e.g., Bachelor of Science)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                placeholder="Field of Study"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <input
              type="text"
              value={edu.location}
              onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
              placeholder="Location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                placeholder="GPA (optional)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <input
              type="text"
              value={edu.honors?.join(', ') || ''}
              onChange={(e) => updateEducation(edu.id, 'honors', e.target.value.split(',').map(s => s.trim()))}
              placeholder="Honors & Awards (comma-separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Education
      </button>
    </div>
  );
};
