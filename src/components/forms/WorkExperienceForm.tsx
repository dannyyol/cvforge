import { WorkExperience } from '../../types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface WorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export default function WorkExperienceForm({ experiences, onChange }: WorkExperienceFormProps) {
  const handleAdd = () => {
    const newExperience: WorkExperience = {
      id: crypto.randomUUID(),
      resume_id: experiences[0]?.resume_id || '',
      job_title: '',
      company: '',
      location: '',
      start_date: null,
      end_date: null,
      current: false,
      description: '',
      sort_order: experiences.length,
    };
    onChange([...experiences, newExperience]);
  };

  const handleRemove = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const handleChange = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  return (
    <div className="form-container">
      {experiences.map((experience, index) => (
        <div key={experience.id} className="form-card">
          <div className="form-section-header">
            <div className="flex items-center gap-2">
              <GripVertical className="form-drag-handle" />
              <span className="form-section-title">
                Experience {index + 1}
              </span>
            </div>
            <button
              onClick={() => handleRemove(experience.id)}
              className="form-delete-btn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="form-grid-2">
            <div>
              <label className="form-label">
                Job Title
              </label>
              <input
                type="text"
                value={experience.job_title}
                onChange={(e) => handleChange(experience.id, 'job_title', e.target.value)}
                className="form-input"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={experience.company}
                onChange={(e) => handleChange(experience.id, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Tech Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={experience.location}
                onChange={(e) => handleChange(experience.id, 'location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) => handleChange(experience.id, 'current', e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-sm font-medium text-gray-700">
                  Currently working here
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={experience.start_date || ''}
                onChange={(e) => handleChange(experience.id, 'start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={experience.end_date || ''}
                onChange={(e) => handleChange(experience.id, 'end_date', e.target.value)}
                disabled={experience.current}
                className="form-input form-disabled"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <RichTextEditor
                value={experience.description}
                onChange={(value) => handleChange(experience.id, 'description', value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="form-add-btn"
      >
        <Plus className="w-5 h-5" />
        Add Work Experience
      </button>
    </div>
  );
}
