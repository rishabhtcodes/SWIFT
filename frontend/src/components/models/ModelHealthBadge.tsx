import React from 'react';

interface Props { status: 'online' | 'offline' | 'key_missing'; }

export function ModelHealthBadge({ status }: Props) {
  const cfg = {
    online: { color: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400', label: 'Online' },
    offline: { color: 'bg-white/5 text-[#6E6E7A]', dot: 'bg-[#6E6E7A]', label: 'Offline' },
    key_missing: { color: 'bg-amber-500/10 text-amber-400', dot: 'bg-amber-400', label: 'Key Missing' },
  }[status];
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
