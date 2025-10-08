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
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Underline"
        >
          <Underline className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('strikeThrough')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4 text-gray-700" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <List className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertOrderedList')}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4 text-gray-700" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={insertLink}
          className="p-1.5 hover:bg-gray-200 rounded"
          title="Link"
        >
          <Link className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        className="w-full px-3 py-3 text-sm focus:outline-none min-h-[120px] max-h-[300px] overflow-y-auto"
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
