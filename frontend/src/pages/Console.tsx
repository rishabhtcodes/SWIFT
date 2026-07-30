import React, { useState, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const BANNER = `
╔══════════════════════════════════════════════╗
║          SWIFT AI OS — Terminal v0.1         ║
║  Type 'help' for available commands          ║
╚══════════════════════════════════════════════╝
`;

const COMMANDS: Record<string, string> = {
  help: `Available commands:\n  help       - Show this message\n  status     - System status\n  agents     - List active agents\n  clear      - Clear terminal`,
  status: '✅ All systems operational\n📡 Backend: http://localhost:8000\n🤖 12 agents registered',
  agents: 'Active agents:\n  Planner, Code, Research, Memory, File, Tool',
};

export function Console() {
  const [lines, setLines] = useState<string[]>([BANNER.trim(), 'swift@os:~$ ']);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const run = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'clear') { setLines([BANNER.trim(), 'swift@os:~$ ']); return; }
    const output = COMMANDS[trimmed] || `Command not found: ${trimmed}. Type 'help'.`;
    setLines(prev => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), last + cmd, output, 'swift@os:~$ '];
    });
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <TerminalIcon size={16} color="var(--accent-light)" />
        <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>CONSOLE</h1>
      </div>
      <div className="card scrollable" style={{ flex: 1, padding: '16px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-primary)' }}>
        {lines.map((l, i) => <div key={i} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: i % 2 !== 0 ? 8 : 4, color: i % 2 !== 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{l}</div>)}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { run(input); setInput(''); } }}
            style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: 11 }}
            autoFocus />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
