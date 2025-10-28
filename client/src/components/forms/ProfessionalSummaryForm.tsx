import { ProfessionalSummary } from '../../types/resume';
import RichTextEditor from './RichTextEditor';

interface ProfessionalSummaryFormProps {
  summary: ProfessionalSummary | null;
  onChange: (content: string) => void;
}

export default function ProfessionalSummaryForm({ summary, onChange }: ProfessionalSummaryFormProps) {
  return (
    <div>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
        <p className="text-sm text-slate-700 leading-relaxed">
          Write a brief, dynamic summary highlighting your role, key achievements, and skills. Show what drives you and what makes you stand out.</p>
      </div>

      <RichTextEditor
        value={summary?.content || ''}
        onChange={onChange}
        placeholder="e.g. Passionate software engineer with 5+ years of experience..."
        rows={6}
      />
    </div>
  );
}
