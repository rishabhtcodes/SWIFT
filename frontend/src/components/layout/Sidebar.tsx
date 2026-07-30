import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Bot, Brain, BookOpen,
  Wrench, FolderKanban, Settings, Cpu, Store, Activity, Terminal
} from 'lucide-react';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

const NAV = [
  { to: '/dashboard',   label: 'DASHBOARD',     icon: LayoutDashboard },
  { to: '/chat',        label: 'CHAT',          icon: MessageSquare },
  { to: '/agents',      label: 'AGENTS',        icon: Bot },
  { to: '/memory',      label: 'MEMORY',        icon: Brain },
  { to: '/knowledge',   label: 'KNOWLEDGE BASE', icon: BookOpen },
  { to: '/tools',       label: 'TOOLS',         icon: Wrench },
  { to: '/projects',    label: 'PROJECTS',      icon: FolderKanban },
  { to: '/models',      label: 'MODEL MANAGER', icon: Cpu },
  { to: '/marketplace', label: 'MARKETPLACE',   icon: Store },
  { to: '/analytics',   label: 'ANALYTICS',     icon: Activity },
  { to: '/console',     label: 'CONSOLE',       icon: Terminal },
  { to: '/settings',    label: 'SETTINGS',      icon: Settings },
];

export function Sidebar() {
  const [sys, setSys] = useState({ cpu: 23, memory: 41, storage: 62 });

  useEffect(() => {
    const fetchSys = () => {
      fetch(`${API_BASE}/stats/system`)
        .then(r => r.json())
        .then(d => {
          if (d && typeof d.cpu === 'number') setSys(d);
        })
        .catch(() => {});
    };
    fetchSys();
    const id = setInterval(fetchSys, 5000);
    return () => clearInterval(id);
  }, []);

  const USAGE = [
    { label: 'CPU USAGE',    pct: sys.cpu, color: sys.cpu > 80 ? '#e74c3c' : '#C4621A' },
    { label: 'MEMORY USAGE', pct: sys.memory, color: sys.memory > 85 ? '#e74c3c' : '#C4621A' },
    { label: 'STORAGE USAGE',pct: sys.storage, color: sys.storage > 90 ? '#e74c3c' : '#C4621A' },
  ];

  return (
    <aside className="sidebar-drawer" style={{
      width: 200, minWidth: 200,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      fontSize: 11, userSelect: 'none',
    }}>
      {/* Logo */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 6, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>SWIFT AI OS</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Your Intelligent Operating System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 8px', marginBottom: 1, borderRadius: 4,
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.06em', fontSize: 10,
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = 'var(--text-muted)'; }}
              >
                <Icon size={13} />
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Swift Status */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>SWIFT STATUS</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--green)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            ACTIVE
          </span>
        </div>
        {USAGE.map(u => (
          <div key={u.label} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{u.label}</span>
              <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>{u.pct}%</span>
            </div>
            <div className="progress-track" style={{ height: 4 }}>
              <div className="progress-fill" style={{ width: `${u.pct}%`, background: u.color, transition: 'width 1s ease-in-out' }} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}