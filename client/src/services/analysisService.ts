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

function defaultResolver(req: CVDataPayload): AnalysisResponse {
  const lengthFactor =
    (req.workExperience?.length || 0) * 8 +
    (req.skills?.length || 0) * 3 +
    (req.projects?.length || 0) * 4;

  const score = Math.max(55, Math.min(95, 70 + Math.floor(lengthFactor / 5)));

  return {
    overallScore: score,
    atsScore: 85,
    insights: [
      'Strong action verbs detected in experience section.',
      'Formatting appears ATS-friendly.',
      'Consider adding more industry-specific keywords.',
    ],
    recommendations: [
      'Highlight quantified achievements in summary.',
      'Add links to projects or portfolio.',
      'Group skills by category or proficiency.',
    ],
  };
}

export async function analyzeCV(
  cvData: CVDataPayload,
  opts?: { mock?: boolean; delayMs?: number; resolver?: (req: CVDataPayload) => AnalysisResponse }
): Promise<AnalysisResponse> {
  const mockOptions = opts?.mock
    ? {
        mock: true,
        delayMs: opts.delayMs ?? 1200,
        resolver: opts.resolver ?? defaultResolver,
      }
    : undefined;

  // Returns the parsed response body (typed) from the client
  return api.post<CVDataPayload, AnalysisResponse>('/analyze', cvData, undefined, mockOptions);
}