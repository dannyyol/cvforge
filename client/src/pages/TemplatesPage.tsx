import { useCVStore } from '../store/useCVStore';
import { CVPreview } from '../components/Preview/CVPreview';
import { getTemplatesList } from '../components/Preview/templates/registry';
import { Check, Palette, Type, LayoutTemplate } from 'lucide-react';
import { clsx } from 'clsx';
import { PRESET_COLORS, FONT_OPTIONS } from '../components/Editor/forms/ThemeSettingsForm';
import { Badge } from '../components/ui/Badge';
import DownloadDropdown from '../components/DownloadDropdown';

export const TemplatesPage = () => {
  const { cvData, selectedTemplate, setTemplate, updateTheme } = useCVStore();
  const templates = getTemplatesList();
  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const supportsAccent = currentTemplate?.supportsAccent ?? true;

  const handleColorChange = (color: string) => {
    updateTheme({ primaryColor: color });
  };

  const handleFontChange = (font: string) => {
    updateTheme({ fontFamily: font });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-gray-50/50 font-sans">
      {/* Sidebar - Template Selection & Customization */}
      <div className="w-full lg:w-[420px] xl:w-[480px] bg-white border-r border-gray-200/80 flex flex-col h-full overflow-y-auto shrink-0 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              Templates
            </h1>
            <p className="text-gray-500 mt-2 text-base leading-relaxed">Choose a professional design that highlights your strengths.</p>
          </div>

          {/* Template Grid */}
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Select Template</h2>
            <div className="grid grid-cols-2 gap-5">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setTemplate(template.id)}
                  className={clsx(
                    "group relative flex flex-col items-start text-left w-full rounded-2xl border transition-all duration-300 overflow-hidden",
                    selectedTemplate === template.id
                      ? "border-blue-600 ring-4 ring-blue-500/10 shadow-lg scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white hover:-translate-y-0.5"
                  )}
                >
                  <div className="w-full aspect-[210/297] bg-gray-100 relative overflow-hidden border-b border-gray-100">
                    {/* Placeholder for template thumbnail if we had images */}
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-300">
                        <LayoutTemplate className="w-12 h-12 opacity-20" />
                    </div>
                    
                    {/* Selected Overlay */}
                    {selectedTemplate === template.id && (
                      <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-200">
                        <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-xl transform scale-100 transition-transform">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 w-full bg-white">
                    <div className="flex flex-col gap-1.5 w-full">
                      <h3 className={clsx(
                        "font-bold text-sm tracking-tight",
                        selectedTemplate === template.id ? "text-blue-700" : "text-gray-900"
                      )}>
                        {template.name}
                      </h3>
                      {selectedTemplate === template.id ? (
                        <Badge variant="default" className="font-bold uppercase tracking-wide">
                          Active
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Professional Layout</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Customization Panel */}
          <section className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Customize Style
            </h2>
            
            <div className="space-y-8">
              {/* Colors */}
              <div className={clsx("transition-all duration-300", !supportsAccent && "pointer-events-none select-none")}>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-gray-700">Accent Color</label>
                </div>

                <div className="relative">
                  {!supportsAccent && (
                    <div className="absolute -inset-2 bg-white/80 backdrop-blur-[1px] z-20 rounded-xl flex items-center justify-center">
                        <Badge variant="secondary" className="bg-white/90 text-gray-500 shadow-sm text-xs font-semibold px-3 py-1.5">
                          Not available for this template
                        </Badge>
                    </div>
                  )}
                
                  <div className="flex items-center gap-3 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={clsx(
                        "w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-100 shadow-sm relative group",
                        cvData.theme.primaryColor.toLowerCase() === color.toLowerCase() 
                          ? 'ring-2 ring-offset-2 ring-gray-900 scale-110 z-10' 
                          : 'border-2 border-transparent hover:border-gray-200'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    >
                        {cvData.theme.primaryColor.toLowerCase() === color.toLowerCase() && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <span className="w-2 h-2 bg-white rounded-full shadow-sm" />
                            </span>
                        )}
                    </button>
                  ))}
                  <div className="relative group">
                    <input
                      type="color"
                      value={cvData.theme.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-9 h-9 p-0 border-0 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div className={clsx(
                        "w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center bg-white transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-sm",
                        !PRESET_COLORS.includes(cvData.theme.primaryColor) && "ring-2 ring-offset-2 ring-gray-900 border-transparent"
                    )}>
                        <div 
                            className="w-full h-full rounded-full flex items-center justify-center"
                            style={{ backgroundColor: !PRESET_COLORS.includes(cvData.theme.primaryColor) ? cvData.theme.primaryColor : 'transparent' }}
                        >
                            {!PRESET_COLORS.includes(cvData.theme.primaryColor) ? (
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
                <label className="block text-sm font-bold text-gray-700 mb-3">Typography</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
                    <Type className="w-4 h-4" />
                  </div>
                  <select
                    value={cvData.theme.fontFamily}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="appearance-none block w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm font-medium ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 hover:border-gray-300 cursor-pointer text-gray-700 shadow-sm"
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
          </section>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative bg-gray-100/30 flex flex-col h-full overflow-hidden">
        {/* Preview Toolbar */}
        <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-8 flex justify-between items-center shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Previewing</span>
            <div className="h-4 w-px bg-gray-200" />
            <span className="text-sm text-gray-900 font-bold">{templates.find(t => t.id === selectedTemplate)?.name} Template</span>
          </div>
          <DownloadDropdown />
        </div>

        {/* CV Preview Container */}
        <div className="flex-1 overflow-y-auto overflow-x-auto relative bg-slate-50">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
          <div className="min-h-full p-4 md:p-4 flex justify-center relative z-0">
              <CVPreview scaleMode="fill" />
          </div>
        </div>
      </div>
    </div>
  );
};
