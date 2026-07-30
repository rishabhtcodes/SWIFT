import { motion } from 'framer-motion';

const nodes = [
  { id: 'ceo', label: 'CEO', x: 50, y: 50, active: true },
  { id: 'planner', label: 'Planner', x: 20, y: 75, active: true },
  { id: 'coding', label: 'Coding', x: 80, y: 75, active: true },
  { id: 'research', label: 'Research', x: 35, y: 90, active: false },
  { id: 'memory', label: 'Memory', x: 65, y: 90, active: true },
];

const edges = [
  ['ceo', 'planner'], ['ceo', 'coding'], ['planner', 'research'], ['coding', 'memory'],
];

function getPos(id: string) {
  const n = nodes.find(n => n.id === id);
  return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
}

export function AgentGraphMini() {
  return (
    <div className="h-48 w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* Edges */}
        {edges.map(([from, to]) => {
          const f = getPos(from); const t = getPos(to);
          return (
            <line key={`${from}-${to}`} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
              stroke="rgba(245,165,36,0.2)" strokeWidth="0.5" strokeDasharray="2 1" />
          );
        })}
        {/* Nodes */}
        {nodes.map((n) => (
          <g key={n.id}>
            <motion.circle
              cx={n.x} cy={n.y} r={7}
              fill={n.active ? 'rgba(245,165,36,0.15)' : 'rgba(255,255,255,0.04)'}
              stroke={n.active ? '#F5A524' : 'rgba(255,255,255,0.1)'}
              strokeWidth={0.8}
              animate={n.active ? { r: [7, 7.5, 7] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x={n.x} y={n.y + 0.8} textAnchor="middle" dominantBaseline="middle"
              fontSize="3.5" fill={n.active ? '#F5A524' : '#6E6E7A'} fontWeight="500">
              {n.label}
            </text>
            {n.active && (
              <circle cx={n.x + 6} cy={n.y - 6} r={1.5} fill="#10B981" />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
