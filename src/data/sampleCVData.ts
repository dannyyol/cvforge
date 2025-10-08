import type {
  Resume,
  PersonalDetails,
  ProfessionalSummary,
  EducationEntry,
  WorkExperience,
  SkillEntry,
  ProjectEntry,
  CertificationEntry,
} from '../types/resume';

export const sampleResume: Resume = {
  id: '1',
  user_id: 'sample-user',
  title: 'Software Engineer CV',
  language: 'en',
  cv_score: 85,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-03-20T14:30:00Z',
};

export const samplePersonalDetails: PersonalDetails = {
  id: '1',
  resume_id: '1',
  job_title: 'Senior Software Engineer',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street',
  city_state: 'San Francisco, CA',
  country: 'United States',
};

export const sampleProfessionalSummary: ProfessionalSummary = {
  id: '1',
  resume_id: '1',
  content: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and driving technical innovation in fast-paced environments. Passionate about clean code, mentoring junior developers, and staying current with emerging technologies.',
};

export const sampleEducation: EducationEntry[] = [
  {
    id: '1',
    resume_id: '1',
    institution: 'Stanford University',
    degree: 'Master of Science',
    field_of_study: 'Computer Science',
    start_date: '2012-09',
    end_date: '2014-06',
    description: 'Specialized in distributed systems and machine learning. GPA: 3.9/4.0. Thesis on scalable microservices architecture.',
    sort_order: 0,
  },
  {
    id: '2',
    resume_id: '1',
    institution: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    field_of_study: 'Computer Science',
    start_date: '2008-09',
    end_date: '2012-06',
    description: 'Dean\'s List all semesters. President of Computer Science Student Association. Graduated Summa Cum Laude.',
    sort_order: 1,
  },
];

export const sampleWorkExperience: WorkExperience[] = [
  {
    id: '1',
    resume_id: '1',
    job_title: 'Senior Software Engineer',
    company: 'Tech Innovators Inc.',
    location: 'San Francisco, CA',
    start_date: '2020-03',
    end_date: null,
    current: true,
    description: 'Leading development of cloud-native applications serving 10M+ users. Architected microservices infrastructure reducing latency by 40%. Mentoring team of 5 junior engineers and conducting code reviews. Technologies: React, Node.js, AWS, Kubernetes, PostgreSQL.',
    sort_order: 0,
  },
  {
    id: '2',
    resume_id: '1',
    job_title: 'Software Engineer',
    company: 'Digital Solutions Corp',
    location: 'San Francisco, CA',
    start_date: '2017-06',
    end_date: '2020-02',
    current: false,
    description: 'Developed and maintained enterprise web applications for Fortune 500 clients. Implemented CI/CD pipelines improving deployment frequency by 300%. Collaborated with cross-functional teams to deliver projects on time and within budget.',
    sort_order: 1,
  },
  {
    id: '3',
    resume_id: '1',
    job_title: 'Junior Developer',
    company: 'StartUp Ventures',
    location: 'Palo Alto, CA',
    start_date: '2014-07',
    end_date: '2017-05',
    current: false,
    description: 'Built responsive web interfaces and RESTful APIs for SaaS platform. Participated in agile sprints and daily standups. Gained experience in full-stack development and modern JavaScript frameworks.',
    sort_order: 2,
  },
];

export const sampleSkills: SkillEntry[] = [
  {
    id: '1',
    resume_id: '1',
    name: 'JavaScript/TypeScript',
    level: 'Expert',
    sort_order: 0,
  },
  {
    id: '2',
    resume_id: '1',
    name: 'React & Next.js',
    level: 'Expert',
    sort_order: 1,
  },
  {
    id: '3',
    resume_id: '1',
    name: 'Node.js & Express',
    level: 'Expert',
    sort_order: 2,
  },
  {
    id: '4',
    resume_id: '1',
    name: 'AWS & Cloud Architecture',
    level: 'Advanced',
    sort_order: 3,
  },
  {
    id: '5',
    resume_id: '1',
    name: 'Docker & Kubernetes',
    level: 'Advanced',
    sort_order: 4,
  },
  {
    id: '6',
    resume_id: '1',
    name: 'PostgreSQL & MongoDB',
    level: 'Advanced',
    sort_order: 5,
  },
  {
    id: '7',
    resume_id: '1',
    name: 'Python',
    level: 'Intermediate',
    sort_order: 6,
  },
  {
    id: '8',
    resume_id: '1',
    name: 'GraphQL',
    level: 'Intermediate',
    sort_order: 7,
  },
];

export const sampleProjects: ProjectEntry[] = [
  {
    id: '1',
    resume_id: '1',
    title: 'E-Commerce Platform Redesign',
    description: 'Led complete overhaul of legacy e-commerce platform serving 500K monthly users. Implemented modern React architecture with TypeScript, reducing page load times by 60% and increasing conversion rates by 25%. Integrated Stripe payment gateway and real-time inventory management.',
    start_date: '2023-01',
    end_date: '2023-08',
    url: 'https://example-ecommerce.com',
    sort_order: 0,
  },
  {
    id: '2',
    resume_id: '1',
    title: 'Real-Time Analytics Dashboard',
    description: 'Built comprehensive analytics dashboard with real-time data visualization using React, D3.js, and WebSockets. Processed millions of events daily with sub-second latency. Enabled business stakeholders to make data-driven decisions faster.',
    start_date: '2022-06',
    end_date: '2022-12',
    url: 'https://github.com/johndoe/analytics-dashboard',
    sort_order: 1,
  },
  {
    id: '3',
    resume_id: '1',
    title: 'Open Source Contribution - React Toolkit',
    description: 'Active contributor to popular open-source React state management library. Implemented performance optimizations reducing bundle size by 30%. Authored documentation and helped triage community issues.',
    start_date: '2021-01',
    end_date: null,
    url: 'https://github.com/example/react-toolkit',
    sort_order: 2,
  },
];

export const sampleCertifications: CertificationEntry[] = [
  {
    id: '1',
    resume_id: '1',
    name: 'AWS Certified Solutions Architect - Professional',
    issuer: 'Amazon Web Services',
    issue_date: '2023-03',
    expiry_date: '2026-03',
    credential_id: 'AWS-PSA-123456',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
    sort_order: 0,
  },
  {
    id: '2',
    resume_id: '1',
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    issue_date: '2022-09',
    expiry_date: '2025-09',
    credential_id: 'CKA-2022-098765',
    url: 'https://www.cncf.io/certification/cka/',
    sort_order: 1,
  },
  {
    id: '3',
    resume_id: '1',
    name: 'Professional Scrum Master I',
    issuer: 'Scrum.org',
    issue_date: '2021-05',
    expiry_date: null,
    credential_id: 'PSM-I-567890',
    url: 'https://www.scrum.org/professional-scrum-master-i-certification',
    sort_order: 2,
  },
];

export const sampleCVData = {
  resume: sampleResume,
  personalDetails: samplePersonalDetails,
  professionalSummary: sampleProfessionalSummary,
  education: sampleEducation,
  workExperience: sampleWorkExperience,
  skills: sampleSkills,
  projects: sampleProjects,
  certifications: sampleCertifications,
};
