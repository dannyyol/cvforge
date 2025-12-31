import { useCVStore } from '../../store/useCVStore';
import { getTemplateComponent, mapCVDataToTemplateProps, type TemplateId } from './templates/registry';
import PaginatedPreview from './PaginatedPreview';

interface CVPreviewProps {
  scaleMode?: 'fit' | 'fill';
}

export const CVPreview = ({ scaleMode = "fit" }: CVPreviewProps) => {
  const { cvData, selectedTemplate } = useCVStore();

  const renderTemplate = () => {
    // Fallback to 'classic' if selectedTemplate is not valid or is 'modern' (which was deleted)
    const templateId = selectedTemplate as TemplateId;
    const TemplateComponent = getTemplateComponent(templateId);
    const templateProps = mapCVDataToTemplateProps(cvData);
    
    return <TemplateComponent {...templateProps} />;
  };

  return (
    <div className="flex justify-center w-full">
      <PaginatedPreview 
        templateId={selectedTemplate}
        accentColor={cvData.theme.primaryColor}
        fontFamily={cvData.theme.fontFamily}
        scaleMode={scaleMode}
      >
        {renderTemplate()}
      </PaginatedPreview>
    </div>
  );
};
