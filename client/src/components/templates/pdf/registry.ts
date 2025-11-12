import React from 'react';
import { TemplateId, TemplateProps } from '../registry';
import PdfClassic from '../classic/Classic';
import PdfModern from '../modern/Modern';
import PdfMinimalist from '../minimalist/Minimalist';
import PdfProfessional from '../professional/Professional';

export type PdfTemplateComponent = React.ComponentType<TemplateProps>;

const PDF_TEMPLATE_REGISTRY: Record<TemplateId, PdfTemplateComponent> = {
  classic: PdfClassic,
  modern: PdfModern,
  minimalist: PdfMinimalist,
  professional: PdfProfessional,
};

export function getPdfTemplateComponent(id: TemplateId): PdfTemplateComponent {
  return PDF_TEMPLATE_REGISTRY[id] ?? PDF_TEMPLATE_REGISTRY.classic;
}

export type TemplateId = 'classic' | 'modern' | 'minimalist' | 'professional';
