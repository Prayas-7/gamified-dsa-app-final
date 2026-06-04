'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { PuzzleStage } from '../../types/game';
import { toast } from 'sonner';
import { RotateCcw, Target } from 'lucide-react';

export default function SelectionSortPuzzle({ 
  data, 
  onComplete 
}: { 
  data: PuzzleStage; 
  onComplete?: () => void 
}) {
  const { nextStage } = useLevelStore();

  // Unified completion handler: Priority to Challenge Mode (onComplete), 
  // otherwise fallback to Story Mode (nextStage).
  const handleFinish = useCallback(() => {
    if (onComplete) {
      onComplete();
    } else {
      nextStage();
    }
  }, [onComplete, nextStage]);

  const [items, setItems] = useState<number[]>(data.initialState as number[]);
  const [sortedIndex, setSortedIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const maxValue = Math.max(...items);
  const isSorted = items.every((val, i) => i === 0 || items[i - 1] <= val);

  useEffect(() => {
    if (isSorted) {
      toast.success('Selection Sort Complete!', { icon: '🏆' });
      // Use our unified handler
      setTimeout(handleFinish, 2000);
    }
  }, [isSorted, handleFinish]);

  const handleSelect = (index: number) => {
    if (isSorted || index < sortedIndex) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const i = selectedIndex;
      const j = index;

      // Rule: In Selection Sort, one of the two selected items must be 
      // the target position we are currently trying to fill (the sortedIndex).
      if (i !== sortedIndex && j !== sortedIndex) {
        toast.error('Selection Rule', { description: `One selection must be index ${sortedIndex}.` });
        setSelectedIndex(null);
        return;
      }

      // Identify which index is the "candidate" to be the minimum
      const candidateIdx = i === sortedIndex ? j : i;
      const unsortedPart = items.slice(sortedIndex);
      const actualMin = Math.min(...unsortedPart);

      // Verify if the user actually picked the smallest value in the remaining list
      if (items[candidateIdx] !== actualMin) {
        toast.error('Not the Minimum!', { description: `Smallest is ${actualMin}.` });
      } else {
        const newItems = [...items];
        [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
        setItems(newItems);
        setSortedIndex(prev => prev + 1);
        toast.success('Correct Swap!');
      }
      setSelectedIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 md:p-8 text-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-extrabold mb-2">Selection Sort</h2>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
          Find the minimum in the unsorted part and swap to index {sortedIndex}
        </p>
      </div>

      <div className="flex items-end justify-center gap-2 md:gap-4 h-48 md:h-64 w-full border-b border-white/10 pb-4 mb-10 overflow-hidden">
        {items.map((value, i) => {
          const heightPercent = (value / maxValue) * 100;
          const isSortedPart = i < sortedIndex;
          const isTarget = i === sortedIndex;

          return (
            <div key={`${i}-${value}`} className="flex-[1_1_0] flex flex-col items-center h-full justify-end relative">
              {isTarget && !isSorted && (
                <motion.div layoutId="target-ptr" className="absolute -top-8 text-indigo-400">
                  <Target size={18} className="animate-pulse" />
                </motion.div>
              )}

              <motion.button
                layout
                onClick={() => handleSelect(i)}
                animate={{
                  height: `${heightPercent}%`,
                  backgroundColor: isSortedPart ? '#059669' : selectedIndex === i ? '#6366f1' : isTarget ? '#312e81' : '#1e293b',
                }}
                className={`w-full max-w-12.5 rounded-t-md border-2 transition-all shadow-lg ${
                  selectedIndex === i ? 'border-indigo-400 shadow-indigo-500/20' : 'border-transparent'
                }`}
              >
                <span className="hidden md:block absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-black">
                  {value}
                </span>
              </motion.button>
              <span className={`mt-3 text-[10px] font-black uppercase ${isTarget ? 'text-indigo-400' : 'text-gray-600'}`}>
                {isTarget ? 'Target' : `Idx ${i}`}
              </span>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => { setItems(data.initialState as number[]); setSortedIndex(0); setSelectedIndex(null); }}
        className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs md:text-sm font-bold hover:bg-white/10 transition-colors"
      >
        <RotateCcw size={16}/> Reset Logic
      </button>
    </div>
  );
}