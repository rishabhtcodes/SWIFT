import { motion } from 'framer-motion';
import { Bot, Activity, Cpu, ChevronRight } from 'lucide-react';

interface AgentCardProps {
  name: string;
  role: string;
  status: 'active' | 'idle';
  model: string;
  tasks: number;
  index: number;
}

export function AgentCard({ name, role, status, model, tasks, index }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.02 }}
      className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:border-amber-500/30 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10">
          <Bot className="h-5 w-5 text-amber-400" />
        </div>
        <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] ${
          status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[#6E6E7A]'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'bg-emerald-400 pulse-amber' : 'bg-[#6E6E7A]'}`} />
          {status}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-base font-semibold">{name} Agent</div>
        <div className="text-xs text-[#6E6E7A]">{role}</div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-[#6E6E7A]">
          <Cpu className="h-3 w-3" />
          <span className="font-mono truncate max-w-[100px]">{model}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#6E6E7A]">
          <Activity className="h-3 w-3" />
          <span>{tasks} tasks</span>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-end pr-4 opacity-0 transition group-hover:opacity-100">
        <ChevronRight className="h-4 w-4 text-amber-400" />
      </div>
    </motion.div>
  );
}
