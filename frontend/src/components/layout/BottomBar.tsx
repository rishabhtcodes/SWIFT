import React, { useState, useEffect } from 'react';
import { Mic, Terminal, Keyboard, Volume2, VolumeX, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BottomBar() {
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bars] = useState(() => Array.from({ length: 32 }, (_, i) => 0.2 + Math.random() * 0.8));
  const [animated, setAnimated] = useState(bars);
  const navigate = useNavigate();

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setAnimated(bars.map(b => 0.1 + Math.random() * 0.9));
    }, 120);
    return () => clearInterval(id);
  }, [active]);

  const handleKeyboardClick = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true
    }));
  };

  const buttonStyle = {
    width: 28, height: 28, background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
    cursor: 'pointer', transition: 'all 0.2s ease'
  };

  return (
    <footer style={{
      height: 46, background: 'var(--bg-sidebar)', borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0,
    }}>
      {/* Mic icon */}
      <button onClick={() => setActive(a => !a)} style={{
        ...buttonStyle,
        background: active ? 'var(--accent)' : 'var(--bg-card)',
        color: active ? '#fff' : 'var(--text-muted)',
      }}>
        {active ? <Mic size={12} /> : <MicOff size={12} />}
      </button>

      {/* Status text */}
      <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
        {active ? 'Swift is listening...' : 'Swift is resting...'}
      </span>

      {/* Waveform */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 1.5, height: 20, flex: 1, opacity: active ? 1 : 0.3 }}>
        {animated.map((h, i) => (
          <div key={i} style={{
            width: 2, borderRadius: 1,
            height: `${h * 100}%`, maxHeight: 18,
            background: `rgba(196, 98, 26, ${active ? 0.7 : 0.25})`,
            transition: active ? 'height 0.12s ease' : 'none',
          }} />
        ))}
      </div>

      {/* Right buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
        <button onClick={() => navigate('/console')} style={buttonStyle} title="Console">
          <Terminal size={12} />
        </button>
        <button onClick={handleKeyboardClick} style={buttonStyle} title="Command Palette (Cmd+K)">
          <Keyboard size={12} />
        </button>
        <button onClick={() => setMuted(!muted)} style={buttonStyle} title={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </button>
        <button onClick={() => setActive(a => !a)} style={{
          ...buttonStyle,
          width: 32, height: 32,
          background: active ? 'var(--accent)' : 'var(--bg-card)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 6,
          color: active ? '#fff' : 'var(--text-muted)',
        }} title="Toggle Mic">
          {active ? <Mic size={14} /> : <MicOff size={14} />}
        </button>
      </div>

      {/* Powered by */}
      <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'var(--text-dim)', letterSpacing: '0.12em', userSelect: 'none', pointerEvents: 'none' }}>
        POWERED BY CAFFEINE AND CREATIVITY – RISHABH ☕
      </div>
    </footer>
  );
}
