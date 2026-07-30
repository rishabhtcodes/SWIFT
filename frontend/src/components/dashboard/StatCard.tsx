import { motion, AnimatePresence } from 'framer-motion';
import { type ElementType } from 'react';

interface StatCardProps {
  icon: ElementType;
  label: string;
  value: string;
  trend: string;
  accent: 'amber' | 'warm';
}

export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  const isPositive = trend.startsWith('+');
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
          <Icon className="h-4 w-4 text-amber-400" />
        </div>
        {trend !== '0' && (
          <span className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="mt-0.5 text-xs text-[#6E6E7A]">{label}</div>
      </div>
    </motion.div>
  );
}
