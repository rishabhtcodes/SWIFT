import React from 'react';
import { motion } from 'framer-motion';
import {
  Network, Brain, FileSearch, Code, Bug, FolderOpen, Wrench, GraduationCap,
  Cpu, Activity, ChevronRight
} from 'lucide-react';

const AGENTS = [
  { icon: Network,       name: 'Planner Agent',   role: 'Task Decomposition', status: 'Active',  model: 'llama-3.1-70b', tasks: 8 },
  { icon: Brain,         name: 'Memory Agent',    role: 'Memory Manager',     status: 'Active',  model: 'llama-3.1-8b',  tasks: 3 },
  { icon: FileSearch,    name: 'Research Agent',  role: 'Knowledge Retrieval',status: 'Active',  model: 'gemini-1.5-flash', tasks: 6 },
  { icon: Code,          name: 'Code Agent',      role: 'Software Engineer',  status: 'Active',  model: 'llama-3.1-70b', tasks: 24 },
  { icon: Bug,           name: 'Debug Agent',     role: 'QA & Bug Finder',    status: 'Idle',    model: 'llama-3.1-70b', tasks: 0 },
  { icon: FolderOpen,    name: 'File Agent',      role: 'File Management',    status: 'Active',  model: 'llama-3.1-8b',  tasks: 4 },
  { icon: Wrench,        name: 'Tool Agent',      role: 'Tool Executor',      status: 'Active',  model: 'gemini-1.5-flash', tasks: 7 },
  { icon: GraduationCap, name: 'Learning Agent',  role: 'Lesson Extraction',  status: 'Idle',    model: 'llama-3.1-70b', tasks: 0 },
];

export function Agents() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>AGENTS</h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{AGENTS.filter(a => a.status === 'Active').length} active of {AGENTS.length} registered</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: 'var(--green)', background: 'rgba(78,155,92,0.12)', border: '1px solid rgba(78,155,92,0.25)', borderRadius: 4, padding: '4px 8px' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          ACTIVE
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {AGENTS.map((a, i) => (
          <div key={a.name} className="card" style={{ padding: '12px 12px', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 6, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={16} color="var(--accent-light)" />
              </div>
              <span style={{ fontSize: 8, padding: '2px 6px', borderRadius: 3, background: a.status === 'Active' ? 'rgba(78,155,92,0.12)' : 'rgba(255,255,255,0.05)', color: a.status === 'Active' ? 'var(--green)' : 'var(--text-muted)', letterSpacing: '0.06em' }}>{a.status}</span>
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