import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { PrintContainer } from '../components/PrintContainer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100 print:hidden">
        <Sidebar />
        <main className="flex-1 h-full min-w-0 flex flex-col">
          {children}
        </main>
      </div>
      <PrintContainer />
    </>
  );
};
