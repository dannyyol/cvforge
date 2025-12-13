import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginatedPreview from '../components/preview/PaginatedPreview';
import { getTemplateComponent, TemplateId } from '../components/templates/registry';
import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../types/resume';
import { api } from '../services/apiClient';

type PreviewDataResponse = {
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

export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PreviewDataResponse | null>(null);

  const templateId = useMemo<TemplateId>(() => {
    const t = searchParams.get('template') || 'classic';
    return (t as TemplateId) || 'classic';
  }, [searchParams]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Missing token');
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await api.get<PreviewDataResponse>(`/cv-data/${token}`);
        setData(res);
      } catch (e) {
        setError('Failed to load preview data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">No data</div>;

  const TemplateComponent = getTemplateComponent(templateId);

  return (
    // <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-neutral-900 dark:text-slate-100">
      // <div className="">
        <PaginatedPreview templateId={templateId} accentColor={data.accentColor} renderAll>
          <TemplateComponent
            personalDetails={data.sections.personalDetails}
            professionalSummary={data.sections.professionalSummary}
            workExperiences={data.sections.workExperiences}
            educationEntries={data.sections.education}
            skills={data.sections.skills}
            projects={data.sections.projects}
            certifications={data.sections.certifications}
            sections={data.sectionStatus}
            accentColor={data.accentColor}
          />
        </PaginatedPreview>
    //   </div>
    // </div>
  );
}
