import React from 'react';

interface Props { status: string; }

export function ModelHealthBadge({ status }: Props) {
  const normalized = (status || 'unknown').toLowerCase();

  const cfg = {
    healthy: { color: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400', label: 'Healthy' },
    online: { color: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400', label: 'Online' },
    unhealthy: { color: 'bg-rose-500/10 text-rose-400', dot: 'bg-rose-400', label: 'Unhealthy' },
    offline: { color: 'bg-white/5 text-[#6E6E7A]', dot: 'bg-[#6E6E7A]', label: 'Offline' },
    key_missing: { color: 'bg-amber-500/10 text-amber-400', dot: 'bg-amber-400', label: 'Key Missing' },
    unknown: { color: 'bg-white/5 text-amber-400', dot: 'bg-amber-400', label: 'Unknown' },
  }[normalized] || { color: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400', label: status || 'Healthy' };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
