import React from 'react';
import { Navbar } from './components/Navbar';

function App() {

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<string>('');

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


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar
        onSave={handleSave}
        onPreview={handlePreview}
        onExportPDF={handleExportPDF}
        onExportDOCX={handleExportDOCX}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />
    </div>
  )
}

export default App
