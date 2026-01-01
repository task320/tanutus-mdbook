export type PaperSize = 'A4' | 'B5';

export interface Page {
  id: string;
  content: string; // Markdown content
}

export interface Book {
  id: string;
  title: string;
  size: PaperSize;
  pages: Page[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}
