import React from 'react';
export const Badge: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${className ?? ''}`}>{children}</span>
);
