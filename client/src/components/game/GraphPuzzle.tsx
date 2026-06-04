'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { LevelStage } from '../../types/game';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';

interface GraphNode {
  id: string;
  value: string;
  x: number;
  y: number;
  neighbors: string[];
}

type GraphStage = LevelStage & {
  type: 'graph';
  initialState: GraphNode[];
  targetState: string[];
  instruction: string;
};

export default function GraphPuzzle({ data, onComplete }: { data: LevelStage; onComplete?: () => void }) {
  const { nextStage } = useLevelStore();
  const handleFinish = onComplete || nextStage;

  const [visited, setVisited] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  if (data.type !== 'graph') return null;

  const graphData = data as GraphStage;
  const nodes: GraphNode[] = graphData.initialState ?? [];
  const targetState = graphData.targetState ?? [];

  const handleNodeClick = (nodeId: string) => {
    if (isSolved || visited.includes(nodeId)) return;

    const expected = targetState[visited.length];

    if (nodeId === expected) {
      const updated = [...visited, nodeId];
      setVisited(updated);

      if (updated.length === targetState.length) {
        setIsSolved(true);
        toast.success('Traversal Complete!', { icon: '🏆' });
        setTimeout(() => handleFinish?.(), 1200);
      }
    } else {
      toast.error('Wrong path!', { description: 'Follow the correct traversal order.' });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-4xl font-extrabold mb-2">{(data).instruction}</h2>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
          Path: {visited.join(' → ') || 'Select Start Node'}
        </p>
      </div>

      <div className="relative w-full aspect-video bg-card/30 rounded-3xl border-2 border-dashed border-border overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map((node) =>
            node.neighbors.map((neighborId) => {
              const targetNode = nodes.find((n) => n.id === neighborId);
              if (!targetNode || node.id > neighborId) return null;

              const active = visited.includes(node.id) && visited.includes(neighborId);

              return (
                <motion.line
                  key={`${node.id}-${neighborId}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${targetNode.x}%`}
                  y2={`${targetNode.y}%`}
                  stroke={active ? '#6366f1' : '#334155'}
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              );
            })
          )}
        </svg>

        {nodes.map((node) => (
          <motion.button
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-xl z-10 transition-all
              ${visited.includes(node.id) ? 'bg-indigo-600 scale-110 shadow-indigo-500/50' : 'bg-slate-800 border-2 border-slate-700 hover:border-indigo-400'}`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            {node.value}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => { setVisited([]); setIsSolved(false); }}
        className="mt-8 flex items-center gap-2 px-6 py-2 rounded-full border border-border hover:bg-muted font-bold text-sm"
      >
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  );
}