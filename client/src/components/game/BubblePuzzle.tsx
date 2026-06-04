'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { PuzzleStage } from '../../types/game';
import { toast } from 'sonner';
import { RotateCcw, ArrowDown } from 'lucide-react';

export default function BubbleSortPuzzle({ data }: { data: PuzzleStage }) {
  const { nextStage } = useLevelStore();
  const [items, setItems] = useState<number[]>(data.initialState as number[]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPointer, setCurrentPointer] = useState(0);
  
  const maxValue = Math.max(...items);
  const isSorted = items.every((val, i) => i === 0 || items[i - 1] <= val);

  useEffect(() => {
    if (isSorted) {
      toast.success('Perfectly Sorted!', { icon: '✨' });
      setTimeout(nextStage, 2000);
    }
  }, [isSorted, nextStage]);

  const handleSwap = (index: number) => {
    if (isSorted) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const i = selectedIndex;
      const j = index;
      if (Math.abs(i - j) !== 1) {
        toast.error('Invalid Move', { description: 'Bubble Sort only compares adjacent elements!' });
        setSelectedIndex(null);
        return;
      }
      
      const leftIdx = Math.min(i, j);
      const rightIdx = Math.max(i, j);

      if (items[leftIdx] <= items[rightIdx]) {
        toast.error('Wrong Logic!', { description: `No swap needed for ${items[leftIdx]} and ${items[rightIdx]}` });
      } else {
        const newItems = [...items];
        [newItems[leftIdx], newItems[rightIdx]] = [newItems[rightIdx], newItems[leftIdx]];
        setItems(newItems);
        toast.success('Good swap!');
        setCurrentPointer((prev) => (prev + 1) % (items.length - 1));
      }
      setSelectedIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 sm:p-8 text-foreground transition-colors duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Bubble Sort Challenge</h2>
        <p className="text-muted text-xs sm:text-sm max-w-md mx-auto">
          Sort the numbers by swapping adjacent elements. Click on two bars to compare and swap if needed. Can you sort them all?
        </p>
      </div>

      {/* Responsive Bar Area */}
      <div className="flex items-end justify-center gap-1 sm:gap-4 h-48 sm:h-64 w-full border-b border-border pb-4 mb-8">
        {items.map((value, i) => {
          const heightPercent = (value / maxValue) * 100;
          const isComparing = i === currentPointer || i === currentPointer + 1;
          
          return (
            <div key={`${i}-${value}`} className="flex-1 flex flex-col items-center h-full justify-end relative">
              {isComparing && !isSorted && (
                <motion.div layoutId="pointer" className="absolute -top-10 text-indigo-500">
                  <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6 animate-bounce" />
                </motion.div>
              )}

              <motion.button
                layout
                onClick={() => handleSwap(i)}
                animate={{
                  height: `${heightPercent}%`,
                  backgroundColor: selectedIndex === i ? 'var(--indigo-600)' 
                                   : isSorted ? '#10b981' 
                                   : isComparing ? 'rgba(99, 102, 241, 0.2)' 
                                   : 'var(--border)'
                }}
                className={`w-full max-w-12.5 rounded-t-sm sm:rounded-t-lg transition-all ${selectedIndex === i ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <span className="hidden sm:block text-[10px] font-bold mt-1">{value}</span>
              </motion.button>
              <span className="mt-2 text-[8px] sm:text-[10px] text-muted font-mono">Idx {i}</span>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => { setItems(data.initialState as number[]); setCurrentPointer(0); }}
        className="flex items-center gap-2 px-6 py-2 bg-card border border-border rounded-full text-sm font-bold hover:bg-muted/20"
      >
        <RotateCcw size={16}/> Reset Step
      </button>
    </div>
  );
}