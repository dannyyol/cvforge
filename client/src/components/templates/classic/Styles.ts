export const createClassicStyles = () => ({
  page: { paddingTop: 32, paddingBottom: 32, paddingHorizontal: 40, fontSize: 12, color: '#1f2937', fontFamily: 'Times-Roman' },
  header: { borderBottomWidth: 2, borderBottomColor: '#111827', paddingBottom: 8, marginBottom: 16, alignItems: 'center' as const },
  name: { fontSize: 22, fontWeight: 'bold' as const },
  role: { fontSize: 12, marginTop: 4, color: '#374151' },
  contact: { fontSize: 11, color: '#4b5563', marginTop: 6 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold' as const, textTransform: 'uppercase' as const, color: '#111827', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4, marginBottom: 8 },
  paragraph: { lineHeight: 1.5, color: '#374151' },
  itemTitle: { fontSize: 12, fontWeight: 'bold' as const, color: '#111827' },
  itemMeta: { fontSize: 11, color: '#4b5563', marginTop: 2 },
});