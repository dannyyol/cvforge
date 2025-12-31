import React from 'react';
import { useCVStore } from '../../../store/useCVStore';
import { Plus, Trash2, ChevronDown, FolderGit2, Link, Code2, Calendar } from 'lucide-react';
import { Input } from '../../ui/Form';
import { Button } from '../../ui/Button';
import { RichTextEditor } from '../../ui/RichTextEditor';
import type { Project } from '../../../types/resume';

const ProjectItem = ({ project, isOpen, onToggle }: { project: Project; isOpen: boolean; onToggle: () => void }) => {
  const { updateProject, removeProject } = useCVStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProject(project.id, { [name]: value });
  };

  const handleDescriptionChange = (value: string) => {
    updateProject(project.id, { description: value });
  };

  return (
    <div className="project-card">
      <div 
        className="project-header"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
             <div className="project-icon-container">
                <FolderGit2 className="w-4 h-4" />
            </div>
            <div className="font-semibold text-gray-800">
              {project.name || 'New Project'}
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeProject(project.id);
                }}
                className="project-delete-btn"
                title="Delete project"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <div className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="project-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input
                label="Project Name"
                name="name"
                value={project.name}
                onChange={handleChange}
                placeholder="e.g. E-commerce Platform"
                icon={<FolderGit2 className="w-4 h-4" />}
             />
             <Input
                label="Link"
                name="link"
                value={project.link}
                onChange={handleChange}
                placeholder="https://github.com/..."
                icon={<Link className="w-4 h-4" />}
             />
          </div>

          <div className="form-grid-2">
             <Input
                label="Start Date"
                name="startDate"
                placeholder="MM/YYYY"
                value={project.startDate}
                onChange={handleChange}
                icon={<Calendar className="w-4 h-4" />}
             />
             <Input
                label="End Date"
                name="endDate"
                placeholder="MM/YYYY"
                value={project.endDate}
                onChange={handleChange}
                icon={<Calendar className="w-4 h-4" />}
             />
          </div>
          
           <Input
              label="Technologies (comma separated)"
              value={project.technologies.join(', ')}
              onChange={(e) => updateProject(project.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              placeholder="e.g. React, Node.js, MongoDB"
              icon={<Code2 className="w-4 h-4" />}
           />
           
           <RichTextEditor
              label="Description"
              value={project.description}
              onChange={handleDescriptionChange}
              placeholder="Describe the project and your role..."
            />
        </div>
      )}
    </div>
  );
};

export const ProjectsForm = () => {
    const { cvData, addProject } = useCVStore();
    const [openId, setOpenId] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="form-container">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                    <p className="text-sm text-gray-500">Showcase your personal or professional projects.</p>
                 </div>
            </div>
            
            {cvData.projects.length === 0 ? (
                <div className="empty-state-dashed">
                    <div className="empty-state-icon-dashed">
                        <FolderGit2 className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-gray-900 mb-2 text-lg">No projects added yet</p>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Add projects to demonstrate your practical skills.</p>
                    <Button 
                        onClick={() => addProject()}
                        variant="primary"
                        leftIcon={<Plus className="w-4 h-4" />}
                    >
                        Add Project
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cvData.projects.map((proj) => (
                        <ProjectItem 
                            key={proj.id} 
                            project={proj} 
                            isOpen={openId === proj.id}
                            onToggle={() => handleToggle(proj.id)}
                        />
                    ))}
                    
                    <Button
                        onClick={() => addProject()}
                        variant="ghost"
                        className="empty-state-add-btn h-auto group"
                        leftIcon={<Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                    >
                        Add Another Project
                    </Button>
                </div>
            )}
        </div>
    );
};
