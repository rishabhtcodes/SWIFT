import React from 'react';
export const Card: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => (
  <div className={`glass rounded-2xl p-5 ${className ?? ''}`}>{children}</div>
);
