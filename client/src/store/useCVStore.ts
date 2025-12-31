import { create } from 'zustand';
import type { Section, PersonalDetails, WorkExperience, Education, Skill, Project, Certification, Award, Publication, ThemeConfig, TemplateId, TemplateProps } from '../types/resume';

interface CVStore {
  cvData: TemplateProps;
  selectedTemplate: TemplateId;
  setTemplate: (id: TemplateId) => void;
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  updateSummary: (summary: string) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  
  // Section ordering and visibility
  setSections: (sections: Section[]) => void;
  toggleSectionVisibility: (id: string) => void;
  
  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  
  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Skills
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Awards
  // addAward: () => void;
  // updateAward: (id: string, data: Partial<Award>) => void;
  // removeAward: (id: string) => void;

  // // Publications
  // addPublication: () => void;
  // updatePublication: (id: string, data: Partial<Publication>) => void;
  // removePublication: (id: string) => void;
}

const defaultSections: Section[] = [
  { id: 'personal', type: 'personal', title: 'Personal Details', isVisible: true, order: 0 },
  { id: 'summary', type: 'summary', title: 'Professional Summary', isVisible: true, order: 1 },
  { id: 'experience', type: 'experience', title: 'Work Experience', isVisible: true, order: 2 },
  { id: 'education', type: 'education', title: 'Education', isVisible: true, order: 3 },
  { id: 'skills', type: 'skills', title: 'Skills', isVisible: true, order: 4 },
  { id: 'projects', type: 'projects', title: 'Projects', isVisible: true, order: 5 },
  { id: 'certifications', type: 'certifications', title: 'Certifications', isVisible: true, order: 6 },
  // { id: 'awards', type: 'awards', title: 'Awards', isVisible: true, order: 7 },
  // { id: 'publications', type: 'publications', title: 'Publications', isVisible: true, order: 8 },
];

export const initialCVData: TemplateProps = {
  personalDetails: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, San Francisco, CA, United States',
    jobTitle: 'Senior Software Engineer',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: '',
  },
  professionalSummary: {
    content: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Proven track record of delivering scalable solutions and driving technical innovation in fast-paced environments. Passionate about clean code, mentoring junior developers, and staying current with emerging technologies.',
  },
  workExperiences: [
    {
      id: '1',
      company: 'Tech Innovators Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2020-03',
      endDate: '',
      current: true,
      description: 'Leading development of cloud-native applications serving 10M+ users. Architected microservices infrastructure reducing latency by 40%. Mentoring team of 5 junior engineers and conducting code reviews. Technologies: React, Node.js, AWS, Kubernetes, PostgreSQL.',
    },
    {
      id: '2',
      company: 'Digital Solutions Corp',
      position: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2017-06',
      endDate: '2020-02',
      current: false,
      description: 'Developed and maintained enterprise web applications for Fortune 500 clients. Implemented CI/CD pipelines improving deployment frequency by 300%. Collaborated with cross-functional teams to deliver projects on time and within budget.',
    },
    {
      id: '3',
      company: 'StartUp Ventures',
      position: 'Junior Developer',
      location: 'Palo Alto, CA',
      startDate: '2014-07',
      endDate: '2017-05',
      current: false,
      description: 'Built responsive web interfaces and RESTful APIs for SaaS platform. Participated in agile sprints and daily standups. Gained experience in full-stack development and legacy JavaScript frameworks.',
    },
    {
      id: '4',
      company: 'Global Tech Labs',
      position: 'Intern - Software Development',
      location: 'Mountain View, CA',
      startDate: '2013-06',
      endDate: '2013-08',
      current: false,
      description: 'Worked on internal tools for automation testing and data visualization using Python and Flask. Improved build times by 25% through automated CI pipelines.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2012-09',
      endDate: '2014-06',
      current: false,
      description: 'Specialized in distributed systems and machine learning. GPA: 3.9/4.0. Thesis on scalable microservices architecture.',
    },
    {
      id: '2',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2008-09',
      endDate: '2012-06',
      current: false,
      description: "Dean's List all semesters. President of Computer Science Student Association. Graduated Summa Cum Laude.",
    },
    {
      id: '3',
      institution: 'Harvard Extension School',
      degree: 'Certificate',
      fieldOfStudy: 'Data Science & Artificial Intelligence',
      startDate: '2021-01',
      endDate: '2021-12',
      current: false,
      description: 'Completed professional certification in data science and AI. Focused on Python, TensorFlow, and deep learning applications.',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript/TypeScript', level: 'Expert' },
    { id: '2', name: 'React & Next.js', level: 'Expert' },
    { id: '3', name: 'Node.js & Express', level: 'Expert' },
    { id: '4', name: 'AWS & Cloud Architecture', level: 'Advanced' },
    { id: '5', name: 'Docker & Kubernetes', level: 'Advanced' },
    { id: '6', name: 'PostgreSQL & MongoDB', level: 'Advanced' },
    { id: '7', name: 'Python', level: 'Intermediate' },
    { id: '8', name: 'GraphQL', level: 'Intermediate' },
    { id: '9', name: 'CI/CD (GitHub Actions, Jenkins)', level: 'Advanced' },
    { id: '10', name: 'Agile/Scrum', level: 'Advanced' },
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform Redesign',
      description: 'Led complete overhaul of legacy e-commerce platform serving 500K monthly users. Implemented legacy React architecture with TypeScript, reducing page load times by 60% and increasing conversion rates by 25%. Integrated Stripe payment gateway and real-time inventory management.',
      technologies: ['React', 'TypeScript', 'Stripe'],
      link: 'https://example-ecommerce.com',
      startDate: '2023-01',
      endDate: '2023-08',
    },
    {
      id: '2',
      name: 'Real-Time Analytics Dashboard',
      description: 'Built comprehensive analytics dashboard with real-time data visualization using React, D3.js, and WebSockets. Processed millions of events daily with sub-second latency. Enabled business stakeholders to make data-driven decisions faster.',
      technologies: ['React', 'D3.js', 'WebSockets'],
      link: 'https://github.com/johndoe/analytics-dashboard',
      startDate: '2022-06',
      endDate: '2022-12',
    },
    {
      id: '3',
      name: 'Open Source Contribution - React Toolkit',
      description: 'Active contributor to popular open-source React state management library. Implemented performance optimizations reducing bundle size by 30%. Authored documentation and helped triage community issues.',
      technologies: ['React', 'Open Source'],
      link: 'https://github.com/example/react-toolkit',
      startDate: '2021-01',
      endDate: '',
    },
    {
      id: '4',
      name: 'Smart Home IoT Dashboard',
      description: 'Developed a smart home management dashboard integrating IoT sensors with real-time data visualization. Built using Vue.js, Flask, and MQTT. Improved system reliability and reduced response latency by 35%.',
      technologies: ['Vue.js', 'Flask', 'MQTT'],
      link: 'https://github.com/johndoe/smart-home-dashboard',
      startDate: '2020-04',
      endDate: '2020-10',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2023-03',
      expiryDate: '2026-03',
      credentialId: 'AWS-PSA-123456',
      link: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
    },
    {
      id: '2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      issueDate: '2022-09',
      expiryDate: '2025-09',
      credentialId: 'CKA-2022-098765',
      link: 'https://www.cncf.io/certification/cka/',
    },
    {
      id: '3',
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      issueDate: '2021-05',
      expiryDate: '',
      credentialId: 'PSM-I-567890',
      link: 'https://www.scrum.org/professional-scrum-master-i-certification',
    },
    {
      id: '4',
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      issueDate: '2020-08',
      expiryDate: '2023-08',
      credentialId: 'GCPD-2020-334455',
      link: 'https://cloud.google.com/certification/cloud-developer',
    },
  ],
  // awards: [
  //   {
  //     id: '1',
  //     title: 'Employee of the Year',
  //     issuer: 'Tech Innovators Inc.',
  //     date: '2023-12',
  //     description: 'Recognized for outstanding leadership and contributions to cloud infrastructure modernization.',
  //   },
  //   {
  //     id: '2',
  //     title: 'Best Open Source Contributor',
  //     issuer: 'React Developer Community',
  //     date: '2022-06',
  //     description: 'Awarded for impactful open-source contributions and active engagement in the React community.',
  //   },
  // ],
  // publications: [
  //   {
  //     id: '1',
  //     title: 'Optimizing Microservice Architecture for Scalable Web Applications',
  //     publisher: 'IEEE Software Engineering Journal',
  //     date: '2023-05',
  //     description: 'Authored a peer-reviewed paper on design strategies for distributed microservice systems using event-driven patterns.',
  //     link: 'https://ieeexplore.ieee.org/document/1234567',
  //   },
  //   {
  //     id: '2',
  //     title: 'Leveraging AI for Predictive Cloud Scaling',
  //     publisher: 'Medium Technology',
  //     date: '2022-09',
  //     description: 'Published an article exploring AI-driven predictive scaling algorithms for AWS-based cloud infrastructure.',
  //     link: 'https://medium.com/@johndoe/ai-for-cloud-scaling',
  //   },
  // ],
  sections: defaultSections,
  theme: {
    primaryColor: '#475569',
    secondaryColor: '#4b5563',
    fontFamily: '',
  },
};

export const useCVStore = create<CVStore>((set) => ({
  cvData: initialCVData,
  selectedTemplate: 'classic',
  
  setTemplate: (id) => set({ selectedTemplate: id }),
  
  updateTheme: (theme) => set((state) => ({
    cvData: { ...state.cvData, theme: { ...state.cvData.theme, ...theme } }
  })),
  
  updatePersonalDetails: (details) => set((state) => ({
    cvData: { ...state.cvData, personalDetails: { ...state.cvData.personalDetails, ...details } }
  })),
  
  updateSummary: (summary) => set((state) => ({
    cvData: { ...state.cvData, summary }
  })),
  
  setSections: (sections) => set((state) => ({
    cvData: { ...state.cvData, sections }
  })),
  
  toggleSectionVisibility: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      sections: state.cvData.sections.map((s) => 
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      )
    }
  })),
  
  addExperience: () => set((state) => ({
    cvData: {
      ...state.cvData,
      workExperiences: [
        ...state.cvData.workExperiences,
        {
          id: crypto.randomUUID(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        }
      ]
    }
  })),
  
  updateExperience: (id, data) => set((state) => ({
    cvData: {
      ...state.cvData,
      workExperiences: state.cvData.workExperiences.map((exp) => 
        exp.id === id ? { ...exp, ...data } : exp
      )
    }
  })),
  
  removeExperience: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      workExperiences: state.cvData.workExperiences.filter((exp) => exp.id !== id)
    }
  })),
  
  addEducation: () => set((state) => ({
    cvData: {
      ...state.cvData,
      education: [
        ...state.cvData.education,
        {
          id: crypto.randomUUID(),
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        }
      ]
    }
  })),
  
  updateEducation: (id, data) => set((state) => ({
    cvData: {
      ...state.cvData,
      education: state.cvData.education.map((edu) => 
        edu.id === id ? { ...edu, ...data } : edu
      )
    }
  })),
  
  removeEducation: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      education: state.cvData.education.filter((edu) => edu.id !== id)
    }
  })),

  addSkill: () => set((state) => ({
    cvData: {
      ...state.cvData,
      skills: [
        ...state.cvData.skills,
        {
          id: crypto.randomUUID(),
          name: '',
          level: 'Intermediate',
        }
      ]
    }
  })),
  
  updateSkill: (id, data) => set((state) => ({
    cvData: {
      ...state.cvData,
      skills: state.cvData.skills.map((skill) => 
        skill.id === id ? { ...skill, ...data } : skill
      )
    }
  })),
  
  removeSkill: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      skills: state.cvData.skills.filter((skill) => skill.id !== id)
    }
  })),
  
  addProject: () => set((state) => ({
    cvData: {
      ...state.cvData,
      projects: [
        ...state.cvData.projects,
        {
          id: crypto.randomUUID(),
          name: '',
          description: '',
          technologies: [],
          link: '',
        }
      ]
    }
  })),
  
  updateProject: (id, data) => set((state) => ({
    cvData: {
      ...state.cvData,
      projects: state.cvData.projects.map((proj) => 
        proj.id === id ? { ...proj, ...data } : proj
      )
    }
  })),
  
  removeProject: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      projects: state.cvData.projects.filter((proj) => proj.id !== id)
    }
  })),

  addCertification: () => set((state) => ({
    cvData: {
      ...state.cvData,
      certifications: [
        ...state.cvData.certifications,
        {
          id: crypto.randomUUID(),
          name: '',
          issuer: '',
          issueDate: '',
          link: '',
        }
      ]
    }
  })),
  
  updateCertification: (id, data) => set((state) => ({
    cvData: {
      ...state.cvData,
      certifications: state.cvData.certifications.map((cert) => 
        cert.id === id ? { ...cert, ...data } : cert
      )
    }
  })),
  
  removeCertification: (id) => set((state) => ({
    cvData: {
      ...state.cvData,
      certifications: state.cvData.certifications.filter((cert) => cert.id !== id)
    }
  }))

  // addAward: () => set((state) => ({
  //   cvData: {
  //     ...state.cvData,
  //     awards: [
  //       ...state.cvData.awards,
  //       {
  //         id: crypto.randomUUID(),
  //         title: '',
  //         issuer: '',
  //         date: '',
  //         description: '',
  //       }
  //     ]
  //   }
  // })),

  // updateAward: (id, data) => set((state) => ({
  //   cvData: {
  //     ...state.cvData,
  //     awards: state.cvData.awards.map((award) => 
  //       award.id === id ? { ...award, ...data } : award
  //     )
  //   }
  // })),

  // removeAward: (id) => set((state) => ({
  //   cvData: {
  //     ...state.cvData,
  //     awards: state.cvData.awards.filter((award) => award.id !== id)
  //   }
  // })),

  // addPublication: () => set((state) => ({
  //   cvData: {
  //     ...state.cvData,
  //     publications: [
  //       ...state.cvData.publications,
  //       {
  //         id: crypto.randomUUID(),
  //         title: '',
  //         publisher: '',
  //         date: '',
  //         description: '',
  //         link: '',
  //       }
  //     ]
  //   }
  // })),

  // updatePublication: (id, data) => set((state) => ({
  //   cvData: {
  //     ...state.cvData,
  //     publications: state.cvData.publications.map((pub) => 
  //       pub.id === id ? { ...pub, ...data } : pub
  //     )
  //   }
  // })),

  // removePublication: (id) => set((state) => ({
  //   cvData: {
  //     ...state.cvData,
  //     publications: state.cvData.publications.filter((pub) => pub.id !== id)
  //   }
  // })),
}));
