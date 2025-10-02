import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { CertificationItem } from '../../types/cv';

interface CertificationsEditorProps {
  content: CertificationItem[];
  onChange: (content: CertificationItem[]) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({
  content,
  onChange
}) => {
  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      link: ''
    };
    onChange([...content, newItem]);
  };

  const updateCertification = (
    id: string,
    field: keyof CertificationItem,
    value: any
  ) => {
    onChange(
      content.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteCertification = (id: string) => {
    onChange(content.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {content.map((cert, idx) => (
        <div key={cert.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                Certification {idx + 1}
              </span>
            </div>
            <button
              onClick={() => deleteCertification(cert.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={cert.name}
              onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
              placeholder="Certification Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                placeholder="Issuing Organization"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <input
              type="text"
              value={cert.credentialId || ''}
              onChange={(e) =>
                updateCertification(cert.id, 'credentialId', e.target.value)
              }
              placeholder="Credential ID (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="text"
              value={cert.link || ''}
              onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
              placeholder="Verification link (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Certification
      </button>
    </div>
  );
};
