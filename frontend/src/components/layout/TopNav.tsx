import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Command } from 'lucide-react';

export function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-ink-900/60 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-[#6E6E7A]">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">Search anything...</span>
          <kbd className="flex items-center gap-0.5 rounded border border-white/10 px-1.5 py-0.5 text-[10px]">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#6E6E7A] hover:bg-white/5 hover:text-white transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-1.5">
          <div className="h-6 w-6 rounded-full gradient-amber flex items-center justify-center text-[10px] font-bold text-white">R</div>
          <span className="text-xs font-medium">Rishabh</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>
    </header>
  );
}
