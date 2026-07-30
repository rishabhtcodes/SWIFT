import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Paperclip, Image as ImageIcon, Mic, Bot, User, Loader2, X } from 'lucide-react';

type Msg = { id: string; role: 'user' | 'assistant' | 'system'; content: string; agent?: string; image?: string };

const API = 'http://localhost:8000/api/v1';

export function Chat() {
  const location = useLocation();
  const initQ = (location.state as any)?.q || '';
  const [input, setInput] = useState(initQ);
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', role: 'assistant', agent: 'Swift', content: "Hello, I'm Swift — your AI operating system. I can plan, code, research, and orchestrate agents to complete complex tasks.\n\nWhat would you like to build today?" }
  ]);
  const [streaming, setStreaming] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Multimodal States
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ id: string, name: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streaming]);

  useEffect(() => { if (initQ) send(initQ); }, []);

  // Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Image Upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Document Upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API}/documents/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setAttachedFile({ id: data.document_id, name: data.filename });
      } else {
        console.error('Upload failed', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const send = async (text: string) => {
    let t = text.trim();
    if (!t && !attachedImage) return; // allow sending just an image
    if (streaming) return;
    
    // Add file context to text
    if (attachedFile) {
      t = `[Attached File: ${attachedFile.name}]\n\n${t}`;
    }

    setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', content: t, image: attachedImage || undefined }]);
    setInput('');
    const currentImg = attachedImage;
    
    // Reset attachments
    setAttachedImage(null);
    setAttachedFile(null);
    
    setStreaming(true); setCurrentAgent('CEO');
    abortRef.current?.abort();
    const ctrl = new AbortController(); abortRef.current = ctrl;
    try {
      const res = await fetch(`${API}/chat/stream`, {
        method: 'POST', signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t, image_base64: currentImg || null, document_id: attachedFile?.id || null }),
      });
      if (!res.ok) throw new Error('err');
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      if (!reader) return;
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const d = line.slice(5).trim();
          if (d === '[DONE]') { setStreaming(false); return; }
          try {
            const ev = JSON.parse(d);
            if (ev.type === 'agent_start') { setCurrentAgent(ev.agent); setMessages(m => [...m, { id: crypto.randomUUID(), role: 'system', content: `${ev.agent} Agent is working...` }]); }
            else if (ev.type === 'error') { setMessages(m => [...m, { id: crypto.randomUUID(), role: 'system', content: `❌ Error: ${ev.error}` }]); }
            else if (ev.type === 'done') setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: ev.answer || 'Done.', agent: 'Swift' }]);
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setTimeout(() => setMessages(m => [...m, {
          id: crypto.randomUUID(), role: 'assistant', agent: 'Swift',
          content: `I received your request: "${t}"\n\n**Demo mode** — Backend not connected.\n\nTo enable full agent orchestration, add your API keys in Settings:\n• GROQ_API_KEY=gsk_...\n• GOOGLE_API_KEY=AIza...\n\nThen restart with \`start swift\``
        }]), 1000);
      }
    } finally { setStreaming(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role !== 'user' && (
              <div style={{ width: 26, height: 26, borderRadius: 5, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={13} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: '75%', padding: m.role === 'system' ? '4px 10px' : '10px 14px',
              borderRadius: 8, fontSize: 12, lineHeight: 1.6,
              background: m.role === 'user' ? 'var(--accent)' : m.role === 'system' ? 'transparent' : 'var(--bg-card)',
              border: m.role === 'system' ? 'none' : '1px solid var(--border)',
              color: m.role === 'user' ? '#fff' : m.role === 'system' ? 'var(--text-muted)' : 'var(--text-primary)',
              fontStyle: m.role === 'system' ? 'italic' : 'normal',
              fontSize: m.role === 'system' ? 10 : 12,
            }}>
              {m.agent && m.role === 'assistant' && <div style={{ fontSize: 9, color: 'var(--accent-light)', letterSpacing: '0.08em', marginBottom: 4 }}>{m.agent}</div>}
              {m.image && <img src={m.image} alt="upload" style={{ maxWidth: '100%', borderRadius: 6, marginBottom: 6 }} />}
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            </div>
            {m.role === 'user' && (
              <div style={{ width: 26, height: 26, borderRadius: 5, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={13} color="var(--text-muted)" />
              </div>
            )}
          </div>
        ))}
        {streaming && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            <Loader2 size={11} color="var(--accent-light)" style={{ animation: 'spin 1s linear infinite' }} />
            {currentAgent} is working...
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
        
        {/* Attachment Preview Chips */}
        {(attachedImage || attachedFile || isUploading) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {isUploading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...
              </div>
            )}
            {attachedFile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: 'var(--text-primary)' }}>
                <Paperclip size={10} color="var(--accent-light)" /> {attachedFile.name}
                <X size={10} style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => setAttachedFile(null)} />
              </div>
            )}
            {attachedImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: 'var(--text-primary)' }}>
                <ImageIcon size={10} color="var(--accent-light)" /> Image Attached
                <X size={10} style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => setAttachedImage(null)} />
              </div>
            )}
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
          <textarea value={input} rows={2} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={isListening ? "Listening..." : "Ask Swift anything..."}
            style={{ width: '100%', background: 'none', border: 'none', resize: 'none', color: isListening ? 'var(--accent-light)' : 'var(--text-primary)', fontSize: 12, fontFamily: 'var(--font)' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              
              {/* Hidden Inputs */}
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
              <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />

              <Paperclip size={13} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()} />
              <ImageIcon size={13} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => imageInputRef.current?.click()} />
              <Mic size={13} color={isListening ? "var(--accent)" : "var(--text-muted)"} style={{ cursor: 'pointer' }} onClick={toggleListening} />
            
            </div>
            <button onClick={() => send(input)} style={{ width: 28, height: 28, borderRadius: 5, background: 'var(--accent)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={12} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
