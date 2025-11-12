export function stripHtml(str?: string | null): string {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').replace(/\s+\n/g, '\n').trim();
}