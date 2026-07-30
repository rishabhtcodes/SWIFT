import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2, Search, Brain, Zap, Send, Paperclip, Image, Mic, Terminal as TerminalIcon,
  Network, FileSearch, Code, Bug, FolderOpen, Wrench, GraduationCap,
  FileText, Github, CloudUpload, RefreshCw, Bot
} from 'lucide-react';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

// ── helpers ──────────────────────────────────────────────────────────────────
const CAPS = [
  { icon: Code2,  label: 'CODE',     desc: 'Generate code, debug & explain' },
  { icon: Search, label: 'RESEARCH', desc: 'Search knowledge base & the web' },
  { icon: Brain,  label: 'REMEMBER', desc: 'Store and recall important info' },
  { icon: Zap,    label: 'AUTOMATE', desc: 'Automate workflows and repetitive tasks' },
];

const ICONS: Record<string, React.ElementType> = {
  Network, Brain, FileSearch, Code, Bug, FolderOpen, Wrench, GraduationCap, FileText, Github, CloudUpload, Bot
};

function getIcon(name: string, defaultIcon: React.ElementType = Bot) {
  if (!name) return defaultIcon;
  for (const [k, v] of Object.entries(ICONS)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return defaultIcon;
}

// ── mini SVG chart ────────────────────────────────────────────────────────────
function SparkLine() {
  const pts = [30,45,28,60,40,70,55,80,45,75,60,85,50,72,65,90,55,78];
  const w = 280, h = 60;
  const mx = Math.max(...pts); const mn = Math.min(...pts);
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - ((p - mn) / (mx - mn)) * (h - 8) - 4);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const fill = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 60 }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4621A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C4621A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sg)" />
      <path d={d} fill="none" stroke="#C4621A" strokeWidth="1.5" />
    </svg>
  );
}

// ── donut chart ───────────────────────────────────────────────────────────────
function DonutChart({ pct }: { pct: number }) {
  const r = 38, circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#C4621A" strokeWidth="10"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      <text x="50" y="46" textAnchor="middle" fill="#E8D5B0" fontSize="14" fontWeight="700">{pct}%</text>
      <text x="50" y="60" textAnchor="middle" fill="#8A7355" fontSize="7">Memory Used</text>
    </svg>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  useEffect(() => {
    fetch(`${API_BASE}/stats/dashboard`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(console.error);
  }, []);

  const send = () => { if (input.trim()) { navigate('/chat', { state: { q: input } }); setInput(''); } };

  const systemOverview = stats?.system_overview || { agents_active: 0, tools_available: 0, memory_used_gb: 0, storage_used_gb: 0 };
  const agentsList = stats?.agents || [];
  const tasksList = stats?.current_tasks || [];
  const activityList = stats?.recent_activity || [];
  const memSnapshot = stats?.memory_snapshot || { total: 0, conversations: 0, files: 0, facts: 0 };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 0, height: '100%', overflow: 'hidden' }}>
      {/* ── CENTER ─────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Welcome card */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)', marginBottom: 4 }}>
            {greet}, RISHABH! 👋
          </h1>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            I'm Swift, your AI assistant. I can help you plan, code, research,<br />analyze and automate tasks for you.
          </p>

          {/* Capability cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 14 }}>
            {CAPS.map(({ icon: Icon, label, desc }) => (
              <button key={label} onClick={() => navigate('/chat')} style={{
                background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 6,
                padding: '10px 10px', textAlign: 'left', color: 'var(--text-primary)', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <Icon size={16} color="var(--accent-light)" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            marginTop: 12, background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '10px 12px',
          }}>
            <textarea
              value={input} rows={2}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask Swift anything..."
              style={{
                width: '100%', background: 'none', border: 'none', resize: 'none',
                color: 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font)',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {[Paperclip, Image, Mic, TerminalIcon].map((Icon, i) => (
                  <Icon key={i} size={13} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                ))}
              </div>
              <button onClick={send} style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--accent)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={12} color="#fff" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Agent Console + Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 10 }}>

          {/* Agent Console */}
          <div className="card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>AGENT CONSOLE</span>
              <button onClick={() => navigate('/agents')} style={{ fontSize: 9, color: 'var(--accent-light)', background: 'none', border: 'none', letterSpacing: '0.06em' }}>VIEW ALL AGENTS</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {agentsList.slice(0,8).map((agent: any) => {
                const Icon = getIcon(agent.name, Bot);
                return (
                <div key={agent.name} className="card2" style={{ padding: '8px 8px', textAlign: 'center' }}>
                  <Icon size={18} color={agent.status === 'Active' ? 'var(--accent-light)' : 'var(--text-dim)'} style={{ marginBottom: 5 }} />
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{agent.name}</div>
                  <div style={{ fontSize: 8, color: agent.status === 'Active' ? 'var(--accent-light)' : 'var(--text-dim)', marginBottom: 3 }}>{agent.status}</div>
                </div>
              )})}
              {!agentsList.length && <div style={{fontSize:10, color:'var(--text-muted)', gridColumn:'span 4', textAlign:'center'}}>Loading...</div>}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>RECENT ACTIVITY</span>
              <span style={{ fontSize: 9, color: 'var(--accent-light)', cursor: 'pointer' }}>VIEW ALL</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activityList.map((act: any, idx: number) => {
                const Icon = getIcon(act.label, Bot);
                return (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 4, background: 'var(--bg-card2)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={10} color="var(--accent-light)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: 'var(--text-primary)', lineHeight: 1.3 }}>{act.label}</div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 1 }}>{act.time}</div>
                  </div>
                </div>
              )})}
              {!activityList.length && <div style={{fontSize:10, color:'var(--text-muted)'}}>No recent activity</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
      <div style={{ borderLeft: '1px solid var(--border)', padding: '14px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* System Overview */}
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>SYSTEM OVERVIEW</span>
            <RefreshCw size={11} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => window.location.reload()} />
          </div>
          <SparkLine />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6, marginTop: 8 }}>
            {[
              { label: 'AGENTS',  val: systemOverview.agents_active.toString(), sub: '• Active', subColor: 'var(--green)' },
              { label: 'TOOLS',   val: systemOverview.tools_available.toString(), sub: '• Available', subColor: 'var(--blue)' },
              { label: 'MEMORY',  val: `${systemOverview.memory_used_gb} GB`, sub: '• Used', subColor: 'var(--accent-light)' },
              { label: 'STORAGE', val: `${systemOverview.storage_used_gb} GB`, sub: '• Used', subColor: 'var(--accent-light)' },
            ].map(s => (
              <div key={s.label} className="card2" style={{ padding: '7px 8px' }}>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
                <div style={{ fontSize: 8, color: s.subColor, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Tasks */}
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>CURRENT TASKS</span>
            <span style={{ fontSize: 9, color: 'var(--accent-light)', cursor: 'pointer' }}>VIEW ALL</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasksList.map((t: any, idx: number) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 140 }}>{t.label}</div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{t.sub}</div>
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{t.pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
              </div>
            ))}
            {!tasksList.length && <div style={{fontSize:10, color:'var(--text-muted)'}}>No active tasks</div>}
          </div>
        </div>

        {/* Memory Snapshot */}
        <div className="card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>MEMORY SNAPSHOT</span>
            <span style={{ fontSize: 9, color: 'var(--accent-light)', cursor: 'pointer' }}>VIEW ALL</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {[
                { label: 'Total Memories', val: memSnapshot.total, icon: FileText },
                { label: 'Conversations',  val: memSnapshot.conversations, icon: Brain },
                { label: 'Files Indexed',  val: memSnapshot.files, icon: FolderOpen },
                { label: 'User Facts',     val: memSnapshot.facts, icon: GraduationCap },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={11} color="var(--accent-light)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{label}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)' }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <DonutChart pct={Math.min(100, Math.max(10, Math.round((memSnapshot.total / 5000) * 100)))} />
          </div>
        </div>
      </div>
    </div>
  );
}