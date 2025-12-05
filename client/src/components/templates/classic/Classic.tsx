import React from 'react';
import { WorkExperience, EducationEntry, SkillEntry, ProjectEntry, CertificationEntry } from '../../../types/resume';
import type { TemplateProps } from '../registry';
import './styles.css'

export default function Classic({
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
  const fullName =
    personalDetails ? `${personalDetails.first_name} ${personalDetails.last_name}`.trim() : '';
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div
      className="cv-html-root cv-classic"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Header */}
      <section className="cv-header" data-cv-section data-section-id="header">
        <div className="cv-header-name">{fullName || 'Your Name'}</div>
        {personalDetails?.job_title && (
          <div className="cv-header-role">{personalDetails.job_title}</div>
        )}
        <div className="cv-header-contact">
          {personalDetails?.email}
          {personalDetails?.phone ? <span className="cv-header-dot"> • </span> : null}
          {personalDetails?.phone}
          {personalDetails?.city_state ? <span className="cv-header-dot"> • </span> : null}
          {personalDetails?.city_state}
        </div>
        <div className="cv-header-divider" />
      </section>

      {/* Sections */}
      {orderedSections.map((section) => {
        switch (section.id) {
          case 'summary': {
            if (!professionalSummary?.content) return null;
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Professional Summary</h2>
                <div
                  className="cv-paragraph"
                  dangerouslySetInnerHTML={{ __html: professionalSummary.content }}
                />
              </section>
            );
          }
          case 'experience': {
            if (!workExperiences.length) return null;
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Work Experience</h2>
                <ul className="cv-list">
                  {workExperiences.map((exp: WorkExperience) => (
                    <li className="cv-list-item" key={exp.id}>
                      <div className="cv-item-title">
                        {exp.job_title || 'Job Title'}
                        {exp.company ? <span className="cv-item-divider"> — {exp.company}</span> : null}
                      </div>
                      {exp.location ? <div className="cv-item-meta">{exp.location}</div> : null}
                      <div className="cv-item-meta">
                        {[exp.start_date, exp.end_date].filter(Boolean).join(' — ')}
                      </div>
                      {exp.description ? (
                        <div
                          className="cv-paragraph"
                          dangerouslySetInnerHTML={{ __html: exp.description }}
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          case 'education': {
            if (!educationEntries.length) return null;
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Education</h2>
                <ul className="cv-list">
                  {educationEntries.map((ed: EducationEntry) => (
                    <li className="cv-list-item" key={ed.id}>
                      <div className="cv-item-title">
                        {ed.degree || 'Degree'}
                        {ed.institution ? <span className="cv-item-divider"> — {ed.institution}</span> : null}
                      </div>
                      <div className="cv-item-meta">
                        {[ed.start_date, ed.end_date].filter(Boolean).join(' — ')}
                      </div>
                      {ed.description ? (
                        <div
                          className="cv-paragraph"
                          dangerouslySetInnerHTML={{ __html: ed.description }}
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          case 'skills': {
            if (!skills.length) return null;
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Skills</h2>
                <ul className="cv-inline-list">
                  {skills.map((sk: SkillEntry) => (
                    <li key={sk.id} className="cv-inline-item">
                      {sk.name}
                      {sk.level ? <span className="cv-muted"> ({sk.level})</span> : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          case 'projects': {
            if (!projects.length) return null;
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Projects</h2>
                <ul className="cv-list">
                  {projects.map((p: ProjectEntry) => (
                    <li className="cv-list-item" key={p.id}>
                      <div className="cv-item-title">{p.title || 'Project Title'}</div>
                      {p.url ? <div className="cv-item-meta">{p.url}</div> : null}
                      {p.description ? (
                        <div
                          className="cv-paragraph"
                          dangerouslySetInnerHTML={{ __html: p.description }}
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          case 'certifications': {
            if (!certifications.length) return null;
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Certifications</h2>
                <ul className="cv-list">
                  {certifications.map((c: CertificationEntry) => (
                    <li className="cv-list-item" key={c.id}>
                      <div className="cv-item-title">{c.name}</div>
                      {c.issuer ? <div className="cv-item-meta">{c.issuer}</div> : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
