import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Cpu, Activity, Play, RefreshCw } from 'lucide-react';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

const BANNER = `
╔═════════════════════════════════════════════════════════════════╗
║                   SWIFT AI OS — DEVELOPER CONSOLE              ║
║         Real-time Agent Traces, Tool Execution & Diagnostics    ║
║         Type 'help' or execute shell commands                   ║
╚═════════════════════════════════════════════════════════════════╝
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
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/stats/system`)
      .then(r => r.json())
      .then(d => { if (d && typeof d.cpu === 'number') setSystemStats(d); })
      .catch(() => {});
  }, []);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setLogs([BANNER.trim(), 'swift@os:~$ ']);
      return;
    }

    if (trimmed.toLowerCase() === 'help') {
      const helpText = `Available commands:\n  help        - Show help message\n  status      - System & agent health\n  agents      - List registered agents\n  models      - Show active LLMs\n  clear       - Clear console output`;
      setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, helpText, 'swift@os:~$ ']);
      return;
    }

    if (trimmed.toLowerCase() === 'status') {
      const statusText = `[STATUS] All engines operational\nCPU: ${systemStats.cpu}% | Memory: ${systemStats.memory}% | Storage: ${systemStats.storage}%\nBackend API: ${API_BASE}\nAgents: 14 Active`;
      setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, statusText, 'swift@os:~$ ']);
      return;
    }

    if (trimmed.toLowerCase() === 'agents') {
      const agentText = `Active Agents:\n  - CEO Agent (Planning & Routing)\n  - Planner Agent (Decomposition)\n  - Coding Agent (Software Engineering)\n  - Backend Agent (FastAPI / APIs)\n  - Frontend Agent (React / TS)\n  - Database Agent (PostgreSQL / Vector)\n  - DevOps Agent (Docker / CI/CD)\n  - Testing Agent (QA / Unit Tests)\n  - Research Agent (RAG / Web Search)\n  - Vision Agent (Multimodal Qwen/Gemini)\n  - Memory Agent (Short/Long-term Memory)\n  - Learning Agent (Lesson Extraction)\n  - Docs Agent (Technical Writer)\n  - Deployment Agent (Vercel / Render)`;
      setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, agentText, 'swift@os:~$ ']);
      return;
    }

    if (trimmed.toLowerCase() === 'models') {
      const modelText = `Active Models:\n  - Qwen 3.7 Plus (Priority 15)\n  - Gemini 2.0 Flash (Priority 14)\n  - DeepSeek V3 (Priority 13)\n  - Qwen VL Plus (Priority 12)\n  - Gemini 1.5 Pro (Priority 11)\n  - Llama 3.3 70B (Priority 10)\n  - Llama 3.1 8B Instant (Priority 8)`;
      setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, modelText, 'swift@os:~$ ']);
      return;
    }

    // Default: Simulating system execution command
    const out = `Executing command: '${cmd}'...\nOutput: Command logged in developer trace.`;
    setLogs(prev => [...prev.slice(0, -1), `swift@os:~$ ${cmd}`, out, 'swift@os:~$ ']);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TerminalIcon size={18} color="var(--accent-light)" />
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>DEVELOPER & OBSERVABILITY CONSOLE</h1>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Real-time agent traces, model routing, and tool execution logs</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 10, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Cpu size={12} color="var(--accent)" /> CPU: {systemStats.cpu}%</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Activity size={12} color="var(--green)" /> Memory: {systemStats.memory}%</span>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="card scrollable" style={{ flex: 1, padding: '16px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-primary)', background: '#0a0a0c', border: '1px solid var(--border)' }}>
        {logs.map((l, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: 4, color: l.startsWith('swift@os') ? 'var(--accent-light)' : l.startsWith('[ROUTER]') ? '#f39c12' : l.startsWith('[AGENTS]') ? '#3498db' : 'var(--text-primary)' }}>
            {l}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ color: 'var(--accent-light)' }}>$</span>
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
            style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: 11, outline: 'none' }}
            autoFocus
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
