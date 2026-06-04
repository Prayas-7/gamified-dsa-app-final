'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

export default function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const end = Date.now() + 1000;
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#eab308'];

    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        className="relative bg-card border border-border p-6 sm:p-10 md:p-12 rounded-[2.5rem] text-center shadow-2xl max-w-sm sm:max-w-md w-full"
      >
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10 rounded-[2.5rem]" />

        {/* Crown Icon */}
        <motion.div
          initial={{ rotate: -90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-tr from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl"
        >
          <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </motion.div>

        {/* Text Section */}
        <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter mb-2">
          LEVEL{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
            UP!
          </span>
        </h2>

        <div className="text-lg sm:text-xl text-muted-foreground font-medium mb-8">
          Rank: <span className="text-foreground font-bold text-2xl sm:text-3xl tabular-nums">{newLevel}</span>
        </div>

        {/* Button */}
        <motion.button
          onClick={onClose}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Star className="w-5 h-5 fill-current" />
          Continue Journey
        </motion.button>
      </motion.div>
    </motion.div>
  );
}