import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginatedPreview from '../components/Preview/PaginatedPreview';
import { getTemplateComponent, type TemplateId } from '../components/Preview/templates/registry';
import { type TemplateProps } from '../types/resume';
import { api } from '../services/apiClient';

export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TemplateProps | null>(null);

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
        const res = await api.get<TemplateProps>(`/cv-data/${token}`);
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
    <PaginatedPreview templateId={templateId} accentColor={data.theme.primaryColor} fontFamily={data.theme.fontFamily} renderAll>
      <TemplateComponent
        {...data}
      />
    </PaginatedPreview>
  );
}
