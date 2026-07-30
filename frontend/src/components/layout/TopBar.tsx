import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Terminal, Activity, Bell, ChevronDown, Menu, Sun, Moon, AlertTriangle, CheckCircle, Info, X, ShieldAlert } from 'lucide-react';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

export interface NotificationItem {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface TopBarProps { 
  onMenuClick: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export function TopBar({ onMenuClick, theme, toggleTheme }: TopBarProps) {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'info',
      title: 'Qwen & Groq Active',
      message: 'DashScope Qwen 3.7 Plus & Groq Llama 3.3 70B models connected.',
      time: 'Just now',
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Provider Fallback Ready',
      message: 'Automatic rate-limit backoff enabled across all model providers.',
      time: '5m ago',
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: 'System Health Nominal',
      message: 'FastAPI Backend & LangGraph Multi-Agent Engine operational.',
      time: '10m ago',
      read: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Periodically check for model health issues
  useEffect(() => {
    fetch(`${API_BASE}/models/`)
      .then(r => r.json())
      .then((models: any[]) => {
        if (Array.isArray(models)) {
          const unhealthy = models.filter(m => m.health_status === 'unhealthy' || m.health_status === 'offline');
          if (unhealthy.length > 0) {
            setNotifications(prev => {
              if (prev.some(n => n.id === 'model-health')) return prev;
              return [
                {
                  id: 'model-health',
                  type: 'warning',
                  title: 'Model Provider Notice',
                  message: `${unhealthy.length} model(s) currently offline or unconfigured (${unhealthy.map(m => m.display_name || m.model_id).slice(0, 2).join(', ')}).`,
                  time: 'Live',
                  read: false,
                },
                ...prev,
              ];
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header style={{
      height: 48, background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
      flexShrink: 0, zIndex: 10, position: 'relative'
    }}>
      {/* Hamburger */}
      <button onClick={onMenuClick} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4 }}>
        <Menu size={18} />
      </button>

      {/* Search Bar */}
      <div style={{
        flex: 1, maxWidth: 460, display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 6, padding: '5px 10px',
      }}>
        <Search size={13} color="var(--text-muted)" />
        <input placeholder="Search commands, agents, models..." style={{
          flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)',
          fontSize: 11, fontFamily: 'var(--font)', outline: 'none'
        }} />
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <kbd style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 4px', fontSize: 8, color: 'var(--text-muted)' }}>Ctrl</kbd>
          <kbd style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: 3, padding: '1px 4px', fontSize: 8, color: 'var(--text-muted)' }}>K</kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
        <IconBtn onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </IconBtn>
        
        <span className="hide-mobile">
          <IconBtn onClick={() => navigate('/console')} title="Developer Console">
            <Terminal size={14} />
          </IconBtn>
        </span>
        
        <span className="hide-mobile">
          <IconBtn onClick={() => navigate('/analytics')} title="System Analytics">
            <Activity size={14} />
          </IconBtn>
        </span>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setNotificationsOpen(o => !o)}
            style={{
              position: 'relative', width: 28, height: 28,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: unreadCount > 0 ? 'var(--accent-light)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
            title="System Notifications"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                minWidth: 14, height: 14, borderRadius: 7,
                background: 'var(--accent)', color: '#fff',
                fontSize: 8, fontWeight: 700, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                padding: '0 3px', border: '1px solid var(--bg-sidebar)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div style={{
              position: 'absolute', top: 36, right: 0, width: 320,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              zIndex: 100, overflow: 'hidden', animation: 'fadeIn 0.15s ease'
            }}>
              <div style={{
                padding: '10px 12px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-sidebar)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Bell size={13} color="var(--accent-light)" />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>SYSTEM NOTIFICATIONS</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-light)', fontSize: 9, cursor: 'pointer', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 280, overflowY: 'auto', padding: '4px 0' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 16, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
                    No system notifications. All services nominal.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px', borderBottom: '1px solid var(--border-light)',
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        background: n.read ? 'transparent' : 'rgba(196,98,26,0.06)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ marginTop: 2 }}>
                        {n.type === 'warning' && <AlertTriangle size={14} color="#f39c12" />}
                        {n.type === 'error' && <ShieldAlert size={14} color="#e74c3c" />}
                        {n.type === 'success' && <CheckCircle size={14} color="var(--green)" />}
                        {n.type === 'info' && <Info size={14} color="var(--blue)" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</span>
                          <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.message}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(n.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div style={{
                padding: '8px 12px', borderTop: '1px solid var(--border)',
                background: 'var(--bg-sidebar)', textAlign: 'center'
              }}>
                <button
                  onClick={() => { navigate('/console'); setNotificationsOpen(false); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 9, cursor: 'pointer' }}
                >
                  View Developer Log Traces →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>R</div>
          <div className="hide-mobile">
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>Rishabh</div>
            <div style={{ fontSize: 8, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Online
            </div>
          </div>
          <ChevronDown size={12} color="var(--text-muted)" className="hide-mobile" />
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        position: 'relative', width: 28, height: 28,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}
