import React, { useState } from 'react';
import { useBookStore } from '../store/useBookStore';
import { useAuthStore } from '../store/useAuthStore';
import { Book, PaperSize } from '../types';
import { Modal } from './Modal';
import { 
  Plus, 
  Book as BookIcon, 
  Pencil, 
  Trash2, 
  Printer, 
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar = () => {
  const { books, currentBookId, selectBook, createBook, renameBook, deleteBook } = useBookStore();
  const { user, logout } = useAuthStore();

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  // Form states
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSize, setNewBookSize] = useState<PaperSize>('A4');
  const [editTitle, setEditTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBookTitle.trim()) {
      createBook(newBookTitle, newBookSize);
      setNewBookTitle('');
      setNewBookSize('A4');
      setIsCreateOpen(false);
    }
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook && editTitle.trim()) {
      renameBook(editingBook.id, editTitle);
      setEditingBook(null);
    }
  };

  const handleDelete = () => {
    if (deletingBook) {
      deleteBook(deletingBook.id);
      setDeletingBook(null);
    }
  };

  const handlePrint = (book: Book) => {
     // Trigger print mode (handled in MainLayout or a global effect)
     // For now, let's just select the book to ensure it's loaded, 
     // but ideally we need a way to signal "print this book" to the main view
     // or render a hidden print component.
     selectBook(book.id);
     setTimeout(() => window.print(), 100);
  };

  return (
    <>
      <div className="w-64 bg-gray-900 text-gray-300 flex flex-col h-full border-r border-gray-800">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          {user?.photoURL && (
            <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          </div>
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-white transition-colors"
            title="ログアウト"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Create New Book */}
        <div className="p-4">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span className="font-medium">本を新規作成</span>
          </button>
        </div>

        {/* Book List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            本一覧
          </div>
          {books.map((book) => (
            <div
              key={book.id}
              className={clsx(
                "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                currentBookId === book.id 
                  ? "bg-gray-800 text-white" 
                  : "hover:bg-gray-800/50 hover:text-gray-100"
              )}
              onClick={() => selectBook(book.id)}
            >
              <BookIcon size={18} className="shrink-0" />
              <div className="flex-1 min-w-0 truncate text-sm">
                {book.title}
              </div>
              
              {/* Actions (visible on hover or active) */}
              <div className={clsx(
                "flex items-center gap-1 opacity-0 transition-opacity",
                "group-hover:opacity-100",
                currentBookId === book.id && "opacity-100"
              )}>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingBook(book); setEditTitle(book.title); }}
                  className="p-1 hover:text-blue-400"
                  title="名前変更"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrint(book); }}
                  className="p-1 hover:text-green-400"
                  title="印刷"
                >
                  <Printer size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeletingBook(book); }}
                  className="p-1 hover:text-red-400"
                  title="削除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {books.length === 0 && (
            <div className="text-center py-8 text-gray-600 text-sm">
              本がありません
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      
      {/* Create Book Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="本の新規作成"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              本の名前
            </label>
            <input
              type="text"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="例: 私の日記"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サイズ
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value="A4"
                  checked={newBookSize === 'A4'}
                  onChange={(e) => setNewBookSize(e.target.value as PaperSize)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>A4</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value="B5"
                  checked={newBookSize === 'B5'}
                  onChange={(e) => setNewBookSize(e.target.value as PaperSize)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>B5</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!newBookTitle.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              作成
            </button>
          </div>
        </form>
      </Modal>

      {/* Rename Book Modal */}
      <Modal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="名前の変更"
      >
        <form onSubmit={handleRename} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しい名前
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setEditingBook(null)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!editTitle.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              OK
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Book Modal */}
      <Modal
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        title="本を削除"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            「{deletingBook?.title}」を削除してもよろしいですか？<br/>
            この操作は取り消せません。
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setDeletingBook(null)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};