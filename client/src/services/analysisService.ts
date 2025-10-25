import { api } from './apiClient';
import {
  PersonalDetails,
  ProfessionalSummary,
  EducationEntry,
  WorkExperience,
  SkillEntry,
  ProjectEntry,
  CertificationEntry,
  CVSection,
  TemplateId,
  Resume,
} from '../types/resume';

export interface CVDataPayload {
  resume: Partial<Resume>;
  personalDetails: PersonalDetails | null;
  professionalSummary: ProfessionalSummary | null;
  education: EducationEntry[];
  workExperience: WorkExperience[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  templateId: TemplateId;
  accentColor?: string;
  sections: CVSection[];
}

export interface AnalysisResponse {
  overallScore: number;
  atsScore: number;
  insights: string[];
  recommendations: string[];
}

export async function analyzeCV(
  cvData: CVDataPayload,
  opts?: { mock?: boolean; delayMs?: number; resolver?: (req: CVDataPayload) => AnalysisResponse }
): Promise<AnalysisResponse> {
  const mockOptions = opts?.mock
    ? {
        mock: true,
        delayMs: opts.delayMs ?? 1200,
        resolver: opts.resolver,
      }
    : undefined;

  // Returns the parsed response body (typed) from the client
  return api.post<CVDataPayload, AnalysisResponse>('/analyze', cvData, undefined);
}