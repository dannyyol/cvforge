import React, { useRef, useEffect, useState } from 'react';
import { CVSection } from '../types/cv';
import { ModernTemplate } from './preview/templates/ModernTemplate';
import { ClassicTemplate } from './preview/templates/ClassicTemplate';
import { MinimalTemplate } from './preview/templates/MinimalTemplate';
import { CreativeTemplate } from './preview/templates/CreativeTemplate';
import { ProfessionalTemplate } from './preview/templates/ProfessionalTemplate';
import { ElegantTemplate } from './preview/templates/ElegantTemplate';
import { CompactTemplate } from './preview/templates/CompactTemplate';
import { BoldTemplate } from './preview/templates/BoldTemplate';

interface TemplateThumbnailProps {
  templateId: string;
  sections: CVSection[];
  isSelected: boolean;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  templateId,
  sections,
  isSelected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const generateThumbnail = async () => {
      if (!containerRef.current) return;

      const renderTemplate = () => {
        switch (templateId) {
          case 'modern':
            return <ModernTemplate sections={sections} />;
          case 'classic':
            return <ClassicTemplate sections={sections} />;
          case 'minimal':
            return <MinimalTemplate sections={sections} />;
          case 'creative':
            return <CreativeTemplate sections={sections} />;
          case 'professional':
            return <ProfessionalTemplate sections={sections} />;
          case 'elegant':
            return <ElegantTemplate sections={sections} />;
          case 'compact':
            return <CompactTemplate sections={sections} />;
          case 'bold':
            return <BoldTemplate sections={sections} />;
          default:
            return <ModernTemplate sections={sections} />;
        }
      };

      try {
        const element = containerRef.current.querySelector('.template-render');
        if (!element) return;

        const scale = 0.15;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = element.getBoundingClientRect();
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(scale, scale);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, rect.width, rect.height);

        const url = canvas.toDataURL('image/png');
        setImageUrl(url);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
      }
    };

    const timeoutId = setTimeout(generateThumbnail, 100);
    return () => clearTimeout(timeoutId);
  }, [templateId, sections]);

  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        return <ModernTemplate sections={sections} />;
      case 'classic':
        return <ClassicTemplate sections={sections} />;
      case 'minimal':
        return <MinimalTemplate sections={sections} />;
      case 'creative':
        return <CreativeTemplate sections={sections} />;
      case 'professional':
        return <ProfessionalTemplate sections={sections} />;
      case 'elegant':
        return <ElegantTemplate sections={sections} />;
      case 'compact':
        return <CompactTemplate sections={sections} />;
      case 'bold':
        return <BoldTemplate sections={sections} />;
      default:
        return <ModernTemplate sections={sections} />;
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="absolute -left-[9999px] top-0"
        style={{ width: '210mm', height: '297mm' }}
      >
        <div className="template-render w-full h-full bg-white">
          {renderTemplate()}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div
        className={`
          aspect-[8.5/11] rounded border overflow-hidden bg-white
          ${isSelected ? 'border-primary-400' : 'border-secondary-300'}
        `}
      >
        <div
          className="w-full h-full"
          style={{
            transform: 'scale(0.15)',
            transformOrigin: 'top left',
            width: '666.67%',
            height: '666.67%',
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </>
  );
};
