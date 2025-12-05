import { PersonalDetails } from '../../types/resume';

interface PersonalDetailsFormProps {
  details: PersonalDetails | null;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

export default function PersonalDetailsForm({ details, onChange }: PersonalDetailsFormProps) {
  return (
    <div className="form-container">
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

        <div className="form-grid-2">
          <div>
            <label className="form-label">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
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
              placeholder="Enter your last name"
              value={details?.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              className="form-input-soft"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
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
              placeholder="+1 (555) 123-4567"
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
            placeholder="City, State, Country"
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
    </div>
  );
}
