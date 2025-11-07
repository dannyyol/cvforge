import { Check, X } from 'lucide-react';
import { CVTemplate, TemplateId } from '../types/resume';

import { getTemplatesList } from './templates/registry';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onClose: () => void;
}

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  onClose,
}: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a template that best fits your style
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="h-64 rounded-t-lg bg-gray-100 flex items-center justify-center relative overflow-hidden"
              >
                <img
                  src={template.thumbnail}
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <div class="bg-white shadow-lg rounded p-8 w-48 h-56 border border-gray-300">
                            <div class="space-y-3">
                              <div class="h-4 bg-gray-800 rounded w-3/4"></div>
                              <div class="h-2 bg-gray-400 rounded w-1/2"></div>
                              <div class="border-b border-gray-300 my-3"></div>
                              <div class="space-y-2">
                                <div class="h-2 bg-gray-300 rounded"></div>
                                <div class="h-2 bg-gray-300 rounded w-5/6"></div>
                                <div class="h-2 bg-gray-300 rounded w-4/6"></div>
                              </div>
                              <div class="pt-3">
                                <div class="h-2 bg-gray-400 rounded w-1/3 mb-2"></div>
                                <div class="h-2 bg-gray-200 rounded w-full"></div>
                                <div class="h-2 bg-gray-200 rounded w-5/6 mt-1"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />

                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1">
                    <Check size={20} />
                  </div>
                )}
              </div>

              <div className="p-4 bg-white rounded-b-lg">
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
