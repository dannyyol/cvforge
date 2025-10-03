import React from 'react';
import { HeaderContent } from '../../types/cv';

interface HeaderEditorProps {
  content: HeaderContent;
  onChange: (content: HeaderContent) => void;
}

export const HeaderEditor: React.FC<HeaderEditorProps> = ({ content, onChange }) => {
  const handleChange = (field: keyof HeaderContent, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={content.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Professional Title
        </label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={content.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={content.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={content.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            LinkedIn
          </label>
          <input
            type="text"
            value={content.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/..."
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            GitHub
          </label>
          <input
            type="text"
            value={content.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="github.com/..."
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Website
          </label>
          <input
            type="text"
            value={content.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="yoursite.com"
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
