import React from 'react';
import { BarChart3, TrendingUp, Zap, Clock } from 'lucide-react';

export function Analytics() {
  const bars = [45, 72, 38, 91, 56, 83, 67, 44, 95, 71, 58, 88];
  const labels = ['Jul 19','20','21','22','23','24','25','26','27','28','29','30'];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>ANALYTICS</h1>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Agent performance & system metrics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 10 }}>
        {[
          { label: 'Tasks Completed', value: '1,247', icon: Zap, trend: '+18%' },
          { label: 'Avg Response',    value: '2.4s',  icon: Clock, trend: '-12%' },
          { label: 'Success Rate',    value: '97.3%', icon: TrendingUp, trend: '+2.1%' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <s.icon size={14} color="var(--accent-light)" />
              <span style={{ fontSize: 9, color: 'var(--green)' }}>{s.trend}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Tasks Per Day (Last 12 Days)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: `${h}%`, background: 'var(--accent-light)', opacity: 0.8, borderRadius: '2px 2px 0 0' }} />
              <span style={{ fontSize: 8, color: 'var(--text-muted)', transform: 'rotate(45deg)', transformOrigin: 'left' }}>{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
