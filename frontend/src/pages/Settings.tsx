import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, Settings as SettingsIcon } from 'lucide-react';

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

const KEYS = [
  { label: 'Groq API Key',      env: 'GROQ_API_KEY',      hint: 'gsk_...',     required: true },
  { label: 'Google AI Key',     env: 'GOOGLE_API_KEY',    hint: 'AIza...',     required: false },
  { label: 'OpenAI API Key',    env: 'OPENAI_API_KEY',    hint: 'sk-...',      required: false },
  { label: 'Anthropic Key',     env: 'ANTHROPIC_API_KEY', hint: 'sk-ant-...',  required: false },
];

export function Settings() {
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/settings/keys`)
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === 'object') {
          setVals(d);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/settings/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vals)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>SETTINGS</h1>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Configure API keys and system preferences</p>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Key size={13} color="var(--accent-light)" />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>API KEYS</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {KEYS.map(k => (
            <div key={k.env}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>
                {k.label} {k.required && <span style={{ color: 'var(--accent-light)' }}>*required</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 5, padding: '7px 10px' }}>
                <input type={show[k.env] ? 'text' : 'password'} placeholder={k.hint} value={vals[k.env] || ''}
                  onChange={e => setVals(v => ({ ...v, [k.env]: e.target.value }))}
                  style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 11, fontFamily: 'var(--mono)' }} />
                <button onClick={() => setShow(s => ({ ...s, [k.env]: !s[k.env] }))}>
                  {show[k.env] ? <EyeOff size={12} color="var(--text-muted)" /> : <Eye size={12} color="var(--text-muted)" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={loading}
          className="accent-btn" style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 10, letterSpacing: '0.06em', opacity: loading ? 0.7 : 1 }}>
          <Save size={12} /> {loading ? 'SAVING...' : (saved ? 'SAVED!' : 'SAVE KEYS')}
        </button>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <SettingsIcon size={13} color="var(--accent-light)" />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>SYSTEM INFO</span>
        </div>
        {[
          ['Backend URL', 'http://localhost:8000'],
          ['Frontend URL', 'http://localhost:5173'],
          ['Default Model', 'llama-3.1-70b (Groq)'],
          ['Version', 'v0.1.0'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</span>
            <code style={{ fontSize: 10, color: 'var(--accent-light)', fontFamily: 'var(--mono)' }}>{v}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
