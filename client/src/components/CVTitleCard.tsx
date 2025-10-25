import { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface CVTitleCardProps {
  title: string;
  lastSaved: string | null;
  onTitleChange: (newTitle: string) => void;
}

function CVTitleCard({ title, lastSaved, onTitleChange }: CVTitleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onTitleChange(editedTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return 'Not saved yet';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="title-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="title-card-input"
                autoFocus
                maxLength={100}
              />
              <button
                onClick={handleSave}
                className="title-card-save-btn"
                title="Save"
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleCancel}
                className="title-card-cancel-btn"
                title="Cancel"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h1 className="title-card-title">{title}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="title-card-edit-btn"
                title="Edit title"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
          <p className="title-card-subtext">
            {/* Last saved: {formatLastSaved(lastSaved)} */}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CVTitleCard;
