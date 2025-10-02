import React from 'react';
import { Sparkles, TrendingUp, Settings, Check, X } from 'lucide-react';
import { AISuggestion, KeywordCoverage } from '../types/cv';

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
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'suggestions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI
              {pendingSuggestions.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {pendingSuggestions.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'keywords'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
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
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
            </div>

            {pendingSuggestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No suggestions available</p>
                <p className="text-gray-400 text-xs mt-1">
                  Keep editing to get AI-powered improvements
                </p>
              </div>
            ) : (
              pendingSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 uppercase">
                      {suggestion.type}
                    </span>
                  </div>

                  {suggestion.original && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Current:</p>
                      <p className="text-sm text-gray-600 line-through">
                        {suggestion.original}
                      </p>
                    </div>
                  )}

                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Suggested:</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {suggestion.suggestion}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">{suggestion.reason}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onAcceptSuggestion(suggestion.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => onRejectSuggestion(suggestion.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Keyword Coverage</h3>
            </div>

            {missingKeywords.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-900 mb-2">
                  Missing Important Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw) => (
                    <span
                      key={kw.keyword}
                      className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded"
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
                  className="flex items-center justify-between p-2 border border-gray-200 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        kw.present ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-sm text-gray-900">{kw.keyword}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {kw.present && (
                      <span className="text-xs text-gray-500">{kw.count}x</span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        kw.importance === 'high'
                          ? 'bg-red-100 text-red-700'
                          : kw.importance === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
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
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Template Settings</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV Template
                </label>
                <select
                  value={currentTemplate}
                  onChange={(e) => onTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="10">10pt</option>
                  <option value="11" selected>11pt</option>
                  <option value="12">12pt</option>
                </select>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margins
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="narrow">Narrow</option>
                  <option value="normal" selected>Normal</option>
                  <option value="wide">Wide</option>
                </select>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show contact icons</span>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enable AI suggestions</span>
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
