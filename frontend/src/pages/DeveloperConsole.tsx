import React from 'react';
import { Terminal, Cpu, Clock, Activity, AlertCircle, Database } from 'lucide-react';

export const DeveloperConsole: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-amber-400" />
          Developer & Observability Console
        </h1>
        <p className="text-neutral-400 text-sm">Real-time trace logs, active tool execution, memory allocations, and agent graph states</p>
      </div>

      <div className="glass p-4 rounded-xl border border-white/5 font-mono text-xs text-neutral-300 space-y-2 h-96 overflow-y-auto bg-black/40">
        <p className="text-neutral-500">[03:17:30] [INFO] [System] Swift AI OS multi-agent orchestrator initialized.</p>
        <p className="text-amber-400">[03:17:31] [ROUTER] Selected Groq (llama-3.1-70b-versatile) for task type 'planning'. Latency: 180ms.</p>
        <p className="text-cyan-400">[03:17:32] [CEO_AGENT] Decomposed goal into 4 parallel tasks: [backend, database, frontend, docs].</p>
        <p className="text-emerald-400">[03:17:33] [TOOL_EXEC] Terminal tool executed: 'docker compose up -d'. Exit Code: 0.</p>
        <p className="text-neutral-300">[03:17:35] [MEMORY_AGENT] Querying pgvector index memories_embedding with cosine distance threshold 0.85.</p>
      </div>
    </div>
  );
};
