
import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 lg:pt-24 animate-fade-in"> {/* Updated for new navigation height */}
        {children}
      </div>
    </div>
  );
};
