import React from 'react';
import { Brain, Database, HardDrive, MessageSquare, FileText, User } from 'lucide-react';

const LAYERS = [
  { name: 'Short-Term Memory', type: 'In-Process', ttl: 'Session', usage: 64, icon: Brain, color: 'var(--accent-light)' },
  { name: 'Episodic Memory',   type: 'SQLite',     ttl: '30 days', usage: 38, icon: Database, color: 'var(--blue)' },
  { name: 'Semantic Memory',   type: 'ChromaDB',   ttl: 'Permanent', usage: 82, icon: HardDrive, color: '#9B4EC4' },
  { name: 'Conversations',     type: 'SQLite',     ttl: '90 days', usage: 51, icon: MessageSquare, color: 'var(--green)' },
];

const STATS = [
  { label: 'Total Memories', val: '1,248', icon: FileText },
  { label: 'Conversations',  val: '328',   icon: MessageSquare },
  { label: 'Files Indexed',  val: '96',    icon: HardDrive },
  { label: 'User Facts',     val: '89',    icon: User },
];

export function Memory() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>MEMORY</h1>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>7-layer memory architecture — episodic, semantic & procedural</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LAYERS.map(l => (
            <div key={l.name} className="card" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <l.icon size={15} color={l.color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{l.type} • TTL: {l.ttl}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{l.usage}%</div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${l.usage}%`, background: l.color }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STATS.map(s => (
            <div key={s.label} className="card" style={{ padding: '12px 14px' }}>
              <s.icon size={14} color="var(--accent-light)" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
