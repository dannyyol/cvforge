import { useState } from 'react';
import { ChevronLeft, Grid, Type, Layout } from 'lucide-react';
import type { TemplateId } from './templates/registry';
import DownloadDropdown from './DownloadDropdown';
import { getTemplatesList, TEMPLATE_REGISTRY } from './templates/registry';

interface CustomizationSidebarProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  accentColor: { id: string; color: string };
  onAccentColorChange: (colorId: string, color: string) => void;
  onClose: () => void;
}

const accentColors = [
  { id: 'slate', color: '#475569', name: 'Slate' },
  { id: 'gray', color: '#6b7280', name: 'Gray' },
  { id: 'zinc', color: '#71717a', name: 'Zinc' },
  { id: 'neutral', color: '#737373', name: 'Neutral' },
  { id: 'stone', color: '#78716c', name: 'Stone' },
  { id: 'red', color: '#ef4444', name: 'Red' },
  { id: 'orange', color: '#f97316', name: 'Orange' },
  { id: 'amber', color: '#f59e0b', name: 'Amber' },
  { id: 'yellow', color: '#eab308', name: 'Yellow' },
  { id: 'lime', color: '#84cc16', name: 'Lime' },
  { id: 'green', color: '#22c55e', name: 'Green' },
  { id: 'emerald', color: '#10b981', name: 'Emerald' },
  { id: 'teal', color: '#14b8a6', name: 'Teal' },
  { id: 'cyan', color: '#06b6d4', name: 'Cyan' },
  { id: 'sky', color: '#0ea5e9', name: 'Sky' },
  { id: 'blue', color: '#3b82f6', name: 'Blue' },
  { id: 'violet', color: '#8b5cf6', name: 'Violet' },
  { id: 'purple', color: '#a855f7', name: 'Purple' },
  { id: 'fuchsia', color: '#d946ef', name: 'Fuchsia' },
  { id: 'pink', color: '#ec4899', name: 'Pink' },
  { id: 'rose', color: '#f43f5e', name: 'Rose' },
];

type TabType = 'templates' | 'text' | 'layout';

export default function CustomizationSidebar({
  selectedTemplate,
  onSelectTemplate,
  accentColor,
  onAccentColorChange,
  onClose,
}: CustomizationSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [showColorWarning, setShowColorWarning] = useState(false);

  const templatesList = getTemplatesList();
  const isColorSupported = !!TEMPLATE_REGISTRY[selectedTemplate]?.supportsAccent;

  const handleColorClick = (colorId: string, color: string) => {
    if (!isColorSupported) {
      setShowColorWarning(true);
      setTimeout(() => setShowColorWarning(false), 3000);
      return;
    }
    onAccentColorChange(colorId, color);
  }

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col border-r border-gray-200 dark:bg-slate-950 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 dark:bg-slate-950 dark:border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <DownloadDropdown variant="default" className="preview-download-btn" />
      </div>

      {/* Simplified Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200 dark:bg-slate-950 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'templates' 
              ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-slate-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Grid size={18} />
          <span>Templates</span>
          {activeTab === 'templates' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'text' 
              ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-slate-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Type size={18} />
          <span>Text</span>
          {activeTab === 'text' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500"></div>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto dark:bg-slate-950">
        {activeTab === 'templates' && (
          <div className="p-6 space-y-8 animate-fade-in">
            {/* Color Palette Section */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Theme Color
                  </h3>
                  {isColorSupported && (
                    <p className="text-sm text-gray-600 mt-1 transition-all duration-300 dark:text-slate-300">
                      Selected: <span className="font-medium capitalize">{accentColors.find(c => c.id === accentColor.id)?.name || 'None'}</span>
                    </p>
                  )}
                </div>
                {!isColorSupported && (
                  <span className="text-sm text-gray-500 italic animate-fade-in dark:text-slate-400" style={{ animationDelay: '0.3s' }}>
                    Not available for this template
                  </span>
                )}
              </div>
              
              {showColorWarning && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 animate-slide-down dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-300">
                  This template doesn't support color customization
                </div>
              )}
              
              {/* Selected Color Preview */}
              {isColorSupported && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 animate-fade-in hover:shadow-md transition-all duration-300 dark:bg-slate-800 dark:border-slate-700" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-lg ring-2 ring-gray-300 transition-all duration-300 hover:scale-110 dark:ring-slate-600"
                      style={{ backgroundColor: accentColors.find(c => c.id === accentColor.id)?.color }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Current Theme Color</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{accentColors.find(c => c.id === accentColor.id)?.name}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`grid grid-cols-6 gap-2 ${!isColorSupported ? 'opacity-40' : ''}`}>
                {accentColors.map((colorOption, index) => (
                  <button
                    key={colorOption.id}
                    onClick={() => handleColorClick(colorOption.id, colorOption.color)}
                    disabled={!isColorSupported}
                    className={`relative w-12 h-12 rounded-lg transition-all duration-300 flex items-center justify-center group animate-scale-in ${
                      accentColor.id === colorOption.id && isColorSupported
                        ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg transform scale-105'
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 hover:scale-110 shadow-sm hover:shadow-md dark:hover:ring-slate-600'
                    } ${!isColorSupported ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{ 
                      backgroundColor: colorOption.color,
                      animationDelay: `${0.4 + index * 0.05}s`
                    }}
                    title={isColorSupported ? colorOption.name : 'Not supported by this template'}
                  >
                    {accentColor.id === colorOption.id && isColorSupported && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center animate-bounce-in">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-200">
                            <svg
                              className="w-4 h-4 text-gray-800 animate-check-mark dark:text-slate-900"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-10 group-hover:translate-y-1 dark:bg-slate-800">
                      {colorOption.name}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Color categories for better organization */}
              <div className="mt-4 text-xs text-gray-500 animate-fade-in dark:text-slate-400" style={{ animationDelay: '0.8s' }}>
                <p>Choose from our curated color palette to personalize your CV</p>
              </div>
            </div>

            {/* Templates Section */}
            <div className="border-t border-gray-200 pt-6 animate-slide-up dark:border-slate-700" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 animate-fade-in dark:text-slate-100" style={{ animationDelay: '0.6s' }}>
                Choose Template
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {templatesList.map((template, index) => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template.id)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 animate-scale-in hover:transform hover:-translate-y-1 ${
                      selectedTemplate === template.id
                        ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                        : 'hover:ring-2 hover:ring-gray-300 shadow-sm hover:shadow-xl dark:hover:ring-slate-600'
                    }`}
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <div className="bg-white aspect-[8.5/11] p-4 flex flex-col text-left transition-all duration-200 dark:bg-slate-700">
                      <div className="text-[8px] leading-tight mb-2">
                        <div className="font-bold mb-1 dark:text-slate-100">JOHN DOE</div>
                        <div className="text-gray-600 dark:text-slate-300">Software Developer</div>
                      </div>
                      <div className="border-t border-gray-300 my-2 dark:border-slate-600"></div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-[7px] font-semibold mb-1 dark:text-slate-100">EMPLOYMENT HISTORY</div>
                          <div className="text-[6px] text-gray-700 space-y-1 dark:text-slate-300">
                            <div>Software Developer, Company</div>
                            <div className="text-gray-500 dark:text-slate-400">2020 - Present</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-[7px] font-semibold mb-1 dark:text-slate-100">EDUCATION</div>
                          <div className="text-[6px] text-gray-700 dark:text-slate-300">
                            <div>Bachelor's Degree</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedTemplate === template.id && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 animate-bounce-in">
                        <svg
                          className="w-3 h-3 animate-check-mark"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="bg-gray-800 px-3 py-2 transition-all duration-200 hover:bg-gray-700 dark:bg-slate-900 dark:hover:bg-slate-600">
                      <div className="text-white text-[12px] font-medium">
                        {template.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="p-6 text-center">
            <div className="text-gray-500 dark:text-slate-400">
              <Type size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Text customization will added later...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
