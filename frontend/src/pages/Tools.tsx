import React from 'react';
import { Search, Code, FileText, GitBranch, Globe, Terminal, Database, Wrench } from 'lucide-react';

const TOOLS = [
  { name: 'Web Search',   icon: Search,    status: 'Active', desc: 'DuckDuckGo & Tavily' },
  { name: 'Code Runner',  icon: Code,      status: 'Active', desc: 'Sandboxed Python/JS' },
  { name: 'File System',  icon: FileText,  status: 'Active', desc: 'Read, write project files' },
  { name: 'Git Tools',    icon: GitBranch, status: 'Active', desc: 'Clone, commit, push' },
  { name: 'Browser',      icon: Globe,     status: 'Idle',   desc: 'Playwright automation' },
  { name: 'Terminal',     icon: Terminal,  status: 'Active', desc: 'Shell execution' },
  { name: 'Database',     icon: Database,  status: 'Active', desc: 'SQLite / ChromaDB' },
  { name: 'API Caller',   icon: Wrench,    status: 'Active', desc: 'Generic REST client' },
];

export function Tools() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>TOOLS</h1>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{TOOLS.filter(t => t.status === 'Active').length} tools active • agents call these automatically</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {TOOLS.map(t => (
          <div key={t.name} className="card" style={{ padding: '14px', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <t.icon size={15} color="var(--accent-light)" />
              </div>
              <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 3, background: t.status === 'Active' ? 'rgba(78,155,92,0.12)' : 'rgba(255,255,255,0.05)', color: t.status === 'Active' ? 'var(--green)' : 'var(--text-muted)', letterSpacing: '0.06em' }}>{t.status}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{t.name}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
