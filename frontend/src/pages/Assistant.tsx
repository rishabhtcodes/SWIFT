import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Sparkles, Bot, User, Loader2, Code, Search, Brain } from 'lucide-react';

type Msg = { id: string; role: 'user' | 'assistant' | 'system'; content: string; agent?: string };

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

const SUGGESTIONS = [
  { icon: Code, text: 'Build a Spotify clone with React and FastAPI', color: 'text-cyan-400' },
  { icon: Search, text: 'Research the latest LLM architectures', color: 'text-purple-400' },
  { icon: Brain, text: 'What have I been working on this week?', color: 'text-pink-400' },
];

export function Assistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm Swift — your AI operating system. I can build software, research topics, analyze documents, and orchestrate 14 specialist agents to complete complex tasks.\n\nWhat would you like to build or explore today?", agent: 'CEO' },
  ]);
  const [streaming, setStreaming] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streaming]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setStreaming(true);
    setCurrentAgent('CEO');
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error('Server error');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') { setStreaming(false); return; }
          try {
            const evt = JSON.parse(data);
            if (evt.type === 'agent_start') {
              setCurrentAgent(evt.agent);
              setMessages(m => [...m, { id: crypto.randomUUID(), role: 'system', content: `${evt.agent} Agent is working...`, agent: evt.agent }]);
            } else if (evt.type === 'done') {
              setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: evt.answer || 'Task completed.', agent: 'CEO' }]);
            } else if (evt.type === 'error') {
              setMessages(m => [...m, { id: crypto.randomUUID(), role: 'system', content: `Error: ${evt.error}`, agent: 'System' }]);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Show a demo response when backend not available
        setTimeout(() => {
          setMessages(m => [...m, {
            id: crypto.randomUUID(), role: 'assistant', agent: 'CEO',
            content: `I've analyzed your request: "${text}"\n\n**Swift AI OS is running in demo mode.** To enable full agent orchestration, set your API keys in Settings (GROQ_API_KEY or GOOGLE_API_KEY).\n\nWhen connected, I'll:\n1. 🧠 CEO Agent will decompose this task\n2. 📋 Planner will create subtasks\n3. ⚡ Specialist agents will execute in parallel\n4. ✅ Results will be merged and returned`
          }]);
        }, 1200);
      }
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-4xl flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-amber shadow-glow">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold">Swift Assistant</div>
          <div className="text-[11px] text-[#6E6E7A]">
            {streaming
              ? <span className="text-amber-400 flex items-center gap-1"><Loader2 className="h-2.5 w-2.5 animate-spin" />{currentAgent} is working...</span>
              : '14 agents ready • Multi-model router active'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin rounded-2xl glass p-5">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}
            >
              {m.role !== 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <Bot className="h-3.5 w-3.5 text-amber-400" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                m.role === 'user'
                  ? 'gradient-amber text-white'
                  : m.role === 'system'
                  ? 'bg-white/5 text-[11px] text-[#6E6E7A] italic py-1.5'
                  : 'bg-white/5'
              }`}>
                {m.agent && m.role !== 'system' && (
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-amber-400/70">{m.agent} Agent</div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {streaming && (
          <div className="flex items-center gap-2 text-xs text-[#6E6E7A]">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
            Orchestrating agents...
          </div>
        )}
      </div>

      {/* Suggestions (when empty) */}
      {messages.length === 1 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {SUGGESTIONS.map(({ icon: Icon, text, color }) => (
            <button key={text} onClick={() => send(text)}
              className="glass flex items-start gap-2 rounded-xl p-3 text-left text-xs transition hover:border-amber-500/30 hover:bg-amber-500/5">
              <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${color}`} />
              <span className="text-[#6E6E7A]">{text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 glass rounded-2xl p-2">
        <div className="flex items-end gap-2">
          <button className="rounded-xl p-2.5 text-[#6E6E7A] transition hover:bg-white/5 hover:text-white">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            rows={1}
            placeholder="Ask Swift to build, research, plan, or analyze..."
            className="flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-[#3A3A44]"
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="gradient-amber flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-glow transition disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}