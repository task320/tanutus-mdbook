import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, PaperSize } from '../types';

// Simple ID generator since I didn't install uuid
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

interface BookState {
  books: Book[];
  currentBookId: string | null;
  currentPageIndex: number;
  
  // Actions
  createBook: (title: string, size: PaperSize) => void;
  deleteBook: (id: string) => void;
  renameBook: (id: string, newTitle: string) => void;
  selectBook: (id: string) => void;
  
  // Page Actions
  addPage: () => void;
  updatePage: (content: string) => void;
  setPageIndex: (index: number) => void;
  deletePage: (pageId: string) => void;
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: [],
      currentBookId: null,
      currentPageIndex: 0,

      createBook: (title, size) => {
        const newBook: Book = {
          id: generateId(),
          title,
          size,
          pages: [{ id: generateId(), content: '# New Page\nStart writing...' }],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          books: [...state.books, newBook],
          currentBookId: newBook.id,
          currentPageIndex: 0
        }));
      },

      deleteBook: (id) => {
        set((state) => {
          const newBooks = state.books.filter((b) => b.id !== id);
          const isCurrent = state.currentBookId === id;
          return {
            books: newBooks,
            currentBookId: isCurrent ? (newBooks.length > 0 ? newBooks[0].id : null) : state.currentBookId,
            currentPageIndex: isCurrent ? 0 : state.currentPageIndex
          };
        });
      },

      renameBook: (id, newTitle) => {
        set((state) => ({
          books: state.books.map((b) => 
            b.id === id ? { ...b, title: newTitle, updatedAt: Date.now() } : b
          )
        }));
      },

      selectBook: (id) => {
        set({ currentBookId: id, currentPageIndex: 0 });
      },

      addPage: () => {
        const { books, currentBookId } = get();
        if (!currentBookId) return;

        set((state) => ({
          books: state.books.map((b) => {
            if (b.id === currentBookId) {
              return {
                ...b,
                pages: [...b.pages, { id: generateId(), content: '' }],
                updatedAt: Date.now()
              };
            }
            return b;
          }),
          currentPageIndex: books.find(b => b.id === currentBookId)!.pages.length // set to new page index
        }));
      },

      updatePage: (content) => {
        const { currentBookId, currentPageIndex } = get();
        if (!currentBookId) return;

        set((state) => ({
          books: state.books.map((b) => {
            if (b.id === currentBookId) {
              const newPages = [...b.pages];
              if (newPages[currentPageIndex]) {
                newPages[currentPageIndex] = { ...newPages[currentPageIndex], content };
              }
              return { ...b, pages: newPages, updatedAt: Date.now() };
            }
            return b;
          })
        }));
      },

      setPageIndex: (index) => {
         set({ currentPageIndex: index });
      },
      
      deletePage: (pageId) => {
         const { currentBookId } = get();
         if (!currentBookId) return;
         
         set((state) => {
             const book = state.books.find(b => b.id === currentBookId);
             if(!book) return state;
             
             // Don't delete the last page
             if (book.pages.length <= 1) return state;

             const newPages = book.pages.filter(p => p.id !== pageId);
             // Adjust index if necessary
             let newIndex = state.currentPageIndex;
             if (newIndex >= newPages.length) {
                 newIndex = newPages.length - 1;
             }
             
             return {
                 books: state.books.map(b => b.id === currentBookId ? { ...b, pages: newPages, updatedAt: Date.now() } : b),
                 currentPageIndex: newIndex
             };
         });
      }
    }),
    {
      name: 'md-book-storage',
    }
  )
);