import { EducationEntry } from '../../types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EducationFormProps {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}

export default function EducationForm({ entries, onChange }: EducationFormProps) {
  const handleAdd = () => {
    const newEntry: EducationEntry = {
      id: crypto.randomUUID(),
      resume_id: entries[0]?.resume_id || '',
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: null,
      end_date: null,
      description: '',
      sort_order: entries.length,
    };
    onChange([...entries, newEntry]);
  };

  const handleRemove = (id: string) => {
    onChange(entries.filter((entry) => entry.id !== id));
  };

  const handleChange = (id: string, field: keyof EducationEntry, value: string) => {
    const existing = entries.find((entry) => entry.id === id);
    if (!existing) return;
    if ((existing as any)[field] === value) return;

    onChange(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  return (
    <div className="form-container">
      {entries.map((entry, index) => (
        <div key={entry.id} className="form-card">
          <div className="form-section-header">
            <div className="flex items-center gap-2">
              <GripVertical className="form-drag-handle" />
              <span className="form-section-title">
                Education {index + 1}
              </span>
            </div>
            <button
              onClick={() => handleRemove(entry.id)}
              className="form-delete-btn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="form-grid-2">
            <div className="col-span-2">
              <label className="form-label">
                Institution
              </label>
              <input
                type="text"
                value={entry.institution}
                onChange={(e) => handleChange(entry.id, 'institution', e.target.value)}
                className="form-input"
                placeholder="e.g. University of California"
              />
            </div>

            <div>
              <label className="form-label">
                Degree
              </label>
              <input
                type="text"
                value={entry.degree}
                onChange={(e) => handleChange(entry.id, 'degree', e.target.value)}
                className="form-input"
                placeholder="e.g. Bachelor of Science"
              />
            </div>

            <div>
              <label className="form-label">
                Field of Study
              </label>
              <input
                type="text"
                value={entry.field_of_study}
                onChange={(e) => handleChange(entry.id, 'field_of_study', e.target.value)}
                className="form-input"
                placeholder="e.g. Computer Science"
              />
            </div>

            <div>
              <label className="form-label">
                Start Date
              </label>
              <input
                type="month"
                value={entry.start_date || ''}
                onChange={(e) => handleChange(entry.id, 'start_date', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                End Date
              </label>
              <input
                type="month"
                value={entry.end_date || ''}
                onChange={(e) => handleChange(entry.id, 'end_date', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="col-span-2">
              <label className="form-label">
                Description
              </label>
              <ReactQuill
                value={entry.description}
                onChange={(content) => handleChange(entry.id, 'description', content)}
                placeholder="Additional details about your education..."
                modules={quillModules}
                theme="snow"
                style={{ minHeight: 72 }}
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
        Add Education
      </button>
    </div>
  );
}
