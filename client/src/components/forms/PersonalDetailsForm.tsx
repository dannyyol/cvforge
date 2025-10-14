import { PersonalDetails } from '../../types/resume';
import { Lock } from 'lucide-react';

interface PersonalDetailsFormProps {
  details: PersonalDetails | null;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

export default function PersonalDetailsForm({ details, onChange }: PersonalDetailsFormProps) {
  return (
    <div className="space-y-8">
        <div>
          <label className="form-label-wide">
            Job Title
          </label>
          <input
            type="text"
            placeholder="The role you want"
            value={details?.job_title || ''}
            onChange={(e) => onChange('job_title', e.target.value)}
            className="form-input-soft"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              First Name
            </label>
            <input
              type="text"
              value={details?.first_name || ''}
              onChange={(e) => onChange('first_name', e.target.value)}
              className="form-input-soft"
            />
          </div>

          <div>
            <label className="form-label">
              Last Name
            </label>
            <input
              type="text"
              value={details?.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              className="form-input-soft"
            />
          </div>
        </div>

        <div className="relative">
          <label className="form-label">
            Photo
          </label>
          <div className="form-photo-box">
            <Lock className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="form-helper-text">
            This template doesn't support photo upload
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              value={details?.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              className="form-input-soft"
            />
          </div>

          <div>
            <label className="form-label">
              Phone
            </label>
            <input
              type="tel"
              value={details?.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              className="form-input-soft"
            />
          </div>
        </div>

        <div>
          <label className="form-label">
            Address
          </label>
          <input
            type="text"
            value={details?.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            className="form-input-soft"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              City / State
            </label>
            <input
              type="text"
              value={details?.city_state || ''}
              onChange={(e) => onChange('city_state', e.target.value)}
              className="form-input-soft"
            />
          </div>

          <div>
            <label className="form-label">
              Country
            </label>
            <input
              type="text"
              value={details?.country || ''}
              onChange={(e) => onChange('country', e.target.value)}
              className="form-input-soft"
            />
          </div>
        </div>

      <button className="form-link">
        Add more details
        <span className="ml-1">↓</span>
      </button>
    </div>
  );
}
