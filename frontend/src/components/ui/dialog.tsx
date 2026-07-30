import React from 'react';
export const Dialog: React.FC<{children?: React.ReactNode}> = ({ children }) => <>{children}</>;
export const DialogContent: React.FC<{children?: React.ReactNode}> = ({ children }) => (
  <div className="glass-strong fixed inset-0 z-50 flex items-center justify-center">
    <div className="rounded-2xl p-6">{children}</div>
  </div>
);
