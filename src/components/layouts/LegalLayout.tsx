import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="prose max-w-none">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalLayout;
