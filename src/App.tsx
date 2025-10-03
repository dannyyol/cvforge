import React from 'react';
import type { CVSection, AISuggestion } from './types/cv';
import { mockSections, mockAISuggestions, mockKeywords } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { EditorPanel } from './components/EditorPanel';
import { RightPanel } from './components/RightPanel';
import { PreviewModal } from './components/PreviewModal';

function App() {
  const [sections, setSections] = React.useState<CVSection[]>(mockSections);
  const [activeSection, setActiveSection] = React.useState<string | null>('header');
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>(mockAISuggestions);
  const [currentTemplate, setCurrentTemplate] = React.useState('modern');
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<string>('');

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
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

  const activeSecti = sections.find((s) => s.id === activeSection) || null;

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = React.useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = React.useState(false);

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
        onToggleFloatingPreview={() => setShowFloatingPreview(!showFloatingPreview)}
        showFloatingPreview={showFloatingPreview}
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

        <EditorPanel
          activeSection={activeSecti}
          onContentChange={handleContentChange}
        />

        <RightPanel
          suggestions={suggestions}
          keywords={mockKeywords}
          onAcceptSuggestion={handleAcceptSuggestion}
          onRejectSuggestion={handleRejectSuggestion}
          currentTemplate={currentTemplate}
          onTemplateChange={handleTemplateChange}
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          onToggleFloatingPreview={() => setShowFloatingPreview(!showFloatingPreview)}
          sections={sections}
        />
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        sections={sections}
        template={currentTemplate}
      />
    </div>
  );
}

export default App;
