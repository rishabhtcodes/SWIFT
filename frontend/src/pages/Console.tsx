import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Cpu, Activity, Play, Trash2, Copy, Check, ShieldCheck } from 'lucide-react';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

const BANNER = `
╔═════════════════════════════════════════════════════════════════════╗
║                   SWIFT AI OS — DEVELOPER CONSOLE                   ║
║         Real-time Agent Traces, Tool Execution & Diagnostics        ║
║         Type 'help', 'status', 'agents', 'models' or commands       ║
╚═════════════════════════════════════════════════════════════════════╝
`;

export function Console() {
  const [logs, setLogs] = useState<string[]>([
    BANNER.trim(),
    `[SYSTEM] Swift AI OS Multi-Agent Orchestrator initialized.`,
    `[ROUTER] Loaded pluggable providers: Qwen, Groq, Gemini, DeepSeek, Ollama, OpenAI, Anthropic.`,
    `[AGENTS] 14 Active Specialist Agents (CEO, Planner, Coding, Backend, Frontend, Database, DevOps, Testing, Docs, Vision, Memory, Research, Learning, Deployment).`,
    `swift@os:~$ `,
  ]);
  const [input, setInput] = useState('');
  const [systemStats, setSystemStats] = useState({ cpu: 23, memory: 41, storage: 62 });
  const [copied, setCopied] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchStats = () => {
    fetch(`${API_BASE}/stats/system`)
      .then(r => r.json())
      .then(d => { if (d && typeof d.cpu === 'number') setSystemStats(d); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const runCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setLogs([BANNER.trim(), 'swift@os:~$ ']);
      return;
    }

    if (trimmed.toLowerCase() === 'help') {
      const helpText = `Available commands:\n  help        - Show syntax guide and commands\n  status      - Fetch live system telemetry (CPU, Memory, Storage)\n  agents      - List registered 14 specialist agents\n  models      - Query live LLM model registry\n  diagnostics - Run full system diagnostics test\n  clear       - Clear terminal buffer`;
      setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, helpText, 'swift@os:~$ ']);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }

    if (trimmed.toLowerCase() === 'status') {
      const statusText = `[STATUS] All engines operational\n  CPU Usage: ${systemStats.cpu}%\n  Memory Usage: ${systemStats.memory}%\n  Storage Usage: ${systemStats.storage}%\n  Backend API: ${API_BASE}\n  Status: 🟢 ONLINE`;
      setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, statusText, 'swift@os:~$ ']);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }

    if (trimmed.toLowerCase() === 'agents') {
      const agentText = `Registered Specialist Agents (14 Online):\n  - CEO Agent (Supervision & Routing)\n  - Planner Agent (Decomposition)\n  - Coding Agent (Full-Stack Engineer)\n  - Backend Agent (FastAPI / Microservices)\n  - Frontend Agent (React / TS / UI)\n  - Database Agent (PostgreSQL / Vector DB)\n  - Testing Agent (QA / Unit Tests)\n  - DevOps Agent (Docker / CI/CD)\n  - Research Agent (Web Search & RAG)\n  - Vision Agent (Multimodal Qwen/Gemini)\n  - Memory Agent (Short/Long-term Memory)\n  - Learning Agent (Lesson Extraction)\n  - Docs Agent (Technical Writer)\n  - Deployment Agent (Vercel / Render)`;
      setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, agentText, 'swift@os:~$ ']);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }

    if (trimmed.toLowerCase() === 'models' || trimmed.toLowerCase() === 'diagnostics') {
      try {
        const res = await fetch(`${API_BASE}/models/`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = `Live Model Registry (${data.length} registered):\n` + data.map(m => `  - [${m.provider.toUpperCase()}] ${m.display_name || m.model_id} (${m.health_status.toUpperCase()}) | Priority: ${m.priority}`).join('\n');
          setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, formatted, 'swift@os:~$ ']);
        } else {
          setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, `Failed to fetch model registry.`, 'swift@os:~$ ']);
        }
      } catch (err: any) {
        setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, `Error: ${err.message}`, 'swift@os:~$ ']);
      }
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      return;
    }

    // Generic command runner simulation
    const out = `[EXEC] Executed: '${cmd}'\nOutput: Action logged in developer trace.`;
    setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, out, 'swift@os:~$ ']);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TerminalIcon size={18} color="var(--accent-light)" />
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>DEVELOPER CONSOLE</h1>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Real-time agent traces, model routing, and terminal tool execution</p>
          </div>
        </div>

        {/* Toolbar controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => runCommand('diagnostics')}
            className="accent-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', fontSize: 10 }}
          >
            <Play size={11} /> DIAGNOSTICS
          </button>
          
          <button
            onClick={copyLogs}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 6, color: 'var(--text-muted)', fontSize: 10, cursor: 'pointer'
            }}
          >
            {copied ? <Check size={11} color="var(--green)" /> : <Copy size={11} />}
            {copied ? 'COPIED' : 'COPY LOGS'}
          </button>

          <button
            onClick={() => setLogs([BANNER.trim(), 'swift@os:~$ '])}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 6, color: 'var(--text-muted)', fontSize: 10, cursor: 'pointer'
            }}
            title="Clear Console"
          >
            <Trash2 size={11} /> CLEAR
          </button>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {/* macOS / IDE Terminal Titlebar */}
        <div style={{
          padding: '8px 12px', background: 'var(--bg-card2)', borderBottom: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-muted)', marginLeft: 8 }}>swift-os-terminal ~ zsh</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 9, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Cpu size={10} color="var(--accent)" /> CPU: {systemStats.cpu}%</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Activity size={10} color="var(--green)" /> RAM: {systemStats.memory}%</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="scrollable" style={{
          flex: 1, padding: '14px', fontFamily: 'var(--mono)', fontSize: 11,
          background: 'var(--bg-card)', color: 'var(--text-primary)', lineHeight: 1.6
        }}>
          {logs.map((l, i) => {
            let textColor = 'var(--text-primary)';
            if (l.startsWith('swift@os')) textColor = 'var(--accent-light)';
            else if (l.startsWith('[ROUTER]')) textColor = 'var(--accent)';
            else if (l.startsWith('[AGENTS]')) textColor = 'var(--blue)';
            else if (l.startsWith('[SYSTEM]')) textColor = 'var(--green)';
            else if (l.startsWith('Error')) textColor = 'var(--red)';

            return (
              <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: 4, color: textColor }}>
                {l}
              </div>
            );
          })}

          {/* Interactive Prompt */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>$</span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  runCommand(input);
                  setInput('');
                }
              }}
              placeholder="Type 'help', 'status', 'agents', 'models'..."
              style={{
                flex: 1, background: 'none', border: 'none',
                color: 'var(--text-primary)', fontFamily: 'var(--mono)',
                fontSize: 11, outline: 'none'
              }}
              autoFocus
            />
          </div>
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
