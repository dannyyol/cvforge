import React from 'react';
import { Sparkles, TrendingUp, Settings, Check, X, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AISuggestion, KeywordCoverage, CVSection } from '../types/cv';
import { TemplateThumbnail } from './TemplateThumbnail';

interface RightPanelProps {
  suggestions: AISuggestion[];
  keywords: KeywordCoverage[];
  onAcceptSuggestion: (suggestionId: string) => void;
  onRejectSuggestion: (suggestionId: string) => void;
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  showFloatingPreview: boolean;
  onToggleFloatingPreview: () => void;
  sections: CVSection[];
}

export const RightPanel: React.FC<RightPanelProps> = ({
  suggestions,
  keywords,
  onAcceptSuggestion,
  onRejectSuggestion,
  currentTemplate,
  onTemplateChange,
  isOpen,
  onClose,
  showFloatingPreview,
  onToggleFloatingPreview,
  sections
}) => {
  const [activeTab, setActiveTab] = React.useState<'suggestions' | 'keywords' | 'settings'>('suggestions');
  const [currentPage, setCurrentPage] = React.useState(0);

  const pendingSuggestions = suggestions.filter(s => s.accepted === undefined);
  const missingKeywords = keywords.filter(k => !k.present && k.importance === 'high');

  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'creative', name: 'Creative' },
    { id: 'professional', name: 'Professional' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'compact', name: 'Compact' },
    { id: 'bold', name: 'Bold' }
  ];

  const templatesPerPage = 4;
  const totalPages = Math.ceil(templates.length / templatesPerPage);
  const startIndex = currentPage * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = templates.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          w-80 bg-white flex flex-col h-full shadow-md
          z-30 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        `}
      >
      <div>
        <div className="flex">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'suggestions'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI
              {pendingSuggestions.length > 0 && (
                <span className="bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">
                  {pendingSuggestions.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'keywords'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Keywords
            </div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'suggestions' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-900">AI Suggestions</h3>
            </div>

            {pendingSuggestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary-500 text-sm">No suggestions available</p>
                <p className="text-secondary-400 text-xs mt-1">
                  Keep editing to get AI-powered improvements
                </p>
              </div>
            ) : (
              pendingSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="border border-secondary-200 rounded-lg p-3 bg-secondary-50 animate-slide-up"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-primary-600 uppercase">
                      {suggestion.type}
                    </span>
                  </div>

                  {suggestion.original && (
                    <div className="mb-2">
                      <p className="text-xs text-secondary-500 mb-1">Current:</p>
                      <p className="text-sm text-secondary-600 line-through">
                        {suggestion.original}
                      </p>
                    </div>
                  )}

                  <div className="mb-2">
                    <p className="text-xs text-secondary-500 mb-1">Suggested:</p>
                    <p className="text-sm text-secondary-900 font-medium">
                      {suggestion.suggestion}
                    </p>
                  </div>

                  <p className="text-xs text-secondary-500 mb-3">{suggestion.reason}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onAcceptSuggestion(suggestion.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-white bg-success-600 rounded hover:bg-success-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => onRejectSuggestion(suggestion.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-secondary-700 bg-white border border-secondary-300 rounded hover:bg-secondary-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-900">Keyword Coverage</h3>
            </div>

            {missingKeywords.length > 0 && (
              <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm font-medium text-warning-900 mb-2">
                  Missing Important Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw) => (
                    <span
                      key={kw.keyword}
                      className="px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded"
                    >
                      {kw.keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {keywords.map((kw) => (
                <div
                  key={kw.keyword}
                  className="flex items-center justify-between p-2 border border-secondary-200 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        kw.present ? 'bg-success-500' : 'bg-secondary-300'
                      }`}
                    />
                    <span className="text-sm text-secondary-900">{kw.keyword}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {kw.present && (
                      <span className="text-xs text-secondary-500">{kw.count}x</span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        kw.importance === 'high'
                          ? 'bg-error-100 text-error-700'
                          : kw.importance === 'medium'
                          ? 'bg-warning-100 text-warning-700'
                          : 'bg-secondary-100 text-secondary-700'
                      }`}
                    >
                      {kw.importance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-900">Template Settings</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-secondary-700">
                    CV Template
                  </label>
                  <span className="text-xs text-secondary-500">
                    {currentPage + 1} / {totalPages}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {currentTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => onTemplateChange(template.id)}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all
                        ${currentTemplate === template.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-secondary-200 bg-white hover:border-secondary-300'
                        }
                      `}
                    >
                      <div className="mb-2">
                        <TemplateThumbnail
                          templateId={template.id}
                          sections={sections.filter(s => s.visible).slice(0, 3)}
                          isSelected={currentTemplate === template.id}
                        />
                      </div>
                      <p className={`text-xs font-medium ${currentTemplate === template.id ? 'text-primary-600' : 'text-secondary-700'}`}>
                        {template.name}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-3">
                <button
                  onClick={onToggleFloatingPreview}
                  className="w-full flex items-center justify-between p-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {showFloatingPreview ? <Minimize2 className="w-4 h-4 text-primary-600" /> : <Maximize2 className="w-4 h-4 text-primary-600" />}
                    <span className="text-sm font-medium text-primary-900">
                      {showFloatingPreview ? 'Close' : 'Open'} Floating Preview
                    </span>
                  </div>
                </button>
              </div>

              <div className="border-t border-secondary-200 pt-3">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Font Size
                </label>
                <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="10">10pt</option>
                  <option value="11" selected>11pt</option>
                  <option value="12">12pt</option>
                </select>
              </div>

              <div className="border-t border-secondary-200 pt-3">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Margins
                </label>
                <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="narrow">Narrow</option>
                  <option value="normal" selected>Normal</option>
                  <option value="wide">Wide</option>
                </select>
              </div>

              <div className="border-t border-secondary-200 pt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-700">Show contact icons</span>
                </label>
              </div>

              <div className="border-t border-secondary-200 pt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-secondary-700">Enable AI suggestions</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};
