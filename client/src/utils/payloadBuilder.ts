import type { TemplateProps } from '../types/resume';
import { mapCVDataToTemplateProps } from '../components/Preview/templates/registry';

export interface CVPayload {
  template: string;
  data: TemplateProps;
}

export const buildCVPayload = (cvData: TemplateProps, templateId: string = 'classic'): CVPayload => {
  return {
    template: templateId,
    data: mapCVDataToTemplateProps(cvData)
  };
};
