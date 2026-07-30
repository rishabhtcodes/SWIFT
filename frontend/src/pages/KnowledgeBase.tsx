import React, { useState } from 'react';
import { BookOpen, Upload, Globe, FileText, Code, Search, Plus } from 'lucide-react';

const DOCS = [
  { name: 'FastAPI Documentation', type: 'Web',      chunks: 847, icon: Globe,    color: 'var(--blue)' },
  { name: 'LangGraph Guide',       type: 'PDF',      chunks: 234, icon: FileText, color: '#9B4EC4' },
  { name: 'Project Requirements',  type: 'Markdown', chunks: 56,  icon: Code,     color: 'var(--green)' },
  { name: 'Architecture Diagram',  type: 'Text',     chunks: 12,  icon: BookOpen, color: 'var(--accent-light)' },
];

export function KnowledgeBase() {
  const [q, setQ] = useState('');
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>KNOWLEDGE BASE</h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>ChromaDB vector store • {DOCS.reduce((a, d) => a + d.chunks, 0).toLocaleString()} chunks indexed</p>
        </div>
        <button className="accent-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 10, letterSpacing: '0.06em' }}>
          <Upload size={12} /> UPLOAD DOC
        </button>
      </div>
      <div className="card" style={{ padding: '10px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Search size={13} color="var(--text-muted)" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search knowledge base..."
          style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DOCS.filter(d => d.name.toLowerCase().includes(q.toLowerCase())).map(d => (
          <div key={d.name} className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <d.icon size={16} color={d.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{d.name}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{d.type} • {d.chunks} chunks indexed</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
