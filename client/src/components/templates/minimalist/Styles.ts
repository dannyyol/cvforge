export const createMinimalistStyles = () => ({
  page: { paddingTop: 40, paddingBottom: 40, paddingHorizontal: 48, fontSize: 12, color: '#111827', fontFamily: 'Helvetica' },
  header: { marginBottom: 24 },
  name: { fontSize: 26, fontWeight: 'normal' as const },
  role: { fontSize: 14, color: '#4b5563', marginTop: 6 },
  contact: { fontSize: 11, color: '#6b7280', marginTop: 6 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const, color: '#111827', marginBottom: 10 },
  paragraph: { lineHeight: 1.6, color: '#374151' },
  itemTitle: { fontSize: 12, fontWeight: 'bold' as const, color: '#111827' },
  itemMeta: { fontSize: 11, color: '#6b7280', marginTop: 2 },
} as const);