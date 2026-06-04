'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { PuzzleStage } from '../../types/game';
import { toast } from 'sonner';
import { ArrowUp, ArrowRight, RotateCcw, LayoutList } from 'lucide-react';

type PuzzleItem = NonNullable<PuzzleStage['initialState']>[number];

const getVal = (item: PuzzleItem) => (typeof item === 'object' ? item.value : item);

export default function StackQueuePuzzle({ data, onComplete }: { data: PuzzleStage, onComplete?: () => void }) {
  // Use either the passed onComplete (for challenges) or the store's nextStage (for story)
  const { nextStage } = useLevelStore();
  const handleFinish = onComplete || nextStage;

  const [container, setContainer] = useState<PuzzleItem[]>([]);
  const [bank, setBank] = useState<PuzzleItem[]>(data.initialState || []);
  const [isSolved, setIsSolved] = useState(false);

  // Determine mode from data.type or currentTopic logic
  const isQueue = (data).type === 'queue' || data.instruction.toLowerCase().includes('queue');

  const handleAdd = (item: PuzzleItem, index: number) => {
    if (isSolved) return;
    
    // Logic: In both Stack and Queue, we add items sequentially.
    // For a stack: Push to top. For a queue: Enqueue to back.
    const currentSize = container.length;
    if (data.targetState && getVal(item) !== getVal(data.targetState[currentSize])) {
      toast.error("Incorrect order!", { icon: '⚠️' });
      return; 
    }

    const newContainer = [...container, item];
    setContainer(newContainer);
    
    const newBank = [...bank];
    newBank.splice(index, 1);
    setBank(newBank);
    
    checkSolution(newContainer);
  };

  const handleRemove = () => {
    if (container.length === 0 || isSolved) return;
    
    const newContainer = [...container];
    let removedItem: PuzzleItem | undefined;

    if (isQueue) {
      // FIFO: Remove from the front (index 0)
      removedItem = newContainer.shift();
    } else {
      // LIFO: Remove from the top (last index)
      removedItem = newContainer.pop();
    }

    setContainer(newContainer);
    if (removedItem) setBank([...bank, removedItem]);
  };

  const checkSolution = (current: PuzzleItem[]) => {
    if (!data.targetState) return;
    if (current.length !== data.targetState.length) return;

    const currentValues = current.map(getVal);
    const targetValues = data.targetState.map(getVal);
    
    if (JSON.stringify(currentValues) === JSON.stringify(targetValues)) {
      setIsSolved(true);
      toast.success(`${isQueue ? 'Queue' : 'Stack'} Match!`, { icon: '✅' });
      setTimeout(handleFinish, 1500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold">{data.instruction}</h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold">
            <LayoutList size={16} />
            <span className="text-sm uppercase tracking-widest">
                {isQueue ? "First In, First Out (FIFO)" : "Last In, First Out (LIFO)"}
            </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
        {/* Item Bank */}
        <div className="w-full md:w-1/3 p-4 bg-card rounded-2xl border border-border shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4 text-center">Available Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence>
              {bank.map((item, index) => (
                <motion.button 
                  key={`${getVal(item)}-${index}`} 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => handleAdd(item, index)}
                  className="h-12 bg-background border rounded-lg font-bold hover:border-indigo-500 hover:text-indigo-500 transition-all active:scale-95 shadow-sm"
                >
                  {getVal(item)}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Visual Container */}
        <div className="flex flex-col items-center">
          <button 
            onClick={handleRemove} 
            disabled={container.length === 0} 
            className={`mb-4 p-4 rounded-full transition-colors ${isQueue ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'} disabled:opacity-20`}
            title={isQueue ? "Dequeue (Front)" : "Pop (Top)"}
          >
            {isQueue ? <ArrowRight size={24} /> : <ArrowUp size={24} />}
          </button>
          
          {/* We use flex-col-reverse for stack, and flex-col for Queue visualization if you prefer */}
          <div className={`w-36 h-72 border-b-4 border-l-4 border-r-4 border-muted rounded-b-xl bg-card/30 flex ${isQueue ? 'flex-col' : 'flex-col-reverse'} items-center p-3 gap-2 overflow-hidden shadow-inner relative`}>
             <AnimatePresence>
                {container.map((item, index) => (
                  <motion.div 
                    key={`${getVal(item)}-${index}`}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ x: isQueue ? 100 : 0, y: isQueue ? 0 : -100, opacity: 0 }}
                    className={`w-full min-h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-lg ${isQueue ? 'bg-amber-600' : 'bg-indigo-600'}`}
                  >
                    {getVal(item)}
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
          <span className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {isQueue ? "Front of Queue" : "Stack Top"}
          </span>
        </div>
      </div>

      <button 
        onClick={() => { setBank([...(data.initialState || [])]); setContainer([]); setIsSolved(false); }}
        className="flex items-center gap-2 px-6 py-2 rounded-full border border-border hover:bg-muted font-bold text-sm transition-all"
      >
        <RotateCcw size={16} /> Reset Logic
      </button>
    </div>
  );
}