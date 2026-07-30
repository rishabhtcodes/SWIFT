import React from 'react';
import { Store, Star, Download, Zap } from 'lucide-react';

const ITEMS = [
  { name: 'AutoCoder Pro', desc: 'Full-stack code generation agent', stars: 4.9, downloads: '12k' },
  { name: 'ResearchBot',   desc: 'Deep research with citations',     stars: 4.7, downloads: '8k' },
  { name: 'DataAnalyzer',  desc: 'CSV, JSON and DB analysis',        stars: 4.8, downloads: '5k' },
  { name: 'DocWriter',     desc: 'Auto-generate documentation',      stars: 4.6, downloads: '3k' },
];

export function Marketplace() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Store size={18} color="var(--accent-light)" />
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>MARKETPLACE</h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Extend Swift with community agents & tools</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {ITEMS.map((item) => (
          <div key={item.name} className="card" style={{ padding: '16px', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="var(--accent-light)" />
              </div>
              <button className="accent-btn" style={{ padding: '4px 8px', fontSize: 9, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Download size={10} /> INSTALL
              </button>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3 }}>{item.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, fontSize: 9, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={10} color="var(--accent-light)" /> {item.stars}</span>
              <span>{item.downloads} downloads</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
