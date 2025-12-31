import React from 'react';
import { useCVStore } from '../../../store/useCVStore';
import { Plus, Trash2, ChevronDown, Award, Building, Calendar, Link } from 'lucide-react';
import { Input } from '../../ui/Form';
import type { Certification } from '../../../types/resume';

const CertificationItem = ({ certification, isOpen, onToggle }: { certification: Certification; isOpen: boolean; onToggle: () => void }) => {
  const { updateCertification, removeCertification } = useCVStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCertification(certification.id, { [name]: value });
  };

  return (
    <div className="item-card group">
      <div 
        className="item-header"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
             <div className="item-icon-container">
                <Award className="w-4 h-4" />
            </div>
            <div>
                <div className="font-bold text-gray-800">{certification.name || 'New Certification'}</div>
                <div className="text-sm text-gray-500 font-medium">{certification.issuer ? certification.issuer : 'Issuer'}</div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeCertification(certification.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                title="Delete certification"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <div className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="item-content">
          <div className="form-grid-2">
             <Input
                label="Certification Name"
                name="name"
                value={certification.name}
                onChange={handleChange}
                placeholder="e.g. AWS Certified Solutions Architect"
                icon={<Award className="w-4 h-4" />}
             />
             <Input
                label="Issuer"
                name="issuer"
                value={certification.issuer}
                onChange={handleChange}
                placeholder="e.g. Amazon Web Services"
                icon={<Building className="w-4 h-4" />}
             />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input
                label="Date"
                name="date"
                value={certification.issueDate}
                onChange={handleChange}
                placeholder="e.g. 2023"
                icon={<Calendar className="w-4 h-4" />}
             />
             <Input
                label="Expiry Date"
                name="expiryDate"
                value={certification.expiryDate}
                onChange={handleChange}
                placeholder="e.g. 2026"
                icon={<Calendar className="w-4 h-4" />}
             />
          </div>
          <div className="form-grid-2">
             <Input
                label="Credential ID"
                name="credentialId"
                value={certification.credentialId}
                onChange={handleChange}
                placeholder="e.g. AWS-PSA-123"
                icon={<Award className="w-4 h-4" />}
             />
             <Input
                label="Link (Credential URL)"
                name="link"
                value={certification.link}
                onChange={handleChange}
                placeholder="https://..."
                icon={<Link className="w-4 h-4" />}
             />
          </div>
        </div>
      )}
    </div>
  );
};

export const CertificationsForm = () => {
    const { cvData, addCertification } = useCVStore();
    const [openId, setOpenId] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="form-container">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Certifications</h3>
                    <p className="text-sm text-gray-500">Add your professional certifications and licenses.</p>
                 </div>
            </div>
            
            {cvData.certifications.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">No certifications added yet</p>
                    <p className="text-sm text-gray-500 mb-4">Add certifications to validate your skills.</p>
                    <button 
                        onClick={() => addCertification()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Certification
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cvData.certifications.map((cert) => (
                        <CertificationItem
                            key={cert.id}
                            certification={cert}
                            isOpen={openId === cert.id}
                            onToggle={() => handleToggle(cert.id)}
                        />
                    ))}
                    
                    <button
                        onClick={() => addCertification()}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Another Certification
                    </button>
                </div>
            )}
        </div>
    );
};
