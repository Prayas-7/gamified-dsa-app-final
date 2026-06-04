'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { PuzzleStage } from '../../types/game';
import { toast } from 'sonner';
import { Hash, Archive, ArrowRight, CornerRightDown } from 'lucide-react';

export default function HashPuzzle({ data }: { data: PuzzleStage }) {
  const { nextStage, loseHeart } = useLevelStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const modulo = 5;
  const keyToHash = useMemo(() => (data.targetValue === 3 ? 13 : 17), [data.targetValue]);

  const handleBucketClick = (index: number) => {
    if (isSuccess) return;
    if (index === data.targetValue) {
      setIsSuccess(true);
      toast.success('Perfect Mapping!', { description: `${keyToHash} % ${modulo} = ${index}` });
      setTimeout(nextStage, 2000);
    } else {
      toast.error('Mapping Error!', { description: `Index = Key % ${modulo}` });
      loseHeart();
    }
  };

  if (!mounted) return <div className="min-h-[60vh] w-full" />;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 sm:p-6 text-foreground">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 space-y-2">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{data.instruction}</h2>
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">Index = Key % {modulo}</p>
        </div>
      </div>

      {/* Visualization Flow */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 sm:gap-8 mb-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-indigo-500/30 flex items-center justify-center bg-card shadow-inner">
            <span className="text-2xl sm:text-3xl font-black text-indigo-500">{keyToHash}</span>
          </div>
          <span className="text-[9px] font-black text-muted uppercase">Input Key</span>
        </div>

        <ArrowRight size={24} className="text-muted rotate-90 md:rotate-0" />

        <div className="p-4 sm:p-6 bg-card border-2 border-border rounded-2xl shadow-lg flex items-center gap-4">
          <Hash size={32} className="text-indigo-500" />
          <div className="text-left">
            <p className="text-[10px] text-muted font-mono font-bold">{keyToHash} MOD {modulo}</p>
            <p className="text-lg font-black">Process</p>
          </div>
        </div>

        <CornerRightDown size={32} className="text-indigo-500 animate-bounce mt-4 md:mt-0" />
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 w-full max-w-xl border-t border-border pt-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.button
            key={i}
            onClick={() => handleBucketClick(i)}
            whileHover={{ y: -4 }}
            className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
              isSuccess && i === data.targetValue 
                ? 'border-emerald-500 bg-emerald-500/10' 
                : 'border-border bg-card hover:border-indigo-500'
            }`}
          >
            <Archive className={isSuccess && i === data.targetValue ? 'text-emerald-500' : 'text-muted'} size={24} />
            <span className="text-[9px] font-mono font-black text-muted mt-2">Idx {i}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}