import React from 'react';
import {
  Crown, Network, Brain, FileSearch, Code, Eye, GraduationCap, Rocket, CheckSquare,
  FileText, Database, Layout, Server, ShieldAlert, Cpu, Activity
} from 'lucide-react';

const AGENTS = [
  { icon: Crown,         name: 'CEO Agent',          role: 'Master Orchestrator & Router', status: 'Active', model: 'qwen3.7-plus', tasks: 32 },
  { icon: Network,       name: 'Planner Agent',      role: 'Task Decomposition & Architecture', status: 'Active', model: 'llama-3.3-70b', tasks: 18 },
  { icon: Code,          name: 'Coding Agent',       role: 'Full-Stack Software Engineer', status: 'Active', model: 'qwen3.7-plus', tasks: 45 },
  { icon: Server,        name: 'Backend Agent',      role: 'FastAPI & Microservices Architect', status: 'Active', model: 'llama-3.3-70b', tasks: 28 },
  { icon: Layout,        name: 'Frontend Agent',     role: 'React, TypeScript & UI Designer', status: 'Active', model: 'gemini-2.0-flash', tasks: 31 },
  { icon: Database,      name: 'Database Agent',     role: 'SQL & Vector Store Engineer', status: 'Active', model: 'deepseek-chat', tasks: 22 },
  { icon: CheckSquare,   name: 'Testing Agent',      role: 'Automated QA & Unit Test Runner', status: 'Active', model: 'llama-3.1-8b', tasks: 16 },
  { icon: Rocket,        name: 'Deployment Agent',   role: 'Vercel, Render & Docker Deployer', status: 'Active', model: 'llama-3.3-70b', tasks: 12 },
  { icon: ShieldAlert,   name: 'DevOps Agent',       role: 'CI/CD & Infrastructure Security', status: 'Active', model: 'llama-3.3-70b', tasks: 14 },
  { icon: FileSearch,    name: 'Research Agent',     role: 'Web Search & RAG Knowledge', status: 'Active', model: 'gemini-2.0-flash', tasks: 29 },
  { icon: Eye,           name: 'Vision Agent',       role: 'Multimodal Image Analysis', status: 'Active', model: 'qwen-vl-plus', tasks: 9 },
  { icon: Brain,         name: 'Memory Agent',       role: 'Short & Long Term Memory Indexer', status: 'Active', model: 'llama-3.1-8b', tasks: 40 },
  { icon: GraduationCap, name: 'Learning Agent',     role: 'Self-Improvement & Pattern Extractor', status: 'Active', model: 'llama-3.3-70b', tasks: 11 },
  { icon: FileText,      name: 'Docs Agent',         role: 'Technical Writer & API Specs', status: 'Active', model: 'gemini-1.5-pro', tasks: 25 },
];

export function Agents() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>MULTI-AGENT SYSTEM</h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {AGENTS.filter(a => a.status === 'Active').length} active specialist agents registered in LangGraph orchestrator
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: 'var(--green)', background: 'rgba(78,155,92,0.12)', border: '1px solid rgba(78,155,92,0.25)', borderRadius: 4, padding: '4px 8px' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          ALL AGENTS ONLINE
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
        {AGENTS.map((a) => (
          <div key={a.name} className="card" style={{ padding: '12px 12px', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 6, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={16} color="var(--accent-light)" />
              </div>
              <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 3, background: 'rgba(78,155,92,0.12)', color: 'var(--green)', letterSpacing: '0.06em' }}>{a.status}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{a.name}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 10 }}>{a.role}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 8, fontSize: 9, color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Cpu size={9} /><span style={{ fontFamily: 'var(--mono)', fontSize: 8 }}>{a.model}</span></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Activity size={9} />{a.tasks} tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}