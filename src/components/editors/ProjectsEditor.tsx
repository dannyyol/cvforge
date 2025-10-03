import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ProjectItem } from '../../types/cv';

interface ProjectsEditorProps {
  content: ProjectItem[];
  onChange: (content: ProjectItem[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ content, onChange }) => {
  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      link: '',
      bullets: ['']
    };
    onChange([...content, newItem]);
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      content.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteProject = (id: string) => {
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
      {content.map((project, idx) => (
        <div key={project.id} className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-secondary-400" />
              <span className="text-sm font-medium text-secondary-500">
                Project {idx + 1}
              </span>
            </div>
            <button
              onClick={() => deleteProject(project.id)}
              className="text-error-600 hover:text-error-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProject(project.id, 'name', e.target.value)}
              placeholder="Project Name"
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            <textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              placeholder="Brief description of the project"
              rows={2}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />

            <input
              type="text"
              value={project.technologies.join(', ')}
              onChange={(e) =>
                updateProject(
                  project.id,
                  'technologies',
                  e.target.value.split(',').map((t) => t.trim())
                )
              }
              placeholder="Technologies used (comma-separated)"
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            <input
              type="text"
              value={project.link || ''}
              onChange={(e) => updateProject(project.id, 'link', e.target.value)}
              placeholder="Project link (optional)"
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700">
                Key Achievements
              </label>
              {project.bullets.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="flex items-start gap-2">
                  <span className="text-secondary-400 mt-2">•</span>
                  <textarea
                    value={bullet}
                    onChange={(e) => updateBullet(project.id, bulletIdx, e.target.value)}
                    placeholder="Describe the impact or result..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  {project.bullets.length > 1 && (
                    <button
                      onClick={() => deleteBullet(project.id, bulletIdx)}
                      className="text-error-600 hover:text-error-700 mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addBullet(project.id)}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4" />
                Add bullet point
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </button>
    </div>
  );
};
