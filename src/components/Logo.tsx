import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center h-8">
      <img 
        src="/logo.png" 
        alt="ControlF5 Logo" 
        className="h-full w-auto"
      />
    </div>
  );
};