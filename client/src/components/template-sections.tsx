import { WorkExperience, SkillEntry, ProjectEntry, CertificationEntry } from '../types/resume';

export function renderWorkExperience(workExperiences: WorkExperience[]) {
  if (workExperiences.length === 0) return null;

  return workExperiences.map((exp, index) => (
    <div key={exp.id} className={index > 0 ? 'mt-4' : ''}>
      <p className="text-sm font-semibold text-gray-900">
        {exp.job_title || 'Job Title'}
      </p>
      {exp.company && (
        <p className="text-sm text-gray-700 mt-1">{exp.company}</p>
      )}
      {exp.location && (
        <p className="text-sm text-gray-600">{exp.location}</p>
      )}
      {(exp.start_date || exp.end_date) && (
        <p className="text-xs text-gray-500 mt-1">
          {exp.start_date && new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          {' - '}
          {exp.current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
        </p>
      )}
      {exp.description && (
        <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{exp.description}</p>
      )}
    </div>
  ));
}

export function renderSkills(skills: SkillEntry[]) {
  if (skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <div key={skill.id} className="text-sm">
          <span className="font-medium text-gray-900">{skill.name}</span>
          {skill.level && (
            <span className="text-gray-600 ml-1">({skill.level})</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function renderProjects(projects: ProjectEntry[]) {
  if (projects.length === 0) return null;

  return projects.map((project, index) => (
    <div key={project.id} className={index > 0 ? 'mt-4' : ''}>
      <p className="text-sm font-semibold text-gray-900">
        {project.title || 'Project Title'}
      </p>
      {(project.start_date || project.end_date) && (
        <p className="text-xs text-gray-500 mt-1">
          {project.start_date && new Date(project.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          {project.end_date && ' - ' + new Date(project.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </p>
      )}
      {project.url && (
        <p className="text-xs text-blue-600 mt-1 break-all">{project.url}</p>
      )}
      {project.description && (
        <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{project.description}</p>
      )}
    </div>
  ));
}

export function renderCertifications(certifications: CertificationEntry[]) {
  if (certifications.length === 0) return null;

  return certifications.map((cert, index) => (
    <div key={cert.id} className={index > 0 ? 'mt-4' : ''}>
      <p className="text-sm font-semibold text-gray-900">
        {cert.name || 'Certification Name'}
      </p>
      {cert.issuer && (
        <p className="text-sm text-gray-700 mt-1">{cert.issuer}</p>
      )}
      {cert.issue_date && (
        <p className="text-xs text-gray-500 mt-1">
          Issued: {new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          {cert.expiry_date && ` | Expires: ${new Date(cert.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
        </p>
      )}
      {cert.credential_id && (
        <p className="text-xs text-gray-600 mt-1">ID: {cert.credential_id}</p>
      )}
      {cert.url && (
        <p className="text-xs text-blue-600 mt-1 break-all">{cert.url}</p>
      )}
    </div>
  ));
}
