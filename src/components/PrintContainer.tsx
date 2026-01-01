import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import 'github-markdown-css/github-markdown.css';
import { useBookStore } from '../store/useBookStore';

export const PrintContainer = () => {
  const { books, currentBookId } = useBookStore();
  const currentBook = books.find((b) => b.id === currentBookId);

  if (!currentBook) return null;

  const paperStyles = {
    A4: { width: '210mm', height: '297mm' },
    B5: { width: '176mm', height: '250mm' }
  };

  const size = paperStyles[currentBook.size];

  return (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999]">
      {currentBook.pages.map((page, index) => (
        <div 
          key={page.id} 
          className="relative page-break-after-always overflow-hidden bg-white mx-auto"
          style={{
            width: size.width,
            height: size.height,
            padding: '20mm', // Margin matches Editor preview
            pageBreakAfter: 'always'
          }}
        >
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {page.content}
            </ReactMarkdown>
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
            - {index + 1} -
          </div>
        </div>
      ))}
    </div>
  );
};