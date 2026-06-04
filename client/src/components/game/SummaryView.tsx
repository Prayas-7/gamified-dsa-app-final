'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { SummaryStage } from '../../types/game';
import { Trophy, ArrowRight } from 'lucide-react';
import { useUserStore } from '../../store/useStore';
import api from '../../lib/axios';
import confetti from 'canvas-confetti';
import LevelUpModal from './levelUp';

export default function SummaryView({ data }: { data: SummaryStage }) {
  const router = useRouter();
  const params = useParams();
  const { updateProgress } = useUserStore();
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const hasSaved = useRef(false); 

  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;

    const topicId = Array.isArray(params.topic) ? params.topic[0] : params.topic;
    if (!topicId) return;

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    const saveProgress = async () => {
      try {
        updateProgress(data.xpReward, topicId);
        const res = await api.post('/game/progress', {
             levelId: topicId,
             xpEarned: data.xpReward
        });
        
        if (res.data.hasLeveledUp) {
            setNewLevel(res.data.level);
            setTimeout(() => setShowLevelUp(true), 1000); 
        }
      } catch (error) {
        console.error("Save failed", error);
      }
    };

    saveProgress();
  }, [data.xpReward, params.topic, updateProgress]);

  return (
    <>
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal newLevel={newLevel} onClose={() => setShowLevelUp(false)} />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        {/* Trophy Icon */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-24 h-24 md:w-32 md:h-32 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-amber-500/30"
        >
          <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-600" />
        </motion.div>

        {/* Victory Text */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-linear-to-r from-amber-600 to-orange-500">
          Level Complete!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          You earned <strong className="text-foreground font-bold">{data.xpReward} XP</strong>.
        </p>

        {/* Navigation */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95"
        >
          Return to Map <ArrowRight size={20} />
        </button>
      </div>
    </>
  );
}