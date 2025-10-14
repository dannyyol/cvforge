import { ProjectEntry } from '../../types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface ProjectsFormProps {
  projects: ProjectEntry[];
  onChange: (projects: ProjectEntry[]) => void;
}

export default function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const handleAdd = () => {
    const newProject: ProjectEntry = {
      id: crypto.randomUUID(),
      resume_id: projects[0]?.resume_id || '',
      title: '',
      description: '',
      start_date: null,
      end_date: null,
      url: '',
      sort_order: projects.length,
    };
    onChange([...projects, newProject]);
  };

  const handleRemove = (id: string) => {
    onChange(projects.filter((project) => project.id !== id));
  };

  const handleChange = (id: string, field: keyof ProjectEntry, value: string) => {
    onChange(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  return (
    <div className="form-container">
      {projects.map((project, index) => (
        <div key={project.id} className="form-card">
          <div className="form-section-header">
            <div className="flex items-center gap-2">
              <GripVertical className="form-drag-handle" />
              <span className="form-section-title">
                Project {index + 1}
              </span>
            </div>
            <button
              onClick={() => handleRemove(project.id)}
              className="form-delete-btn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="form-grid-2">
            <div className="col-span-2">
              <label className="form-label">
                Project Title
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleChange(project.id, 'title', e.target.value)}
                className="form-input"
                placeholder="e.g. E-commerce Platform"
              />
            </div>

            <div>
              <label className="form-label">
                Start Date
              </label>
              <input
                type="date"
                value={project.start_date || ''}
                onChange={(e) => handleChange(project.id, 'start_date', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                End Date
              </label>
              <input
                type="date"
                value={project.end_date || ''}
                onChange={(e) => handleChange(project.id, 'end_date', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="col-span-2">
              <label className="form-label">
                Project URL
              </label>
              <input
                type="url"
                value={project.url}
                onChange={(e) => handleChange(project.id, 'url', e.target.value)}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>

            <div className="col-span-2">
              <label className="form-label">
                Description
              </label>
              <RichTextEditor
                value={project.description}
                onChange={(value) => handleChange(project.id, 'description', value)}
                placeholder="Describe the project, your role, and key achievements..."
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
        Add Project
      </button>
    </div>
  );
}
