'use client';
import { useEffect, useRef } from 'react';
import { useUserStore } from '../../store/useStore';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function GameSync() {
  const { level } = useUserStore();
  // Using a Ref to track the "previous" level across renders
  const prevLevel = useRef<number | null>(null);

  useEffect(() => {
    // 1. On first load, just set the current level and do nothing
    if (prevLevel.current === null) {
      prevLevel.current = level;
      return;
    }

    // 2. Only trigger if the level actually increased
    if (level > prevLevel.current) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });

      toast.success(`🎉 LEVEL UP!`, {
        description: `You've reached Level ${level}. Keep it up!`,
        duration: 5000,
      });

      // Update the ref so it doesn't trigger again until the next level up
      prevLevel.current = level;
    }
  }, [level]);

  return null; 
}