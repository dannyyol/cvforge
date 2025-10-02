import React from 'react';
import { Sparkles, TrendingUp, Settings, Check, X } from 'lucide-react';
import type { AISuggestion, KeywordCoverage } from '../types/cv';

interface RightPanelProps {
  suggestions: AISuggestion[];
  keywords: KeywordCoverage[];
  onAcceptSuggestion: (suggestionId: string) => void;
  onRejectSuggestion: (suggestionId: string) => void;
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  suggestions,
  keywords,
  onAcceptSuggestion,
  onRejectSuggestion,
  currentTemplate,
  onTemplateChange,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = React.useState<'suggestions' | 'keywords' | 'settings'>('suggestions');

  const pendingSuggestions = suggestions.filter(s => s.accepted === undefined);
  const missingKeywords = keywords.filter(k => !k.present && k.importance === 'high');

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 xl:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed xl:relative right-0
          w-80 bg-white border-l border-gray-200 flex flex-col h-full
          z-30 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        `}
      >
      </div>
    </>
  );
};
