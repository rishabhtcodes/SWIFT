import React, { useState } from 'react';
import { Search, Terminal, Cpu, Database, Play, Sparkles } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl bg-ink-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden glass">
        <div className="flex items-center px-4 border-b border-white/10">
          <Search className="w-5 h-5 text-neutral-400 mr-2" />
          <input
            autoFocus
            placeholder="Type a command or search..."
            className="w-full bg-transparent py-4 text-white focus:outline-none placeholder-neutral-500"
          />
          <kbd className="px-2 py-1 text-xs bg-ink-800 rounded border border-white/10 text-neutral-400">ESC</kbd>
        </div>
        <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
          <button onClick={() => setIsOpen(false)} className="w-full flex items-center px-3 py-2 text-sm text-neutral-300 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg group">
            <Sparkles className="w-4 h-4 mr-3 text-amber-400" />
            <span>Launch Software Engineering Mode ("Build Spotify")</span>
          </button>
          <button onClick={() => setIsOpen(false)} className="w-full flex items-center px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 rounded-lg">
            <Terminal className="w-4 h-4 mr-3 text-cyan-400" />
            <span>Open Developer Console</span>
          </button>
          <button onClick={() => setIsOpen(false)} className="w-full flex items-center px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 rounded-lg">
            <Cpu className="w-4 h-4 mr-3 text-purple-400" />
            <span>Switch Active LLM Router Provider</span>
          </button>
          <button onClick={() => setIsOpen(false)} className="w-full flex items-center px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 rounded-lg">
            <Database className="w-4 h-4 mr-3 text-emerald-400" />
            <span>Inspect 7-Layer System Memory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
