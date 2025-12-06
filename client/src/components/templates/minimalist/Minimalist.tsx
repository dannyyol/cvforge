import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { TemplateProps } from '../registry';
import { createMinimalistStyles } from './Styles';

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
            {personalDetails?.email || ''}{personalDetails?.phone ? `  •  ${personalDetails.phone}` : ''}{personalDetails?.city_state ? `  •  ${personalDetails.city_state}` : ''}{personalDetails?.website ? `  •  ${personalDetails.website}` : ''}{personalDetails?.linkedin ? `  •  ${personalDetails.linkedin}` : ''}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
