import type {
  CVSection,
  HeaderContent,
  SummaryContent,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem,
  AISuggestion,
  KeywordCoverage
} from '../types/cv';

export const mockHeader: HeaderContent = {
  fullName: 'Jane Anderson',
  title: 'Senior Product Manager',
  email: 'jane.anderson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/janeanderson',
  github: 'github.com/janeanderson',
  website: 'janeanderson.com'
};

export const mockSummary: SummaryContent = {
  text: 'Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative solutions that drive business growth. Proven track record of launching products that increased revenue by 40% and user engagement by 60%. Expert in agile methodologies, data-driven decision making, and stakeholder management.'
};

export const mockExperience: ExperienceItem[] = [
  {
    id: 'exp-1',
    company: 'TechCorp Inc.',
    position: 'Senior Product Manager',
    location: 'San Francisco, CA',
    startDate: '2020-03',
    endDate: '',
    current: true,
    bullets: [
      'Led product strategy and roadmap for B2B SaaS platform serving 10,000+ enterprise customers',
      'Increased user retention by 45% through implementation of data-driven feature prioritization framework',
      'Managed cross-functional team of 12 engineers, designers, and analysts to deliver 15+ features quarterly',
      'Drove $5M in additional ARR by launching new pricing tier and enterprise features'
    ]
  },
  {
    id: 'exp-2',
    company: 'StartupXYZ',
    position: 'Product Manager',
    location: 'Remote',
    startDate: '2017-06',
    endDate: '2020-02',
    current: false,
    bullets: [
      'Owned end-to-end product lifecycle for mobile app with 500K+ monthly active users',
      'Launched MVP in 4 months using lean startup methodology, achieving product-market fit',
      'Increased conversion rate by 35% through A/B testing and user research initiatives',
      'Collaborated with stakeholders to define KPIs and OKRs aligned with company vision'
    ]
  }
];

export const mockEducation: EducationItem[] = [
  {
    id: 'edu-1',
    institution: 'Stanford University',
    degree: 'Master of Business Administration',
    field: 'Technology Management',
    location: 'Stanford, CA',
    startDate: '2015-09',
    endDate: '2017-06',
    gpa: '3.9',
    honors: ['Dean\'s List', 'Graduate Fellowship']
  },
  {
    id: 'edu-2',
    institution: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    location: 'Berkeley, CA',
    startDate: '2011-09',
    endDate: '2015-05',
    gpa: '3.7',
    honors: ['Magna Cum Laude', 'Honors Program']
  }
];

export const mockSkills: SkillCategory[] = [
  {
    id: 'skill-1',
    category: 'Product Management',
    skills: ['Agile/Scrum', 'Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Analytics']
  },
  {
    id: 'skill-2',
    category: 'Technical',
    skills: ['SQL', 'Python', 'Jira', 'Figma', 'Google Analytics', 'Mixpanel', 'Amplitude']
  },
  {
    id: 'skill-3',
    category: 'Leadership',
    skills: ['Team Management', 'Stakeholder Communication', 'OKRs', 'Strategic Planning']
  }
];

export const mockProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'AI-Powered Recommendation Engine',
    description: 'Machine learning system that personalizes content for users',
    technologies: ['Python', 'TensorFlow', 'AWS', 'PostgreSQL'],
    link: 'github.com/project',
    bullets: [
      'Improved user engagement by 60% through personalized content recommendations',
      'Reduced churn rate by 25% by identifying at-risk users and triggering retention campaigns'
    ]
  }
];

export const mockCertifications: CertificationItem[] = [
  {
    id: 'cert-1',
    name: 'Certified Scrum Product Owner (CSPO)',
    issuer: 'Scrum Alliance',
    date: '2022-03',
    credentialId: 'CSP-1234567'
  },
  {
    id: 'cert-2',
    name: 'Product Management Certificate',
    issuer: 'Product School',
    date: '2021-08'
  }
];

export const mockSections: CVSection[] = [
  { id: 'header', type: 'header', title: 'Header', order: 0, visible: true, content: mockHeader },
  { id: 'summary', type: 'summary', title: 'Professional Summary', order: 1, visible: true, content: mockSummary },
  { id: 'experience', type: 'experience', title: 'Experience', order: 2, visible: true, content: mockExperience },
  { id: 'education', type: 'education', title: 'Education', order: 3, visible: true, content: mockEducation },
  { id: 'skills', type: 'skills', title: 'Skills', order: 4, visible: true, content: mockSkills },
  { id: 'projects', type: 'projects', title: 'Projects', order: 5, visible: true, content: mockProjects },
  { id: 'certifications', type: 'certifications', title: 'Certifications', order: 6, visible: true, content: mockCertifications }
];

export const mockAISuggestions: AISuggestion[] = [
  {
    id: 'sugg-1',
    type: 'bullet',
    sectionId: 'experience',
    itemId: 'exp-1',
    original: 'Led product strategy and roadmap for B2B SaaS platform',
    suggestion: 'Spearheaded product strategy and roadmap for B2B SaaS platform serving 10,000+ enterprise customers, driving 40% revenue growth',
    reason: 'Added quantifiable impact and stronger action verb'
  },
  {
    id: 'sugg-2',
    type: 'keyword',
    sectionId: 'summary',
    suggestion: 'Add "product-market fit" to your summary',
    reason: 'Highly relevant keyword missing from your CV'
  },
  {
    id: 'sugg-3',
    type: 'rephrase',
    sectionId: 'experience',
    itemId: 'exp-2',
    original: 'Worked with stakeholders to define goals',
    suggestion: 'Collaborated with C-level stakeholders to define KPIs and OKRs aligned with company vision',
    reason: 'More specific and impactful language'
  }
];

export const mockKeywords: KeywordCoverage[] = [
  { keyword: 'Agile', present: true, count: 2, importance: 'high' },
  { keyword: 'Product Strategy', present: true, count: 3, importance: 'high' },
  { keyword: 'Cross-functional', present: true, count: 2, importance: 'high' },
  { keyword: 'Data-driven', present: true, count: 2, importance: 'medium' },
  { keyword: 'OKRs', present: true, count: 1, importance: 'medium' },
  { keyword: 'Product-market fit', present: false, count: 0, importance: 'high' },
  { keyword: 'Go-to-market', present: false, count: 0, importance: 'medium' }
];
