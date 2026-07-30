import { motion } from 'framer-motion';
import { Bot, Code, Search, GitBranch, Brain, Rocket } from 'lucide-react';

const events = [
  { icon: Bot, color: 'text-amber-400', label: 'CEO Agent decomposed task into 4 subtasks', time: '2m ago' },
  { icon: Code, color: 'text-cyan-400', label: 'Coding Agent wrote FastAPI endpoints', time: '8m ago' },
  { icon: Search, color: 'text-purple-400', label: 'Research Agent indexed 15 documents', time: '15m ago' },
  { icon: GitBranch, color: 'text-emerald-400', label: 'GitHub repository synced successfully', time: '22m ago' },
  { icon: Brain, color: 'text-pink-400', label: 'Memory Agent updated project context', time: '35m ago' },
  { icon: Rocket, color: 'text-amber-400', label: 'Deployment Agent pushed to Render', time: '1h ago' },
];

export function ActivityFeed() {
  return (
    <ul className="space-y-3">
      {events.map((e, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-start gap-3"
        >
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5">
            <e.icon className={`h-3 w-3 ${e.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-relaxed">{e.label}</p>
            <p className="mt-0.5 text-[10px] text-[#6E6E7A]">{e.time}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
