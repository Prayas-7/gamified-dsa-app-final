'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { PuzzleStage } from '../../types/game';
import { toast } from 'sonner';
import { RotateCcw, ArrowDown, Search } from 'lucide-react';

interface BSNode {
  id: string;
  value: number;
  status: 'idle' | 'eliminated' | 'found';
}

export default function BinarySearchPuzzle({ data }: { data: PuzzleStage }) {
  const { nextStage } = useLevelStore();
  
  const initialNodes: BSNode[] = useMemo(() => {
    return (data.initialState || []).map((val, i) => ({
      id: `bs-${i}`,
      value: val as number,
      status: 'idle',
    }));
  }, [data.initialState]);

  const [nodes, setNodes] = useState<BSNode[]>(initialNodes);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(initialNodes.length - 1);
  const [isSolved, setIsSolved] = useState(false);

  const target = Number(data.targetValue);
  const mid = Math.floor((low + high) / 2);
  const maxValue = Math.max(...initialNodes.map(n => n.value));

  const handleNodeClick = (index: number) => {
    if (isSolved) return;
    if (index < low || index > high) return;
    if (index !== mid) {
      toast.info('Binary Search Rule', { description: `Calculate mid: (${low} + ${high}) / 2 = ${mid}` });
      return;
    }

    const clickedValue = nodes[index].value;
    if (clickedValue === target) {
      setNodes(prev => prev.map((n, i) => i === index ? { ...n, status: 'found' } : n));
      setIsSolved(true);
      toast.success('🎯 Target Found!');
      setTimeout(nextStage, 2000);
    } else if (clickedValue < target) {
      setNodes(prev => prev.map((n, i) => i <= index ? { ...n, status: 'eliminated' } : n));
      setLow(index + 1);
    } else {
      setNodes(prev => prev.map((n, i) => i >= index ? { ...n, status: 'eliminated' } : n));
      setHigh(index - 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 sm:p-8 text-foreground">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Search className="text-indigo-500 w-5 h-5 sm:w-8 sm:h-8" /> {data.instruction}
        </h2>
        <p className="text-muted font-mono tracking-widest uppercase text-[10px] sm:text-sm">Target: {target}</p>
      </div>

      {/* RESPONSIVE BAR CHART AREA */}
      <div className="relative w-full h-64 sm:h-80 flex items-end justify-center gap-1 sm:gap-3 px-2 sm:px-4 border-b border-border pb-4">
        {nodes.map((node, i) => {
          const heightPercent = (node.value / maxValue) * 100;
          const isMid = i === mid && !isSolved;
          const isActive = i >= low && i <= high;

          return (
            <div key={node.id} className="flex-1 flex flex-col items-center relative h-full justify-end">
              <AnimatePresence>
                {isMid && (
                  <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -top-6 text-indigo-500 flex flex-col items-center">
                    <span className="text-[9px] font-bold hidden sm:block">MID</span>
                    <ArrowDown className="w-3 h-3 sm:w-5 sm:h-5 animate-bounce" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => handleNodeClick(i)}
                animate={{
                  height: `${heightPercent}%`,
                  opacity: isActive ? 1 : 0.2,
                  backgroundColor: node.status === 'found' ? '#10b981' : isMid ? '#6366f1' : 'var(--muted)'
                }}
                className="w-full rounded-t-sm sm:rounded-t-lg transition-all"
              >
                <div className={`hidden sm:block font-bold text-xs ${isMid || node.status === 'found' ? 'text-white' : ''}`}>
                  {node.value}
                </div>
              </motion.button>
              
              <span className="mt-2 text-[8px] sm:text-[10px] font-mono text-muted">{i}</span>
            </div>
          );
        })}
      </div>

      {/* CONTROLS */}
      <div className="mt-8 sm:mt-12 flex flex-col items-center gap-6 w-full">
        <div className="flex items-center gap-2 sm:gap-8 bg-card border border-border p-3 sm:p-4 rounded-2xl w-full max-w-md justify-center">
          {[
            { label: 'Low', val: low },
            { label: 'Mid', val: mid },
            { label: 'High', val: high }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center px-2 sm:px-4">
              <span className="text-[9px] text-muted uppercase font-bold">{item.label}</span>
              <span className="text-lg sm:text-xl font-mono">{item.val}</span>
            </div>
          ))}
        </div>
        
        <button onClick={() => { setLow(0); setHigh(initialNodes.length - 1); setNodes(initialNodes); setIsSolved(false); }}
          className="flex items-center gap-2 text-xs sm:text-sm text-muted hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" /> Reset Logic
        </button>
      </div>
    </div>
  );
}