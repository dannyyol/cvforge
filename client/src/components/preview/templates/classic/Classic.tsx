import React from 'react';
import type { TemplateProps, WorkExperience, Education, Skill, Project, Certification } from '../registry';
import './styles.css'

export default function Classic({
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

  const appliedFont = theme.fontFamily || '"Times New Roman", Times, serif';

  return (
    <div
      className="cv-html-root cv-classic"
      style={{ 
        '--accent-color': theme.primaryColor,
        '--font-family': appliedFont,
        fontFamily: appliedFont,
      } as React.CSSProperties}
    >
      {/* Header */}
      <section className="cv-header" data-cv-section data-section-id="header">
        <div className="cv-header-name">{personalDetails?.fullName || 'Your Name'}</div>
        {personalDetails?.jobTitle && (
          <div className="cv-header-role">{personalDetails.jobTitle}</div>
        )}
        <div className="cv-header-contact">
          {personalDetails?.email}
          {personalDetails?.phone ? <span className="cv-header-dot"> • </span> : null}
          {personalDetails?.phone}
          <br />
          {personalDetails?.website ? <span className="cv-header-dot"> • </span> : null}
          {personalDetails?.website}
          {personalDetails?.linkedin ? <span className="cv-header-dot"> • </span> : null}
          {personalDetails?.linkedin}
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
                        {exp.position || 'Job Title'}
                        {exp.company ? <span className="cv-item-divider"> — {exp.company}</span> : null}
                      </div>
                      {exp.location ? <div className="cv-item-meta">{exp.location}</div> : null}
                      <div className="cv-item-meta">
                        {[exp.startDate, exp.endDate].filter(Boolean).join(' — ')}
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
                      <div className="cv-item-title">
                        {ed.degree || 'Degree'}
                        {ed.institution ? <span className="cv-item-divider"> — {ed.institution}</span> : null}
                      </div>
                      <div className="cv-item-meta">
                        {[ed.startDate, ed.endDate].filter(Boolean).join(' — ')}
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
                  {skills.map((sk: Skill) => (
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
                  {projects.map((p: Project) => (
                    <li className="cv-list-item" key={p.id}>
                      <div className="cv-item-title">{p.name }</div>
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
