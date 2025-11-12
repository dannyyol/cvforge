export const createModernStyles = (accentColor: string = '#334155') => ({
  page: { paddingTop: 32, paddingBottom: 32, paddingHorizontal: 40, fontSize: 12, color: '#0f172a', fontFamily: 'Helvetica' },
  header: { backgroundColor: accentColor, color: '#fff', padding: 16, marginBottom: 16, borderRadius: 4 },
  name: { fontSize: 22, fontWeight: 700 },
  role: { fontSize: 13, marginTop: 4 },
  contact: { fontSize: 11, marginTop: 6, color: '#e5e7eb' },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: accentColor, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4, marginBottom: 8 },
  paragraph: { lineHeight: 1.5, color: '#334155' },
  itemTitle: { fontSize: 12, fontWeight: 700, color: '#0f172a' },
  itemMeta: { fontSize: 11, color: '#64748b', marginTop: 2 },
});