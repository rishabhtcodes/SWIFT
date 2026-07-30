import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, Power, ChevronDown, Search, Plus } from "lucide-react";
import { api } from "../services/api";
import { ModelHealthBadge } from "../components/models/ModelHealthBadge";
import type { Model } from "../types";

export function ModelManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "enabled" | "healthy">("all");

  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ["models"],
    queryFn: () => api.get("/models/"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      api.patch(`/models/${id}`, { is_enabled: enabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["models"] }),
  });

  const healthMutation = useMutation({
    mutationFn: (id: string) => api.post(`/models/${id}/health`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["models"] }),
  });

  const filtered = models.filter((m) => {
    if (search && !`${m.display_name} ${m.model_id} ${m.provider}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "enabled") return m.is_enabled;
    if (filter === "healthy") return m.health_status === "healthy";
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold tracking-tight">Model Manager</h1>
        <p className="mt-1 text-sm text-graphite-300">
          Configure, monitor, and route between pluggable LLM providers.
        </p>
      </motion.div>

      <div className="flex items-center gap-3">
        <div className="glass flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-graphite-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models, providers, capabilities..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-graphite-400"
          />
        </div>
        <div className="glass flex rounded-xl p-1">
          {(["all", "enabled", "healthy"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs capitalize transition ${
                filter === f ? "bg-white/10 text-white" : "text-graphite-300 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="gradient-amber flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-ink-950 shadow-glow transition hover:opacity-90">
          <Plus className="h-4 w-4" /> Register Model
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass overflow-hidden rounded-2xl"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-graphite-300">
              <th className="px-5 py-3">Model</th>
              <th className="px-5 py-3">Provider</th>
              <th className="px-5 py-3">Health</th>
              <th className="px-5 py-3">Latency</th>
              <th className="px-5 py-3">Context</th>
              <th className="px-5 py-3">Cost / 1M tokens</th>
              <th className="px-5 py-3">Capabilities</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <motion.tr
                key={m.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-white/5 last:border-0 transition hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3">
                  <div className="font-medium">{m.display_name || m.model_id}</div>
                  <div className="text-xs text-graphite-400">{m.model_id}</div>
                </td>
                <td className="px-5 py-3 capitalize text-graphite-300">{m.provider}</td>
                <td className="px-5 py-3">
                  <ModelHealthBadge status={m.health_status} />
                </td>
                <td className="px-5 py-3 text-graphite-300">
                  {m.latency_ms ? `${m.latency_ms}ms` : "—"}
                </td>
                <td className="px-5 py-3 text-graphite-300">
                  {(m.context_window / 1000).toFixed(0)}K
                </td>
                <td className="px-5 py-3 font-mono text-xs text-graphite-300">
                  ${Number(m.input_cost_per_1m).toFixed(2)} / ${Number(m.output_cost_per_1m).toFixed(2)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(m.capabilities || []).slice(0, 3).map((c) => (
                      <span key={c} className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 text-graphite-300">{m.priority}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleMutation.mutate({ id: m.id, enabled: !m.is_enabled })}
                    className="flex items-center gap-1.5"
                  >
                    <Power className={`h-4 w-4 ${m.is_enabled ? "text-emerald-400" : "text-graphite-400"}`} />
                    <span className={`text-xs ${m.is_enabled ? "text-emerald-400" : "text-graphite-400"}`}>
                      {m.is_enabled ? "Enabled" : "Disabled"}
                    </span>
                  </button>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => healthMutation.mutate(m.id)}
                    className="rounded-lg border border-white/10 p-1.5 text-graphite-300 transition hover:border-amber-500/40 hover:text-amber-400"
                    title="Check health"
                  >
                    <Activity className="h-3.5 w-3.5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}