import React from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import type { AISuggestion, CVSection } from './types/cv';
import { mockAISuggestions, mockSections } from './data/mockData';
import type { RightPanel } from './components/RightPanel';

function App() {
  const [sections, setSections] = React.useState<CVSection[]>(mockSections);

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>('header');
    const [suggestions, setSuggestions] = React.useState<AISuggestion[]>(mockAISuggestions);
  const [currentTemplate, setCurrentTemplate] = React.useState('modern');

  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<string>('');

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = React.useState(false);

    const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleAcceptSuggestion = (suggestionId: string) => {
    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, accepted: true } : s
      )
    );
  };

   const handleRejectSuggestion = (suggestionId: string) => {
    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, accepted: false } : s
      )
    );
  };

  const handleToggleVisibility = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  };

  const handleReorderSections = (reorderedSections: CVSection[]) => {
    setSections(reorderedSections);
  };

  const handleContentChange = (sectionId: string, content: any) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const now = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });

      setLastSaved(now);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleExportPDF = () => {
    console.log('Exporting as PDF...');
  };

  const handleExportDOCX = () => {
    console.log('Exporting as DOCX...');
  };

    const handleTemplateChange = (templateId: string) => {
    setCurrentTemplate(templateId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
       <Navbar
        onSave={handleSave}
        onPreview={handlePreview}
        onExportPDF={handleExportPDF}
        onExportDOCX={handleExportDOCX}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          sections={sections}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          onToggleVisibility={handleToggleVisibility}
          onReorderSections={handleReorderSections}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <RightPanel
          suggestions={suggestions}
          onAcceptSuggestion={handleAcceptSuggestion}
          onRejectSuggestion={handleRejectSuggestion}
          currentTemplate={currentTemplate}
          onTemplateChange={handleTemplateChange}
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
        />
      </div>
    </div>
  )
}

export default App
