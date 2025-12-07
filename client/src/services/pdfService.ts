import { api } from './apiClient';
import { TemplateId } from '../components/templates/registry';
import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../types/resume';

export type ExportPayload = {
  template: TemplateId;
  data: {
    sections: {
      personalDetails: PersonalDetails | null;
      professionalSummary: ProfessionalSummary | null;
      workExperiences: WorkExperience[];
      education: EducationEntry[];
      skills: SkillEntry[];
      projects: ProjectEntry[];
      certifications: CertificationEntry[];
    };
    sectionStatus: CVSection[];
    accentColor?: string;
  };
};

export async function exportResumeToPDF(payload: ExportPayload, filename = 'cv.pdf') {
  const res = await api.client.post('/export-pdf', payload, { responseType: 'blob' });
  const blob = new Blob([res.data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

