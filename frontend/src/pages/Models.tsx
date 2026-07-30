import React from 'react';
import { Cpu, RotateCw } from 'lucide-react';

const MODELS = [
  { provider: 'Groq',   model: 'llama-3.1-70b', status: 'Online', latency: '120ms', rpm: 30 },
  { provider: 'Groq',   model: 'llama-3.1-8b',  status: 'Online', latency: '60ms',  rpm: 30 },
  { provider: 'Google', model: 'gemini-1.5-flash', status: 'Online', latency: '890ms', rpm: 60 },
  { provider: 'Google', model: 'gemini-1.5-pro',   status: 'Online', latency: '1.2s',  rpm: 15 },
  { provider: 'Ollama', model: 'llama3.2',      status: 'Offline', latency: '—',   rpm: '—' },
  { provider: 'OpenAI', model: 'gpt-4o',        status: 'Key Missing', latency: '—', rpm: '—' },
];

export function Models() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>MODELS</h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Multi-provider AI model orchestration • {MODELS.filter(m => m.status === 'Online').length} online</p>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
          <RotateCw size={14} />
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>PROVIDER</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>MODEL</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>LATENCY</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>RPM</th>
            </tr>
          </thead>
          <tbody>
            {MODELS.map((m, i) => (
              <tr key={m.model} style={{ borderBottom: i === MODELS.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-primary)' }}>{m.provider}</td>
                <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-primary)' }}>{m.model}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    fontSize: 8, padding: '2px 7px', borderRadius: 3, letterSpacing: '0.06em',
                    background: m.status === 'Online' ? 'rgba(78,155,92,0.12)' : m.status === 'Offline' ? 'rgba(255,255,255,0.05)' : 'rgba(196,98,26,0.12)',
                    color: m.status === 'Online' ? 'var(--green)' : m.status === 'Offline' ? 'var(--text-muted)' : 'var(--accent-light)'
                  }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-muted)', textAlign: 'right' }}>{m.latency}</td>
                <td style={{ padding: '10px 14px', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-muted)', textAlign: 'right' }}>{m.rpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
