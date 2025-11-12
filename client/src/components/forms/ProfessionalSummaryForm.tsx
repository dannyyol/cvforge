import { ProfessionalSummary } from '../../types/resume';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ProfessionalSummaryFormProps {
  summary: ProfessionalSummary | null;
  onChange: (content: string) => void;
}

export default function ProfessionalSummaryForm({ summary, onChange }: ProfessionalSummaryFormProps) {
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  return (
    <div>
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-4 mb-6 rounded-r-lg">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Write a brief, dynamic summary highlighting your role, key achievements, and skills. Show what drives you and what makes you stand out.</p>
      </div>

      {/* Editor */}
      <ReactQuill
        value={summary?.content || ''}
        onChange={(content) => onChange(content)}
        placeholder="e.g. Passionate software engineer with 5+ years of experience..."
        modules={quillModules}
        theme="snow"
        style={{ minHeight: 144 }}
      />
    </div>
  );
}
