import { useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({ value, onChange, placeholder, rows = 6 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  return (
    <div className="border-2 border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-3 bg-neutral-50 border-b-2 border-neutral-200">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-2 hover:bg-neutral-200 transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4 text-neutral-900" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-2 hover:bg-neutral-200 transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4 text-neutral-900" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="p-2 hover:bg-neutral-200 transition-colors"
          title="Underline"
        >
          <Underline className="w-4 h-4 text-neutral-900" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('strikeThrough')}
          className="p-2 hover:bg-neutral-200 transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4 text-neutral-900" />
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="p-2 hover:bg-neutral-200 transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4 text-neutral-900" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertOrderedList')}
          className="p-2 hover:bg-neutral-200 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4 text-neutral-900" />
        </button>
        <div className="w-px h-6 bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-neutral-200 transition-colors"
          title="Link"
        >
          <Link className="w-4 h-4 text-neutral-900" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        className="w-full px-4 py-3 text-sm focus:outline-none min-h-[120px] max-h-[300px] overflow-y-auto font-light"
        style={{ minHeight: `${rows * 24}px` }}
        data-placeholder={placeholder}
      />
      <style>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
