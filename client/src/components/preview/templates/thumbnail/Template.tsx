import { initialCVData } from '../../../../store/useCVStore';
import { getTemplateComponent, mapCVDataToTemplateProps, type TemplateId } from '../registry';

const A4_UK = {
  width: 794,
  height: 1123,
  margin: 40,
};

export default function Template() {
  const params = new URLSearchParams(window.location.search);
  const templateParam = (params.get('template') as TemplateId) || 'classic';
  const accent = params.get('accent') || 'slate';

  const commonProps = mapCVDataToTemplateProps(initialCVData, accent);

  const renderTemplate = () => {
    const TemplateComponent = getTemplateComponent(templateParam);
    return <TemplateComponent {...commonProps} />;
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex items-center justify-center py-8">
      <div
        className="page bg-white"
        style={{
          width: `${A4_UK.width}px`,
          height: `${A4_UK.height}px`,
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <div
          className="page-inner cv-preview-container"
          style={{
            boxSizing: 'border-box',
            width: `${A4_UK.width}px`,
            height: `${A4_UK.height}px`,
            padding: `${A4_UK.margin}px`,
            overflow: 'hidden',
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}