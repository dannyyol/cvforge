import React from 'react';
import { WorkExperience, EducationEntry, SkillEntry, ProjectEntry, CertificationEntry } from '../../../types/resume';
import type { TemplateProps } from '../registry';
import './styles.css'

export default function Professional({
  personalDetails,
  professionalSummary,
  workExperiences,
  educationEntries,
  skills,
  projects,
  certifications,
  sections,
  accentColor = '#0f172a',
}: TemplateProps) {
  const fullName =
    personalDetails ? `${personalDetails.first_name} ${personalDetails.last_name}`.trim() : '';
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  const formatMonthYear = (s?: string | null) => {
    if (!s) return '';
    const d = new Date(s);
    if (isNaN(d.getTime())) return String(s);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div
      className="cv-html-root cv-professional"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <section className="cv-header" data-cv-section data-section-id="header">
        <div className="cv-header-name">{fullName || 'Your Name'}</div>
        {personalDetails?.job_title && (
          <div className="cv-header-role">{personalDetails.job_title}</div>
        )}
        <div className="cv-header-contact">
          {personalDetails?.email}
          {personalDetails?.phone ? <span className="cv-header-dot"> | </span> : null}
          {personalDetails?.phone}
          {personalDetails?.city_state ? <span className="cv-header-dot"> | </span> : null}
          {personalDetails?.city_state}
        </div>
        <div className="cv-header-divider" />
      </section>

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
                <h2 className="cv-section-title">Summary</h2>
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
                <h2 className="cv-section-title">Professional Experience</h2>
                <ul className="cv-list">
                  {workExperiences.map((exp: WorkExperience) => (
                    <li className="cv-list-item" key={exp.id}>
                      <div className="cv-item-row">
                        <div className="cv-item-title">
                          {exp.job_title || 'Job Title'}
                          {exp.company ? <span>, {exp.company}</span>: null}
                        </div>
                        {(exp.start_date || exp.end_date || exp.current) ? (
                          <div className="cv-item-dates">
                            {[
                              formatMonthYear(exp.start_date),
                              exp.current ? 'Present' : formatMonthYear(exp.end_date),
                            ]
                              .filter(Boolean)
                              .join(' — ')}
                          </div>
                        ) : null}
                      </div>
                      {exp.location ? <div className="cv-item-meta">{exp.location}</div> : null}
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
                      <div className="cv-item-row">
                        <div className="cv-item-title">
                          {ed.degree || 'Degree'}
                          {ed.institution ? <span className="cv-item-divider"> — {ed.institution}</span> : null}
                        </div>
                        {(ed.start_date || ed.end_date) ? (
                          <div className="cv-item-dates">
                            {[
                              formatMonthYear(ed.start_date),
                              formatMonthYear(ed.end_date),
                            ]
                              .filter(Boolean)
                              .join(' — ')}
                          </div>
                        ) : null}
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
            const cols = 3;
            const rows = Math.ceil(skills.length / cols);
            const columns: SkillEntry[][] = Array.from({ length: cols }, (_, i) =>
              skills.slice(i * rows, (i + 1) * rows)
            );
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Skills</h2>
                <div className="cv-skills-grid">
                  {columns.map((col, ci) => (
                    <ul key={ci} className="cv-skills-col">
                      {col.map((sk: SkillEntry) => (
                        <li key={sk.id} className="cv-skill-item">
                          {sk.name}
                          {sk.level ? <span className="cv-muted"> ({sk.level})</span> : null}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
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
