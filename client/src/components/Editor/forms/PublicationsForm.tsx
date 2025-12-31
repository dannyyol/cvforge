import React from 'react';
import { useCVStore } from '../../../store/useCVStore';
import { Plus, Trash2, ChevronDown, BookOpen, Building, Calendar, Link } from 'lucide-react';
import { Input } from '../../ui/Form';
import { RichTextEditor } from '../../ui/RichTextEditor';
import type { Publication } from '../../../types/resume';

const PublicationItem = ({ publication, isOpen, onToggle }: { publication: Publication; isOpen: boolean; onToggle: () => void }) => {
  const { updatePublication, removePublication } = useCVStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePublication(publication.id, { [name]: value });
  };

  const handleDescriptionChange = (value: string) => {
    updatePublication(publication.id, { description: value });
  };

  return (
    <div className="item-card group">
      <div 
        className="item-header"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
            <div className="item-icon-container">
                <BookOpen className="w-4 h-4" />
            </div>
            <div>
                <div className="font-bold text-gray-800">{publication.title || 'New Publication'}</div>
                <div className="text-sm text-gray-500 font-medium">{publication.publisher ? publication.publisher : 'Publisher'}</div>
            </div>
        </div>
        <div className="item-controls">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removePublication(publication.id);
                }}
                className="item-delete-btn"
                title="Delete publication"
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
                label="Title"
                name="title"
                value={publication.title}
                onChange={handleChange}
                placeholder="e.g. Research Paper"
                icon={<BookOpen className="w-4 h-4" />}
             />
             <Input
                label="Publisher"
                name="publisher"
                value={publication.publisher}
                onChange={handleChange}
                placeholder="e.g. IEEE Journal"
                icon={<Building className="w-4 h-4" />}
             />
          </div>
          
           <div className="form-grid-2">
             <Input
                label="Date"
                name="date"
                value={publication.date}
                onChange={handleChange}
                placeholder="e.g. 2023"
                icon={<Calendar className="w-4 h-4" />}
             />
             <Input
                label="Link"
                name="link"
                value={publication.link}
                onChange={handleChange}
                placeholder="https://..."
                icon={<Link className="w-4 h-4" />}
             />
           </div>
           
           <RichTextEditor
              label="Description"
              value={publication.description}
              onChange={handleDescriptionChange}
              placeholder="Describe the publication..."
            />
        </div>
      )}
    </div>
  );
};

export const PublicationsForm = () => {
    const { cvData, addPublication } = useCVStore();
    const [openId, setOpenId] = React.useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800">Publications</h3>
                    <p className="text-sm text-gray-500">Add your articles, books, or research papers.</p>
                 </div>
            </div>
            
            {cvData.publications.length === 0 ? (
                <div className="empty-state-dashed">
                    <div className="empty-state-icon-circle">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">No publications added yet</p>
                    <p className="text-sm text-gray-500 mb-4">Share your published work.</p>
                    <button 
                        onClick={() => addPublication()}
                        className="btn-cta-blue"
                    >
                        <Plus className="w-4 h-4" />
                        Add Publication
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cvData.publications.map((pub) => (
                        <PublicationItem
                            key={pub.id}
                            publication={pub}
                            isOpen={openId === pub.id}
                            onToggle={() => handleToggle(pub.id)}
                        />
                    ))}
                    
                    <button
                        onClick={() => addPublication()}
                        className="empty-state-add-btn group"
                    >
                        <Plus className="w-4 h-4" /> Add Another Publication
                    </button>
                </div>
            )}
        </div>
    );
};
