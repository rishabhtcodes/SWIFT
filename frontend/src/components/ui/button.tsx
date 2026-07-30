import React from 'react';
import { cn } from '../../lib/utils';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'default' | 'ghost' | 'outline'; }
export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', ...props }) => (
  <button className={cn(
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition',
    variant === 'default' && 'gradient-amber text-white shadow-glow',
    variant === 'ghost' && 'hover:bg-white/5',
    variant === 'outline' && 'border border-white/10 hover:bg-white/5',
    className
  )} {...props} />
);
