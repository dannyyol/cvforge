export const createProfessionalStyles = (accentColor: string = '#1f2937') => ({
  page: { paddingTop: 36, paddingBottom: 36, paddingHorizontal: 44, fontSize: 12, color: '#0f172a', fontFamily: 'Helvetica' },
  header: { backgroundColor: accentColor, color: '#fff', padding: 14, marginBottom: 16, borderRadius: 4 },
  name: { fontSize: 24, fontWeight: 800 },
  role: { fontSize: 13, marginTop: 4, color: '#f3f4f6' },
  contact: { fontSize: 11, marginTop: 6, color: '#e5e7eb' },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: accentColor, borderBottomWidth: 2, borderBottomColor: '#e5e7eb', paddingBottom: 4, marginBottom: 8 },
  paragraph: { lineHeight: 1.5, color: '#374151' },
  itemTitle: { fontSize: 12, fontWeight: 700, color: '#0f172a' },
  itemMeta: { fontSize: 11, color: '#6b7280', marginTop: 2 },
});