'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { PuzzleStage, Primitive } from '../../types/game';
import { toast } from 'sonner';
import { RotateCcw, Search } from 'lucide-react';

interface SearchNode {
  id: string;
  value: Primitive;
  isFound: boolean;
  isScanned: boolean;
}

export default function LinearSearchPuzzle({ data }: { data: PuzzleStage }) {
  const { nextStage } = useLevelStore();
  
  const initialNodes: SearchNode[] = useMemo(() => {
    return (data.initialState || []).map((item, i) => {
      const val = typeof item === 'object' && item !== null && 'value' in item 
        ? (item as { value: Primitive }).value : (item as Primitive);
      return { id: `node-${i}`, value: val, isFound: false, isScanned: false };
    });
  }, [data.initialState]);

  const [elements, setElements] = useState<SearchNode[]>(initialNodes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const targetValue = data.targetValue ?? data.correctAnswer ?? initialNodes[0]?.value;

  const handleNodeClick = (index: number) => {
    if (isSolved) return;
    if (index !== currentIndex) {
      toast.error('Linear Search Rule!', { description: `Check index ${currentIndex} first.` });
      return;
    }

    const clickedNode = elements[index];
    const isMatch = clickedNode.value === targetValue;

    setElements(prev => prev.map((node, i) => 
      i === index ? { ...node, isScanned: true, isFound: isMatch } : node
    ));

    if (isMatch) {
      setIsSolved(true);
      toast.success('Target Found!', { icon: '🎯' });
      setTimeout(nextStage, 1500);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4">{data.instruction}</h2>
        <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 font-mono text-sm">
          <Search size={16} /> Target: {String(targetValue)}
        </div>
      </div>

      {/* Responsive Array Area */}
      <div className="w-full overflow-x-auto pb-8 mb-4">
        <div className="flex gap-2 sm:gap-4 justify-center min-w-max px-4">
          {elements.map((node, index) => {
            const isCurrent = index === currentIndex && !isSolved;
            return (
              <motion.button
                key={node.id}
                onClick={() => handleNodeClick(index)}
                className={`w-16 h-24 sm:w-20 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  node.isFound ? 'border-emerald-500 bg-emerald-500/10' :
                  node.isScanned ? 'border-border bg-muted/30 opacity-50' :
                  isCurrent ? 'border-indigo-500 bg-indigo-500/10' : 'border-border bg-card'
                }`}
              >
                <span className="text-lg sm:text-xl font-bold font-mono">
                  {node.isScanned ? String(node.value) : '?'}
                </span>
                {isCurrent && (
                  <span className="text-[8px] sm:text-[10px] mt-2 font-bold uppercase tracking-widest text-indigo-500">Scan</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <button 
        onClick={() => { setCurrentIndex(0); setIsSolved(false); setElements(initialNodes); }} 
        className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm bg-card border border-border hover:bg-muted transition-all"
      >
        <RotateCcw size={14} /> Reset
      </button>
    </div>
  );
}