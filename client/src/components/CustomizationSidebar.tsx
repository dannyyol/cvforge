import { useState } from 'react';
import { ChevronLeft, Grid, Type, Layout } from 'lucide-react';
import { TemplateId } from '../types/resume';

interface CustomizationSidebarProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
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

const templates = [
  {
    id: 'classic' as TemplateId,
    name: 'Classic',
    formats: ['PDF', 'DOCX'],
  },
  {
    id: 'modern' as TemplateId,
    name: 'Modern',
    formats: ['PDF', 'DOCX'],
  },
  {
    id: 'minimalist' as TemplateId,
    name: 'Minimalist',
    formats: ['PDF', 'DOCX'],
  },
  {
    id: 'professional' as TemplateId,
    name: 'Professional',
    formats: ['PDF', 'DOCX'],
  },
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

  const templatesWithColors: TemplateId[] = ['modern', 'professional'];
  const isColorSupported = templatesWithColors.includes(selectedTemplate);

  const handleColorClick = (colorId: string) => {
    if (!isColorSupported) {
      setShowColorWarning(true);
      setTimeout(() => setShowColorWarning(false), 3000);
      return;
    }
    onAccentColorChange(colorId);
  };

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <button
          onClick={onClose}
          className="sidebar-back-btn"
        >
          <ChevronLeft size={20} />
          <span>Edit</span>
        </button>
        <button
          className="sidebar-download-btn"
        >
          Download
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="sidebar-tabs">
        <button
          onClick={() => setActiveTab('templates')}
          className={`sidebar-tab ${activeTab === 'templates' ? 'sidebar-tab--active' : 'sidebar-tab--inactive'}`}
        >
          <Grid size={18} />
          <span>Templates</span>
          {activeTab === 'templates' && (
            <div className="sidebar-tab-indicator"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`sidebar-tab ${activeTab === 'text' ? 'sidebar-tab--active' : 'sidebar-tab--inactive'}`}
        >
          <Type size={18} />
          <span>Text</span>
          {activeTab === 'text' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`sidebar-tab ${activeTab === 'layout' ? 'sidebar-tab--active' : 'sidebar-tab--inactive'}`}
        >
          <Layout size={18} />
          <span>Layout</span>
          {activeTab === 'layout' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'templates' && (
          <div className="p-4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="sidebar-section-title">
                  Accent Colour
                </h3>
                {!isColorSupported && (
                  <span className="sidebar-not-available">
                    Not available
                  </span>
                )}
              </div>
              {showColorWarning && (
                <div className="sidebar-warning">
                  This template doesn't support color customization
                </div>
              )}
              <div className={`sidebar-color-grid ${!isColorSupported ? 'opacity-40' : ''}`}>
                {accentColors.map((colorOption) => (
                  <button
                    key={colorOption.id}
                    onClick={() => handleColorClick(colorOption.id)}
                    disabled={!isColorSupported}
                    className={`sidebar-color-swatch ${
                      accentColor === colorOption.id && isColorSupported
                        ? 'sidebar-color-swatch--selected'
                        : 'sidebar-color-swatch--hover'
                    } ${!isColorSupported ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{ backgroundColor: colorOption.color }}
                    title={isColorSupported ? colorOption.name : 'Not supported by this template'}
                  >
                    {accentColor === colorOption.id && isColorSupported && (
                      <svg
                        className="w-4 h-4 text-white"
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
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template.id)}
                  className={`sidebar-template-card ${
                    selectedTemplate === template.id
                      ? 'sidebar-template-card--selected'
                      : 'sidebar-template-card--hover'
                  }`}
                >
                  <div className="sidebar-template-preview">
                    <div className="sidebar-template-preview-title">
                      <div className="font-bold mb-0.5">JOHN DOE</div>
                      <div className="sidebar-template-preview-subtitle">Software Developer</div>
                    </div>
                    <div className="sidebar-template-divider"></div>
                    <div className="space-y-1.5">
                      <div>
                        <div className="sidebar-template-section-title">EMPLOYMENT HISTORY</div>
                        <div className="sidebar-template-text space-y-0.5">
                          <div>Software Developer, Company</div>
                          <div className="sidebar-template-muted">2020 - Present</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[6px] font-semibold mb-0.5">EDUCATION</div>
                        <div className="text-[5px] text-gray-700">
                          <div>Bachelor's Degree</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedTemplate === template.id && (
                    <div className="sidebar-template-badge">
                      <svg
                        className="w-3 h-3"
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

                  <div className="sidebar-template-footer">
                    <div className="sidebar-template-footer-title">
                      {template.name}
                    </div>
                    <div className="flex gap-1">
                      {template.formats.map((format) => (
                        <span
                          key={format}
                          className={`sidebar-format-label ${format === 'PDF' ? 'sidebar-format-pdf' : 'sidebar-format-docx'}`}
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="sidebar-coming-soon">
            <p>Text customization options coming soon...</p>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="p-4 text-gray-400 text-sm">
            <p>Layout customization options coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
