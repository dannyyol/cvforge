import React from 'react';
import { SummaryContent } from '../../types/cv';

interface SummaryEditorProps {
  content: SummaryContent;
  onChange: (content: SummaryContent) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ content, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Professional Summary
      </label>
      <textarea
        value={content.text}
        onChange={(e) => onChange({ text: e.target.value })}
        rows={6}
        placeholder="Write a compelling summary highlighting your key achievements and skills..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <p className="text-xs text-gray-500 mt-1">
        {content.text.length} characters
      </p>
    </div>
  );
};
