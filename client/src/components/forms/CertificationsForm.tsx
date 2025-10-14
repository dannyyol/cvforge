import { CertificationEntry } from '../../types/resume';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface CertificationsFormProps {
  certifications: CertificationEntry[];
  onChange: (certifications: CertificationEntry[]) => void;
}

export default function CertificationsForm({ certifications, onChange }: CertificationsFormProps) {
  const handleAdd = () => {
    const newCertification: CertificationEntry = {
      id: crypto.randomUUID(),
      resume_id: certifications[0]?.resume_id || '',
      name: '',
      issuer: '',
      issue_date: null,
      expiry_date: null,
      credential_id: '',
      url: '',
      sort_order: certifications.length,
    };
    onChange([...certifications, newCertification]);
  };

  const handleRemove = (id: string) => {
    onChange(certifications.filter((cert) => cert.id !== id));
  };

  const handleChange = (id: string, field: keyof CertificationEntry, value: string) => {
    onChange(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  return (
    <div className="form-container">
      {certifications.map((cert, index) => (
        <div key={cert.id} className="form-card">
          <div className="form-section-header">
            <div className="flex items-center gap-2">
              <GripVertical className="form-drag-handle" />
              <span className="form-section-title">
                Certification {index + 1}
              </span>
            </div>
            <button
              onClick={() => handleRemove(cert.id)}
              className="form-delete-btn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="form-grid-2">
            <div className="col-span-2">
              <label className="form-label">
                Certification Name
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => handleChange(cert.id, 'name', e.target.value)}
                className="form-input"
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>

            <div className="col-span-2">
              <label className="form-label">
                Issuing Organization
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => handleChange(cert.id, 'issuer', e.target.value)}
                className="form-input"
                placeholder="e.g. Amazon Web Services"
              />
            </div>

            <div>
              <label className="form-label">
                Issue Date
              </label>
              <input
                type="date"
                value={cert.issue_date || ''}
                onChange={(e) => handleChange(cert.id, 'issue_date', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={cert.expiry_date || ''}
                onChange={(e) => handleChange(cert.id, 'expiry_date', e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Credential ID
              </label>
              <input
                type="text"
                value={cert.credential_id}
                onChange={(e) => handleChange(cert.id, 'credential_id', e.target.value)}
                className="form-input"
                placeholder="Credential ID"
              />
            </div>

            <div>
              <label className="form-label">
                Verification URL
              </label>
              <input
                type="url"
                value={cert.url}
                onChange={(e) => handleChange(cert.id, 'url', e.target.value)}
                className="form-input"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="form-add-btn"
      >
        <Plus className="w-5 h-5" />
        Add Certification
      </button>
    </div>
  );
}
