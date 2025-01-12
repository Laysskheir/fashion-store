import React from 'react';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className = '' }: ShellProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}
