import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { TemplateProps } from '../registry';
import { createMinimalistStyles } from './Styles';
import { stripHtml } from '../pdf/utils';

export default function PdfMinimalist(props: TemplateProps) {
  const styles = createMinimalistStyles();
  const { personalDetails, professionalSummary, workExperiences, educationEntries, skills, projects, certifications, sections } = props;
  const fullName = personalDetails ? `${personalDetails.first_name} ${personalDetails.last_name}`.trim() : '';
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{fullName || 'Your Name'}</Text>
          {personalDetails?.job_title && <Text style={styles.role}>{personalDetails.job_title}</Text>}
          <Text style={styles.contact}>
            {personalDetails?.email || ''}{personalDetails?.phone ? `  •  ${personalDetails.phone}` : ''}
          </Text>
        </View>

        {orderedSections.map((s) => {
          switch (s.id) {
            case 'summary':
              if (!professionalSummary?.content) return null;
              return (
                <View key={s.id} style={styles.section} wrap>
                  <Text style={styles.sectionTitle}>Professional Summary</Text>
                  <Text style={styles.paragraph}>{stripHtml(professionalSummary.content)}</Text>
                </View>
              );
            case 'experience':
              if (!workExperiences.length) return null;
              return (
                <View key={s.id} style={styles.section} wrap>
                  <Text style={styles.sectionTitle}>Work Experience</Text>
                  {workExperiences.map((exp) => (
                    <View key={exp.id} style={{ marginBottom: 8 }}>
                      <Text style={styles.itemTitle}>{exp.job_title || 'Job Title'}{exp.company ? ` — ${exp.company}` : ''}</Text>
                      {exp.location ? <Text style={styles.itemMeta}>{exp.location}</Text> : null}
                      {exp.description ? <Text style={styles.paragraph}>{stripHtml(exp.description)}</Text> : null}
                    </View>
                  ))}
                </View>
              );
            case 'education':
              if (!educationEntries.length) return null;
              return (
                <View key={s.id} style={styles.section} wrap>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {educationEntries.map((ed) => (
                    <View key={ed.id} style={{ marginBottom: 8 }}>
                      <Text style={styles.itemTitle}>{ed.degree || 'Degree'}{ed.institution ? ` — ${ed.institution}` : ''}</Text>
                      <Text style={styles.itemMeta}>{[ed.start_date, ed.end_date].filter(Boolean).join(' — ')}</Text>
                      {ed.description ? <Text style={styles.paragraph}>{stripHtml(ed.description)}</Text> : null}
                    </View>
                  ))}
                </View>
              );
            case 'skills':
              if (!skills.length) return null;
              return (
                <View key={s.id} style={styles.section} wrap>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  <Text style={styles.paragraph}>
                    {skills.map((sk) => `${sk.name}${sk.level ? ` (${sk.level})` : ''}`).join(' • ')}
                  </Text>
                </View>
              );
            case 'projects':
              if (!projects.length) return null;
              return (
                <View key={s.id} style={styles.section} wrap>
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {projects.map((p) => (
                    <View key={p.id} style={{ marginBottom: 8 }}>
                      <Text style={styles.itemTitle}>{p.title || 'Project Title'}</Text>
                      {p.url ? <Text style={styles.itemMeta}>{p.url}</Text> : null}
                      {p.description ? <Text style={styles.paragraph}>{stripHtml(p.description)}</Text> : null}
                    </View>
                  ))}
                </View>
              );
            case 'certifications':
              if (!certifications.length) return null;
              return (
                <View key={s.id} style={styles.section} wrap>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                  {certifications.map((c) => (
                    <View key={c.id} style={{ marginBottom: 6 }}>
                      <Text style={styles.itemTitle}>{c.name}</Text>
                      {c.issuer ? <Text style={styles.itemMeta}>{c.issuer}</Text> : null}
                    </View>
                  ))}
                </View>
              );
            default:
              return null;
          }
        })}
      </Page>
    </Document>
  );
}