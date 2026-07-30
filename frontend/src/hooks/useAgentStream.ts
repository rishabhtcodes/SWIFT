import { useCallback, useRef, useState } from "react";

type StreamEvent = { type: string; [k: string]: any };

export function useAgentStream(onEvent: (e: StreamEvent) => void) {
  const [streaming, setStreaming] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (message: string) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setStreaming(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("swift_token") || ""}`,
          },
          body: JSON.stringify({ message }),
          signal: ctrl.signal,
        });
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              setStreaming(false);
              return;
            }
            try {
              const evt = JSON.parse(data) as StreamEvent;
              if (evt.type === "agent_start") setCurrentAgent(evt.agent);
              onEvent(evt);
            } catch {}
          }
        }
      } finally {
        setStreaming(false);
      }
    },
    [onEvent]
  );

  return { send, streaming, currentAgent };
}