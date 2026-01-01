import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import 'github-markdown-css/github-markdown.css';
import { useBookStore } from '../store/useBookStore';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

export const Editor = () => {
  const { 
    books, 
    currentBookId, 
    currentPageIndex,
    updatePage, 
    addPage, 
    setPageIndex, 
    deletePage 
  } = useBookStore();

  const currentBook = books.find((b) => b.id === currentBookId);
  const currentPage = currentBook?.pages[currentPageIndex];

  // Paper dimensions (approximate for screen display)
  const paperStyles = {
    A4: { width: '210mm', height: '297mm', ratio: '210/297' },
    B5: { width: '176mm', height: '250mm', ratio: '176/250' }
  };

  if (!currentBook || !currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-500">
        本を選択してください
      </div>
    );
  }

  const currentSize = paperStyles[currentBook.size];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = 
        target.value.substring(0, start) + 
        '    ' + 
        target.value.substring(end);

      updatePage(newValue);

      // Set cursor position after the update
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-700">
            {currentBook.title}
          </h2>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500 border border-gray-200">
            {currentBook.size}
          </span>
          <span className="text-sm text-gray-500">
            Page {currentPageIndex + 1} / {currentBook.pages.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageIndex(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
            title="前のページ"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => setPageIndex(currentPageIndex + 1)}
            disabled={currentPageIndex === currentBook.pages.length - 1}
            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
            title="次のページ"
          >
            <ChevronRight size={20} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            onClick={addPage}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title="ページを追加"
          >
            <Plus size={16} />
            <span>追加</span>
          </button>

          <button
            onClick={() => deletePage(currentPage.id)}
            disabled={currentBook.pages.length <= 1}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded disabled:opacity-30 transition-colors ml-2"
            title="ページを削除"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
          <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
            Markdown
          </div>
          <textarea
            value={currentPage.content}
            onChange={(e) => updatePage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            placeholder="# ここに本文を入力..."
            spellCheck={false}
          />
        </div>

        {/* Preview Pane */}
        <div className="flex-1 bg-gray-200 overflow-y-auto p-8 flex justify-center">
          <div 
            className="bg-white shadow-lg p-[20mm] overflow-hidden relative"
            style={{
              width: currentSize.width,
              minHeight: currentSize.height,
              maxWidth: '100%',
            }}
          >
            <div className="markdown-body !bg-transparent">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {currentPage.content}
              </ReactMarkdown>
            </div>
            
            {/* Page Number Footer Simulation */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
              - {currentPageIndex + 1} -
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};