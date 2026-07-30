import React from 'react';
import { Search, Terminal, Activity, Bell, ChevronDown, Menu, Sun, Moon } from 'lucide-react';

interface TopBarProps { 
  onMenuClick: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export function TopBar({ onMenuClick, theme, toggleTheme }: TopBarProps) {
  return (
    <header style={{
      height: 48, background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px',
      flexShrink: 0, zIndex: 10,
    }}>
      {/* Hamburger */}
      <button onClick={onMenuClick} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}>
        <Menu size={16} />
      </button>

      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 460, display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 6, padding: '6px 12px',
      }}>
        <Search size={13} color="var(--text-muted)" />
        <input placeholder="Search anything..." style={{
          flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)',
          fontSize: 12, fontFamily: 'var(--font)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <kbd style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 5px', fontSize: 9, color: 'var(--text-muted)' }}>Ctrl</kbd>
          <kbd style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 5px', fontSize: 9, color: 'var(--text-muted)' }}>K</kbd>
        </div>
      </div>

      {/* Right icons */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconBtn onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </IconBtn>
        <IconBtn><Terminal size={14} /></IconBtn>
        <IconBtn><Activity size={14} /></IconBtn>
        <IconBtn pos>
          <Bell size={14} />
        </IconBtn>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 6, padding: '4px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
          <div style={{ width: 26, height: 26, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>R</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Rishabh</div>
            <div style={{ fontSize: 9, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Online
            </div>
          </div>
          <ChevronDown size={12} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children, pos, onClick }: { children: React.ReactNode; pos?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ position: 'relative', width: 30, height: 30, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      {children}
      {pos && <span style={{ position: 'absolute', top: 5, right: 5, width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', border: '1px solid var(--bg-sidebar)' }} />}
    </button>
  );
}
