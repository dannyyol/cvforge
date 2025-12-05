import { useState, DragEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DownloadDropdown from '../components/DownloadDropdown';
import CVTitleCard from '../components/CVTitleCard';
import PersonalDetailsForm from '../components/forms/PersonalDetailsForm';
import ProfessionalSummaryForm from '../components/forms/ProfessionalSummaryForm';
import WorkExperienceForm from '../components/forms/WorkExperienceForm';
import EducationForm from '../components/forms/EducationForm';
import SkillsForm from '../components/forms/SkillsForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import CertificationsForm from '../components/forms/CertificationsForm';
import DraggableSection from '../components/DraggableSection';
import CVPreview from '../components/preview/CVPreview';
import CustomizationSidebar from '../components/CustomizationSidebar';
import CustomizationPreview from '../components/preview/CustomizationPreview';
import MobileTabNav from '../components/MobileTabNav';
import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection, SectionType } from '../types/resume';
import { sampleCVData } from '../data/sampleCVData';
import { TEMPLATE_REGISTRY, TemplateId } from '../components/templates/registry';

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const [resumeId] = useState(sampleCVData.resume.id);
  const [resumeTitle, setResumeTitle] = useState(sampleCVData.resume.title);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [language] = useState(sampleCVData.resume.language);
  const [cvScore] = useState(sampleCVData.resume.cv_score);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(sampleCVData.personalDetails);
  const [professionalSummary, setProfessionalSummary] = useState<ProfessionalSummary | null>(sampleCVData.professionalSummary);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(sampleCVData.workExperience);
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(sampleCVData.education);
  const [skills, setSkills] = useState<SkillEntry[]>(sampleCVData.skills);
  const [projects, setProjects] = useState<ProjectEntry[]>(sampleCVData.projects);
  const [certifications, setCertifications] = useState<CertificationEntry[]>(sampleCVData.certifications);
  const [sections, setSections] = useState<CVSection[]>([
    { id: 'header', title: 'Personal Details', isOpen: true, order: 0 },
    { id: 'summary', title: 'Professional Summary', isOpen: true, order: 1 },
    { id: 'experience', title: 'Work Experience', isOpen: false, order: 2 },
    { id: 'education', title: 'Education', isOpen: false, order: 3 },
    { id: 'skills', title: 'Skills', isOpen: false, order: 4 },
    { id: 'projects', title: 'Projects', isOpen: false, order: 5 },
    { id: 'certifications', title: 'Certifications', isOpen: false, order: 6 },
  ]);
  const [draggedSectionId, setDraggedSectionId] = useState<SectionType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic');
  const [accentColor, setAccentColor] = useState({
    id: 'slate',
    color: '#475569',
  });   
  const [isCustomizationSidebarOpen, setIsCustomizationSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'ai-review'>('preview');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'ai-review'>('editor');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const templateParam = searchParams.get('template');
    const previewParam = searchParams.get('preview');

    if (templateParam && previewParam === 'true') {
      const validTemplates = Object.keys(TEMPLATE_REGISTRY) as TemplateId[];
      if (validTemplates.includes(templateParam as TemplateId)) {
        setSelectedTemplate(templateParam as TemplateId);
        setMobileTab('preview');
      }
    }
  }, [searchParams]);

  const handleTitleChange = (newTitle: string) => {
    setResumeTitle(newTitle);
    setLastSaved(new Date().toISOString());
  };

  const handlePersonalDetailsChange = (field: keyof PersonalDetails, value: string) => {
    setPersonalDetails((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleProfessionalSummaryChange = (content: string) => {
    setProfessionalSummary((prev) => {
      if (!prev) return prev;
      return { ...prev, content };
    });
  };

  const toggleSection = (sectionId: SectionType) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const handleDragStart = (sectionId: SectionType) => (e: DragEvent<HTMLDivElement>) => {
    setDraggedSectionId(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetSectionId: SectionType) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!draggedSectionId || draggedSectionId === targetSectionId) {
      setDraggedSectionId(null);
      return;
    }

    setSections((prev) => {
      const draggedIndex = prev.findIndex((s) => s.id === draggedSectionId);
      const targetIndex = prev.findIndex((s) => s.id === targetSectionId);

      const newSections = [...prev];
      const [draggedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);

      return newSections.map((section, index) => ({
        ...section,
        order: index,
      }));
    });

    setDraggedSectionId(null);
  };

  const renderSectionContent = (sectionId: SectionType) => {
    switch (sectionId) {
      case 'header':
        return (
          <PersonalDetailsForm
            details={personalDetails}
            onChange={handlePersonalDetailsChange}
          />
        );
      case 'summary':
        return (
          <ProfessionalSummaryForm
            summary={professionalSummary}
            onChange={handleProfessionalSummaryChange}
          />
        );
      case 'experience':
        return (
          <WorkExperienceForm
            experiences={workExperiences}
            onChange={setWorkExperiences}
          />
        );
      case 'education':
        return (
          <EducationForm
            entries={educationEntries}
            onChange={setEducationEntries}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            skills={skills}
            onChange={setSkills}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            projects={projects}
            onChange={setProjects}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            certifications={certifications}
            onChange={setCertifications}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-slate-50 dark:bg-slate-900 text-neutral-900 dark:text-slate-100 flex flex-col lg:flex-row lg:overflow-hidden">
      <MobileTabNav
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        onSettingsClick={() => setShowMobileMenu(!showMobileMenu)}
        isCustomizing={isCustomizationSidebarOpen}
        onBackToEdit={() => setIsCustomizationSidebarOpen(false)}
      />

      {isCustomizationSidebarOpen ? (
        <>
          <div className="hidden lg:block flex-1">
            <CustomizationPreview
              personalDetails={personalDetails}
              professionalSummary={professionalSummary}
              workExperiences={workExperiences}
              educationEntries={educationEntries}
              skills={skills}
              projects={projects}
              certifications={certifications}
              sections={sections}
              templateId={selectedTemplate}
              accentColor={accentColor.color}
            />
          </div>

          <div className="w-full lg:w-[500px] flex-shrink-0">
            <CustomizationSidebar
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              accentColor={accentColor}
              onAccentColorChange={(colorId, color) => {
                setAccentColor({
                    id: colorId,
                    color,
                });
              }}
              onClose={() => setIsCustomizationSidebarOpen(false)}
            />
          </div>
        </>
      ) : (
        <>
          {/* Left Panel - Preview Section */}
          <div className={`w-full lg:w-[50%] ${(mobileTab === 'preview' || mobileTab === 'ai-review') ? 'block' : 'hidden lg:block'}`}>
            <CVPreview
              personalDetails={personalDetails}
              professionalSummary={professionalSummary}
              workExperiences={workExperiences}
              educationEntries={educationEntries}
              skills={skills}
              projects={projects}
              certifications={certifications}
              sections={sections}
              templateId={selectedTemplate}
              accentColor={accentColor.color}
              activeTab={mobileTab === 'ai-review' ? 'ai-review' : activeTab}
              onTabChange={setActiveTab}
              onOpenTemplateSelector={() => setIsCustomizationSidebarOpen(true)}
              isMobilePreview={mobileTab === 'preview' || mobileTab === 'ai-review'}
              showMobileMenu={showMobileMenu}
              onMobileMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
              resumeMeta={{
                id: resumeId,
                title: resumeTitle,
                language,
                cv_score: cvScore,
              }}
            />
          </div>

          {/* Right Panel - Editor Section */}
          <div className={`w-full lg:w-[50%] lg:h-screen overflow-y-auto custom-scrollbar pb-20 lg:pb-0 pt-16 lg:pt-0 editor-panel ${mobileTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
            <div className="p-4 lg:p-8 lg:pl-10 w-full dark:bg-slate-900">
              <div className="animate-slideInRight">
                <CVTitleCard
                  title={resumeTitle}
                  lastSaved={lastSaved}
                  onTitleChange={handleTitleChange}
                />
              </div>

              <div className="mt-8 space-y-6">
                {sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <DraggableSection
                      id={section.id}
                      title={section.title}
                      isOpen={section.isOpen}
                      onToggle={() => toggleSection(section.id)}
                      onDragStart={handleDragStart(section.id)}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop(section.id)}
                    >
                      {renderSectionContent(section.id)}
                    </DraggableSection>
                  </div>
                ))}
              </div>

              {/* Mobile Download Button */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-30"
                   style={{
                     backdropFilter: 'blur(10px)',
                     background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)'
                   }}>
                <DownloadDropdown 
                  variant="icon-only" 
                  className="w-full px-5 py-3 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
