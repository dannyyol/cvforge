import React from 'react';
import { useCVStore } from '../../../store/useCVStore';
import { Input } from '../../ui/Form';
import { User, Mail, Phone, MapPin, Globe, Linkedin, GithubIcon, Briefcase } from 'lucide-react';

export const PersonalDetailsForm = () => {
  const { cvData, updatePersonalDetails } = useCVStore();
  const { personalDetails } = cvData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePersonalDetails({ [name]: value });
  };

  return (
    <div className="form-container">
      <Input
        label="Full Name"
        name="fullName"
        value={personalDetails.fullName}
        onChange={handleChange}
        icon={<User className="w-4 h-4" />}
        placeholder="e.g. John Doe"
      />

      <Input
        label="Job Title"
        name="jobTitle"
        value={personalDetails.jobTitle}
        onChange={handleChange}
        icon={<Briefcase className="w-4 h-4" />}
        placeholder="e.g. Senior Software Engineer"
      />
      
      <div className="form-grid-2">
        <Input
          label="Email"
          type="email"
          name="email"
          value={personalDetails.email}
          onChange={handleChange}
          icon={<Mail className="w-4 h-4" />}
          placeholder="e.g. john@example.com"
        />
        <Input
          label="Phone"
          type="tel"
          name="phone"
          value={personalDetails.phone}
          onChange={handleChange}
          icon={<Phone className="w-4 h-4" />}
          placeholder="e.g. +1 (555) 000-0000"
        />
      </div>

      <Input
        label="Address"
        name="address"
        value={personalDetails.address}
        onChange={handleChange}
        icon={<MapPin className="w-4 h-4" />}
        placeholder="e.g. New York, NY"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="LinkedIn"
          name="linkedin"
          value={personalDetails.linkedin}
          onChange={handleChange}
          icon={<Linkedin className="w-4 h-4" />}
          placeholder="linkedin.com/in/johndoe"
        />
        <Input
          label="GitHub"
          name="github"
          value={personalDetails.github}
          onChange={handleChange}
          icon={<GithubIcon className="w-4 h-4" />}
          placeholder="github.com/johndoe"
        />
      </div>

      <Input
        label="Website"
        name="website"
        value={personalDetails.website}
        onChange={handleChange}
        icon={<Globe className="w-4 h-4" />}
        placeholder="www.johndoe.com"
      />
    </div>
  );
};
