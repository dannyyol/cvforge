import { useCVStore } from '../../../store/useCVStore';
import { RichTextEditor } from '../../ui/RichTextEditor';
import { FileText } from 'lucide-react';

export const SummaryForm = () => {
  const { cvData, updateSummary } = useCVStore();
  console.log('cvData', cvData);

  return (
    <div className="form-container">
       <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-lg font-semibold text-gray-800">Professional Summary</h3>
                <p className="text-sm text-gray-500">Write a brief overview of your background and goals.</p>
             </div>
        </div>

      <div className="summary-card">
        <div className="summary-content">
            <div className="summary-icon">
                <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
                 <RichTextEditor
                    label="Summary"
                    value={cvData?.professionalSummary?.content}
                    onChange={updateSummary}
                    placeholder="e.g. Dedicated and experienced Software Engineer with over 5 years of experience in building scalable web applications..."
                  />
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Tip: Keep it concise and focused on your key achievements and skills.
                  </p>
            </div>
        </div>
      </div>
    </div>
  );
};
