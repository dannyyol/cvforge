import React from 'react';
import type { TemplateProps, WorkExperience, Education, Skill, Project, Certification } from '../registry';
import './styles.css'

export default function Professional({
  personalDetails,
  professionalSummary,
  workExperiences,
  education,
  skills,
  projects,
  certifications,
  sections,
  theme
}: TemplateProps) {
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  const appliedFont = theme.fontFamily || 'Georgia, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

  const formatMonthYear = (s?: string | null) => {
    if (!s) return '';
    const d = new Date(s);
    if (isNaN(d.getTime())) return String(s);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div
      className="cv-html-root cv-professional"
      style={{ 
        '--accent-color': theme.primaryColor,
        '--font-family': appliedFont,
        fontFamily: appliedFont,
      } as React.CSSProperties}
    >
      <section className="cv-header" data-cv-section data-section-id="header">
        <div className="cv-header-name">{personalDetails?.fullName || 'Your Name'}</div>
        {personalDetails?.jobTitle && (
          <div className="cv-header-role">{personalDetails.jobTitle}</div>
        )}
        <div className="cv-header-contact">
          {personalDetails?.email}
          {personalDetails?.phone ? <span className="cv-header-dot"> | </span> : null}
          {personalDetails?.phone}
          <br />
          {personalDetails?.website}
          {personalDetails?.linkedin ? <span className="cv-header-dot"> | </span> : null}
          {personalDetails?.linkedin}
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
                          {exp.position || 'Job Title'}
                          {exp.company ? <span>, {exp.company}</span>: null}
                        </div>
                        {(exp.startDate || exp.endDate || exp.current) ? (
                          <div className="cv-item-dates">
                            {[
                              formatMonthYear(exp.startDate),
                              exp.current ? 'Present' : formatMonthYear(exp.endDate),
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
            if (!education.length) return null;
            return (
              <section
                key={section.id}
                className="cv-section"
                data-cv-section
                data-section-id={section.id}
              >
                <h2 className="cv-section-title">Education</h2>
                <ul className="cv-list">
                  {education.map((ed: Education) => (
                    <li className="cv-list-item" key={ed.id}>
                      <div className="cv-item-row">
                        <div className="cv-item-title">
                          {ed.degree || 'Degree'}
                          {ed.institution ? <span className="cv-item-divider"> — {ed.institution}</span> : null}
                        </div>
                        {(ed.startDate || ed.endDate) ? (
                          <div className="cv-item-dates">
                            {[
                              formatMonthYear(ed.startDate),
                              formatMonthYear(ed.endDate),
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
            const columns: Skill[][] = Array.from({ length: cols }, (_, i) =>
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
                      {col.map((sk: Skill) => (
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
                  {projects.map((p: Project) => (
                    <li className="cv-list-item" key={p.id}>
                      <div className="cv-item-title">{p.name || 'Project Title'}</div>
                      {p.link ? <div className="cv-item-meta">{p.link}</div> : null}
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
                  {certifications.map((c: Certification) => (
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
