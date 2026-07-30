import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity, Power, Search, Plus, Cpu, RotateCw } from 'lucide-react';
import { api } from '../services/api';
import { ModelHealthBadge } from '../components/models/ModelHealthBadge';
import type { Model } from '../types';

export function ModelManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'enabled' | 'healthy'>('all');

  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: () => api.get('/models/'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      api.patch(`/models/${id}`, { is_enabled: enabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['models'] }),
  });

  const healthMutation = useMutation({
    mutationFn: (id: string) => api.post(`/models/${id}/health`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['models'] }),
  });

  const filtered = models.filter((m) => {
    if (search && !`${m.display_name} ${m.model_id} ${m.provider}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'enabled') return m.is_enabled;
    if (filter === 'healthy') return m.health_status === 'healthy';
    return true;
  });

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>MODEL MANAGER</h1>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            Multi-provider AI model routing & telemetry • {models.filter(m => m.is_enabled).length} models enabled
          </p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['models'] })}
          className="accent-btn"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 10 }}
        >
          <RotateCw size={12} /> REFRESH
        </button>
      </div>

      {/* Controls Bar */}
      <div className="mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '6px 10px', fontSize: 11
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models, providers, or capabilities..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: 11
            }}
          />
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, padding: 2 }}>
          {(['all', 'enabled', 'healthy'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                border: 'none', background: filter === f ? 'var(--accent)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--text-muted)',
                padding: '4px 10px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                letterSpacing: '0.06em', cursor: 'pointer', textTransform: 'uppercase',
                transition: 'all 0.15s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Models Table Container */}
      <div className="card mobile-scroll-x" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>MODEL</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>PROVIDER</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>HEALTH</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>LATENCY</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>CONTEXT</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>COST / 1M</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>CAPABILITIES</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>PRIORITY</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>STATUS</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr
                key={m.id}
                style={{
                  borderBottom: i === filtered.length - 1 ? 'none' : '1px solid var(--border-light)',
                  transition: 'background 0.15s'
                }}
              >
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{m.display_name || m.model_id}</div>
                  <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text-muted)', marginTop: 1 }}>{m.model_id}</div>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{m.provider}</td>
                <td style={{ padding: '10px 14px' }}>
                  <ModelHealthBadge status={m.health_status} />
                </td>
                <td style={{ padding: '10px 14px', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {m.latency_ms ? `${m.latency_ms}ms` : '—'}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {(m.context_window / 1000).toFixed(0)}K
                </td>
                <td style={{ padding: '10px 14px', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text-muted)', textAlign: 'right' }}>
                  ${Number(m.input_cost_per_1m).toFixed(2)} / ${Number(m.output_cost_per_1m).toFixed(2)}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(m.capabilities || []).slice(0, 3).map((c) => (
                      <span key={c} style={{
                        fontSize: 8, padding: '2px 6px', borderRadius: 3,
                        background: 'var(--accent-dim)', color: 'var(--accent-light)', letterSpacing: '0.04em'
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-primary)', textAlign: 'center' }}>
                  {m.priority}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleMutation.mutate({ id: m.id, enabled: !m.is_enabled })}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 4,
                      border: '1px solid var(--border)', background: m.is_enabled ? 'rgba(78,155,92,0.12)' : 'rgba(255,255,255,0.05)',
                      color: m.is_enabled ? 'var(--green)' : 'var(--text-muted)', fontSize: 9, cursor: 'pointer'
                    }}
                  >
                    <Power size={10} />
                    {m.is_enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <button
                    onClick={() => healthMutation.mutate(m.id)}
                    style={{
                      background: 'none', border: '1px solid var(--border)', borderRadius: 4,
                      padding: '4px 6px', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
                    title="Check model health"
                  >
                    <Activity size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}