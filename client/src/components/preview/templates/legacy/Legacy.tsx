import React from 'react';
import type { TemplateProps, WorkExperience, Education, Skill, Project, Certification } from '../registry';
import './styles.css';

export default function Legacy({
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

  const appliedFont = theme.fontFamily || '"Source Sans Pro", Roboto, "Segoe UI", -apple-system, system-ui, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

  const formatMonthYear = (s?: string | null) => {
    if (!s) return '';
    const d = new Date(s);
    if (isNaN(d.getTime())) return String(s);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div
      className="cv-html-root cv-legacy"
      style={{ 
        '--font-family': appliedFont,
        fontFamily: appliedFont,
      } as React.CSSProperties}
    >

      <section className="cv-header--full-bleed" data-cv-section data-section-id="header"
      style={{ '--accent-color': theme.primaryColor } as React.CSSProperties}>
        <div className="cv-header-name">{personalDetails?.fullName || 'Your Name'}</div>
        {personalDetails?.jobTitle && (
          <div className="cv-header-role">{personalDetails.jobTitle}</div>
        )}
        <div className="cv-header-contact-grid">
          <div className="cv-contact-col">
            {personalDetails?.phone ? (
              <div className="cv-contact-row">
                <span className="cv-contact-label">Phone</span>
                <span className="cv-contact-value">{personalDetails.phone}</span>
              </div>
            ) : null}
            {personalDetails?.email ? (
              <div className="cv-contact-row">
                <span className="cv-contact-label">E-mail</span>
                <span className="cv-contact-value">{personalDetails.email}</span>
              </div>
            ) : null}
          </div>
          <div className="cv-contact-col">
            {personalDetails?.linkedin ? (
              <div className="cv-contact-row">
                <span className="cv-contact-label">LinkedIn</span>
                <span className="cv-contact-value">{personalDetails.linkedin}</span>
              </div>
            ) : null}
            {personalDetails?.website ? (
              <div className="cv-contact-row">
                <span className="cv-contact-label">Website</span>
                <span className="cv-contact-value">{personalDetails.website}</span>
              </div>
            ) : null}
          </div>
        </div>
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
                <h2 className="cv-section-title">Experience</h2>
                <ul className="cv-list">
                  {workExperiences.map((exp: WorkExperience) => (
                    <li className="cv-list-item" key={exp.id}>
                      <div className="cv-experience-row">
                        <div className="cv-exp-dates">
                          {[
                            formatMonthYear(exp.startDate),
                            exp.current ? 'Present' : formatMonthYear(exp.endDate),
                          ]
                            .filter(Boolean)
                            .join(' — ')}
                        </div>
                        <div className="cv-exp-content">
                          <div className="cv-item-title">
                            {exp.position || 'Job Title'}
                            {exp.company ? <span className="cv-item-divider"> — {exp.company}</span> : null}
                          </div>
                          {exp.location ? <div className="cv-item-meta">{exp.location}</div> : null}
                          {exp.description ? (
                            <div
                              className="cv-paragraph"
                              dangerouslySetInnerHTML={{ __html: exp.description }}
                            />
                          ) : null}
                        </div>
                      </div>
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
                      <div className="cv-education-row">
                        <div className="cv-edu-dates">
                          {[
                            formatMonthYear(ed.startDate),
                            formatMonthYear(ed.endDate),
                          ]
                            .filter(Boolean)
                            .join(' — ')}
                        </div>
                        <div className="cv-edu-content">
                          <div className="cv-item-title">
                            {ed.degree || 'Degree'}
                            {ed.institution ? <span className="cv-item-divider"> — {ed.institution}</span> : null}
                          </div>
                          {ed.fieldOfStudy ? (
                            <div className="cv-item-meta">{ed.fieldOfStudy}</div>
                          ) : null}
                          {ed.description ? (
                            <div
                              className="cv-paragraph"
                              dangerouslySetInnerHTML={{ __html: ed.description }}
                            />
                          ) : null}
                        </div>
                      </div>
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
                <ul className="cv-list">
                  {skills.map((sk: Skill) => (
                    <li key={sk.id} className="cv-list-item">
                      <div className="cv-skill-row">
                        <div className="cv-skill-spacer" />
                        <div className="cv-skill-content">
                          <div className="cv-item-title">
                            {sk.name}
                            {sk.level ? <span className="cv-muted"> ({sk.level})</span> : null}
                          </div>
                        </div>
                      </div>
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
                  {projects.map((p: Project) => (
                    <li className="cv-list-item" key={p.id}>
                      <div className="cv-project-row">
                        <div className="cv-project-dates">
                          {[
                            formatMonthYear(p.startDate),
                            formatMonthYear(p.endDate),
                          ]
                            .filter(Boolean)
                            .join(' — ')}
                        </div>
                        <div className="cv-project-content">
                          <div className="cv-item-title">{p.name || 'Project Title'}</div>
                          {p.link ? <div className="cv-item-meta">{p.link}</div> : null}
                          {p.description ? (
                            <div
                              className="cv-paragraph"
                              dangerouslySetInnerHTML={{ __html: p.description }}
                            />
                          ) : null}
                        </div>
                      </div>
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
                      <div className="cv-cert-row">
                        <div className="cv-cert-dates">
                          {[
                            formatMonthYear(c.issueDate),
                            formatMonthYear(c.expiryDate),
                          ]
                            .filter(Boolean)
                            .join(' — ')}
                        </div>
                        <div className="cv-cert-content">
                          <div className="cv-item-title">{c.name}</div>
                          {c.issuer ? <div className="cv-item-meta">{c.issuer}</div> : null}
                        </div>
                      </div>
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
