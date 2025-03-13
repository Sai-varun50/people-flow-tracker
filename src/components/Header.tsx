
import React from 'react';
import { Users } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'People Flow Tracker' }) => {
  return (
    <header className="w-full py-6 animate-fade-in">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
