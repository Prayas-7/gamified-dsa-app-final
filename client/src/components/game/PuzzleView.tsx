'use client';

import { useState } from 'react';
import { Reorder, motion } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { PuzzleStage } from '../../types/game';
import { toast } from 'sonner';

type PuzzleItem = string | number | { value: string | number };

const isPrimitive = (item: PuzzleItem): item is string | number => 
  typeof item === 'string' || typeof item === 'number';

const getDisplayValue = (item: PuzzleItem): string | number => 
  isPrimitive(item) ? item : (item as { value: string | number }).value;

/**
 * SELECTION PUZZLE
 * Used when the user needs to click a specific index (e.g., "Find element at index 2")
 */
function SelectionPuzzle({ data, onComplete, onFail }: { data: PuzzleStage, onComplete: () => void, onFail: () => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleItemClick = (index: number) => {
    if (isSuccess || isWrong) return;
    setSelectedIndex(index);

    if (index === data.correctAnswer) {
      setIsSuccess(true);
      toast.success('Correct Index!', { icon: '🎉' });
      setTimeout(onComplete, 1000);
    } else {
      setIsWrong(true);
      toast.error(data.hint || 'Incorrect Index!', { icon: '💔' });
      onFail();
      setTimeout(() => { 
        setIsWrong(false); 
        setSelectedIndex(null); 
      }, 1000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 px-4">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center">{data.instruction}</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {data.initialState.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleItemClick(index)}
              className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                isSuccess && index === data.correctAnswer ? 'border-emerald-500 bg-emerald-500/20' :
                isWrong && selectedIndex === index ? 'border-red-500 bg-red-500/20' : 'border-border bg-card'
              }`}
            >
              {getDisplayValue(item)}
            </motion.button>
            <span className="text-[10px] font-mono text-muted-foreground uppercase text-center">Index {index}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * DRAGGABLE PUZZLE
 * Handles reordering tasks (Sorting, Reversing, etc.)
 */
function DraggablePuzzle({ data, onComplete, onFail }: { data: PuzzleStage, onComplete: () => void, onFail: () => void }) {
  const [items, setItems] = useState(data.initialState.map((item: PuzzleItem, index: number) => ({ 
    uniqueId: `drag-${index}`, 
    value: getDisplayValue(item) 
  })));
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCheck = () => {
    // 1. Convert current items to strings for safe comparison
    const currentValues = items.map(i => String(i.value));
    
    // 2. Determine the correct target sequence
    // Uses targetState (from Strapi) or correctAnswer, falling back to ascending sort
    const target = data.targetState || data.correctAnswer;
    const correctValues = Array.isArray(target) 
      ? target.map(val => String(val)) 
      : [...currentValues].sort((a, b) => Number(a) - Number(b));
    
    // 3. Comparison check
    if (JSON.stringify(currentValues) === JSON.stringify(correctValues)) {
      setStatus('success');
      toast.success('Correct Sequence!', { icon: '🎉' });
      setTimeout(onComplete, 1000);
    } else {
      setStatus('error');
      toast.error('Incorrect Order', { icon: '💔' });
      onFail();
      setTimeout(() => setStatus('idle'), 1500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 px-4">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center">{data.instruction}</h2>
      <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex gap-4 justify-center">
        {items.map((item) => (
          <Reorder.Item key={item.uniqueId} value={item}>
            <motion.div 
              layout
              className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold bg-card cursor-grab active:cursor-grabbing ${
                status === 'success' ? 'border-emerald-500 bg-emerald-500/10' : 
                status === 'error' ? 'border-red-500 bg-red-500/10' : 'border-border'
              }`}
            >
              {item.value}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button 
        onClick={handleCheck} 
        className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg ${
          status === 'success' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:scale-105 active:scale-95'
        }`}
      >
        Confirm Sequence
      </button>
    </div>
  );
}

/**
 * MAIN COMPONENT
 * Toggles between Selection and Draggable views
 */
export default function PuzzleView({ 
  data, 
  onComplete, 
  onFail 
}: { 
  data: PuzzleStage, 
  onComplete?: () => void, 
  onFail?: () => void 
}) {
  const { nextStage, loseHeart } = useLevelStore();

  const handleNext = onComplete || nextStage;
  const handleFail = onFail || loseHeart;

  // Selection puzzles have a single number as the correct answer (the index)
  const isSelectionPuzzle = typeof data.correctAnswer === 'number' && !Array.isArray(data.targetState);

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      {isSelectionPuzzle ? (
        <SelectionPuzzle data={data} onComplete={handleNext} onFail={handleFail} />
      ) : (
        <DraggablePuzzle data={data} onComplete={handleNext} onFail={handleFail} />
      )}
    </div>
  );
}