import React from 'react';
import { Terminal, MessageSquare, Cpu, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DOCK_ITEMS = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: MessageSquare, label: 'Chat', path: '/assistant' },
  { icon: Cpu, label: 'Models', path: '/models' },
  { icon: Terminal, label: 'Console', path: '/console' },
];

export function Dock() {
  const navigate = useNavigate();
  return (
    <div className="flex h-12 shrink-0 items-center justify-center gap-1 border-t border-white/5 bg-ink-900/80 px-4 backdrop-blur-xl">
      {DOCK_ITEMS.map(({ icon: Icon, label, path }) => (
        <button key={path} onClick={() => navigate(path)} title={label}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6E6E7A] transition hover:bg-white/5 hover:text-amber-400">
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
