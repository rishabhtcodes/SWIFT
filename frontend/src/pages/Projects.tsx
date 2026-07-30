import React from 'react';
import { Zap, GitBranch, Clock, Plus } from 'lucide-react';

const PROJECTS = [
  { name: 'Swift AI OS',         lang: 'TypeScript / Python', status: 'Active',  progress: 72, agents: 8 },
  { name: 'Spotify Clone API',   lang: 'FastAPI / React',      status: 'Active',  progress: 45, agents: 4 },
  { name: 'Research Assistant',  lang: 'Python / LangGraph',   status: 'Active',  progress: 88, agents: 3 },
  { name: 'E-commerce Platform', lang: 'Next.js / Prisma',     status: 'Planned', progress: 0,  agents: 0 },
];

export function Projects() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>PROJECTS</h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{PROJECTS.length} projects • {PROJECTS.filter(p => p.status === 'Active').length} active</p>
        </div>
        <button className="accent-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 10 }}>
          <Plus size={12} /> NEW PROJECT
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {PROJECTS.map(p => (
          <div key={p.name} className="card" style={{ padding: '14px', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</h3>
                <p style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{p.lang}</p>
              </div>
              <span style={{ fontSize: 8, padding: '2px 7px', borderRadius: 3, background: p.status === 'Active' ? 'rgba(78,155,92,0.12)' : 'rgba(255,255,255,0.05)', color: p.status === 'Active' ? 'var(--green)' : 'var(--text-muted)' }}>{p.status}</span>
            </div>
            {p.progress > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 9, color: 'var(--text-muted)' }}>
                  <span>Progress</span><span>{p.progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${p.progress}%`, background: 'var(--accent)' }} />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 14, borderTop: '1px solid var(--border-light)', paddingTop: 8, fontSize: 9, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><GitBranch size={9} /> main</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={9} /> {p.agents} agents</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}><Clock size={9} /> 2h ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
