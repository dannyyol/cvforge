import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { TemplateProps } from '../registry';
import { createModernStyles } from './Styles';

export default function PdfModern({
  personalDetails,
  professionalSummary,
  workExperiences,
  educationEntries,
  skills,
  projects,
  certifications,
  sections,
  accentColor = '#334155',
}: TemplateProps) {
  const styles = createModernStyles(accentColor);
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

   
      </Page>
    </Document>
  );
}