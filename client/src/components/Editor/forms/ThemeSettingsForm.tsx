import { useCVStore } from '../../../store/useCVStore';
import { getTemplatesList } from '../../Preview/templates/registry';
import { Palette, Type } from 'lucide-react';
import { cn } from '../../ui/Form';

export const FONT_OPTIONS = [
  { label: 'Template Default', value: '' },
  { label: 'Sans Serif (System)', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif (System)', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
  { label: 'Monospace (System)', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
];

export const PRESET_COLORS = [
  '#475569', // Slate-600
  '#2563EB', // Blue-600
  '#DC2626', // Red-600
  '#059669', // Emerald-600
  '#7C3AED', // Violet-600
  '#DB2777', // Pink-600
];

export const ThemeSettingsForm = () => {
  const { cvData, updateTheme, selectedTemplate } = useCVStore();
  const { theme } = cvData;
  const templates = getTemplatesList();
  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const supportsAccent = currentTemplate?.supportsAccent ?? true;

  const handleColorChange = (key: 'primaryColor' | 'secondaryColor', value: string) => {
    updateTheme({ [key]: value });
  };

  return (
    <div className="theme-card">
      <div className="theme-header">
        <div className="theme-icon">
            <Palette className="w-5 h-5" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Customize Style</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Customize your CV's visual style</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Colors */}
        <div className={cn("transition-all duration-300", !supportsAccent && "pointer-events-none select-none")}>
          <div className="flex justify-between items-end mb-4">
            <label className="block text-sm font-semibold text-gray-700">Accent Color</label>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Primary</span>
          </div>
          
          <div className="relative">
            {!supportsAccent && (
                <div className="absolute -inset-2 bg-white/80 backdrop-blur-[1px] z-20 rounded-xl flex items-center justify-center">
                    <span className="bg-white/90 text-gray-500 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-gray-100">
                        Not available for this template
                    </span>
                </div>
            )}
            <div className="flex items-center gap-3 flex-wrap">
                {PRESET_COLORS.map((color) => (
                <button
                    key={color}
                    onClick={() => handleColorChange('primaryColor', color)}
                    className={cn(
                        "color-swatch group",
                        theme.primaryColor.toLowerCase() === color.toLowerCase() 
                            ? 'color-swatch-active' 
                            : 'color-swatch-inactive'
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                >
                    {theme.primaryColor.toLowerCase() === color.toLowerCase() && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-2 h-2 bg-white rounded-full shadow-sm" />
                        </span>
                    )}
                </button>
                ))}
                <div className="relative group">
                    <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-9 h-9 p-0 border-0 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div className={cn(
                        "theme-color-input-wrapper",
                        !PRESET_COLORS.includes(theme.primaryColor) && "theme-color-input-wrapper-active"
                    )}>
                        <div 
                            className="w-full h-full rounded-full flex items-center justify-center"
                            style={{ backgroundColor: !PRESET_COLORS.includes(theme.primaryColor) ? theme.primaryColor : 'transparent' }}
                        >
                            {!PRESET_COLORS.includes(theme.primaryColor) ? (
                                <span className="w-2 h-2 bg-white rounded-full shadow-sm" />
                            ) : (
                                <Palette className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Fonts */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-400" /> 
            Typography
          </label>
          <div className="relative group">
              <select
                value={theme.fontFamily}
                onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                className="appearance-none block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-700 ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200 hover:bg-white hover:border-gray-300 cursor-pointer"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                  </svg>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
