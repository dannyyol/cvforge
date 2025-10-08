import { ProfessionalSummary } from '../../types/resume';
import RichTextEditor from './RichTextEditor';

interface ProfessionalSummaryFormProps {
  summary: ProfessionalSummary | null;
  onChange: (content: string) => void;
}

export default function ProfessionalSummaryForm({ summary, onChange }: ProfessionalSummaryFormProps) {
  return (
    <div>
        <p className="text-sm text-neutral-600 mb-4">
        Write 2-4 short, energetic sentences about how great you are. Mention the role and what you did. What were the big achievements? Describe your motivation and list your skills.
      </p>

      <RichTextEditor
        value={summary?.content || ''}
        onChange={onChange}
        placeholder="e.g. Passionate software engineer with 5+ years of experience..."
        rows={6}
      />

      <button className="mt-3 form-link">
        Get help with writing
        <span className="ml-1">+</span>
      </button>
    </div>
  );
}
