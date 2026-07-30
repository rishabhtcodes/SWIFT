import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-[#3A3A44] focus:border-amber-500/40 ${className ?? ''}`} {...props} />
);
