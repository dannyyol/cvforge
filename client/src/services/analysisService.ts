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
  Resume,
} from '../types/resume';

import { TemplateId } from '../../src/components/templates/registry';

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
        resolver: () =>
          opts?.resolver
            ? opts.resolver(cvData)
            : { overallScore: 0, atsScore: 0, insights: [], recommendations: [] },
      }
    : undefined;

  return api.post<CVDataPayload, AnalysisResponse>('/analyze', cvData, undefined, mockOptions);
}

export interface AIReviewResponse {
  overall_score: number;
  strengths: string[];
  areas_to_improve: string[];
  sections: Array<{
    name: string;
    score: number;
    suggestions: string[];
  }>;
  atsCompatibility: { score: number; summary: string[] };
  contentQuality: { score: number; summary: string[] };
  formattingAnalysis: { score: number; summary: string[] };
}

export async function submitCVForReview(cvData: CVDataPayload): Promise<AIReviewResponse> {
  return api.post<CVDataPayload, AIReviewResponse>('/review', cvData);
}