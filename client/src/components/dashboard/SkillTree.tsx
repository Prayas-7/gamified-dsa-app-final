'use client';
import { motion } from 'framer-motion';
import { Lock, Check, Zap, Play } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '../../store/useStore';
import { useEffect, useState } from 'react';

const levels = [
  { id: 'arrays', title: 'Arrays Intro', x: 0, type: 'normal' },
  { id: 'linear-search', title: 'Linear Search', x: -50, type: 'normal' },
  { id: 'binary-search', title: 'Binary Search', x: 50, type: 'normal' },
  { id: 'bubble-sort', title: 'Bubble Sort', x: 0, type: 'boss' }, 
  { id: 'selection-sort', title: 'Selection Sort', x: -50, type: 'normal' },
  { id: 'linked-lists', title: 'Linked Lists', x: 50, type: 'boss' }, 
  { id: 'stacks', title: 'Stacks & Queues', x: 0, type: 'boss' },     
  { id: 'hash-tables', title: 'Hash Tables', x: -50, type: 'normal' },
  { id: 'trees', title: 'Trees & BST', x: 50, type: 'normal' },
  { id: 'graphs', title: 'Graph Theory', x: 0, type: 'boss' },
];

export default function SkillTree() {
  const { completedLevels } = useUserStore();
  const [isMobile, setIsMobile] = useState(false);

  // Safely check for mobile screens to dampen horizontal offsets
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col-reverse items-center gap-24 py-16 relative min-h-250 justify-end pb-40 px-4">
      
      {/* Connecting Line - Theme Adaptive */}
      <div className="absolute top-10 bottom-20 w-2 bg-linear-to-b from-transparent via-slate-300 dark:via-indigo-500/20 to-transparent rounded-full -z-10" />

      {levels.map((level, index) => {
        const isCompleted = completedLevels.includes(level.id);
        const previousLevelId = index > 0 ? levels[index - 1].id : null;
        const isLocked = index > 0 && previousLevelId && !completedLevels.includes(previousLevelId);
        const isNext = !isLocked && !isCompleted;

        // Dampen horizontal translation on mobile screens to protect overflow boundaries
        const responsiveX = isMobile ? level.x * 0.5 : level.x;

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="relative flex justify-center w-full"
            style={{ x: responsiveX }}
          >
            <Link 
              href={isLocked ? '#' : `/play/${level.id}`}
              className={`
                relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-b-8 transition-all duration-300 z-10 group
                ${isCompleted ? 'bg-emerald-500 border-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.3)] dark:shadow-[0_0_30px_rgba(16,185,129,0.4)]' : ''}
                ${isNext ? 'bg-indigo-600 border-indigo-800 shadow-[0_0_30px_rgba(79,70,229,0.4)] dark:shadow-[0_0_40px_rgba(79,70,229,0.6)] scale-110' : ''}
                ${isLocked ? 'bg-slate-200 border-slate-300 dark:bg-zinc-800 dark:border-zinc-900 cursor-not-allowed opacity-60' : ''}
              `}
            >
              {isCompleted ? (
                <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-3" />
              ) : isLocked ? (
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-zinc-500" />
              ) : level.type === 'boss' ? (
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-yellow-400 animate-pulse" />
              ) : (
                <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-white ml-1" />
              )}
            </Link>
            
            {/* Titles & Badges */}
            <div className={`absolute ${index === 0 ? '-bottom-16' : 'top-28 sm:top-32'} left-1/2 -translate-x-1/2 whitespace-nowrap z-20 flex flex-col items-center gap-1.5`}>
              {isNext && (
                <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full tracking-wider animate-bounce shadow-sm">
                  NEXT UP
                </span>
              )}
              <span className={`
                text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border backdrop-blur-md transition-colors shadow-sm
                ${isLocked 
                  ? 'text-slate-400 bg-slate-100/90 border-slate-200 dark:text-zinc-500 dark:bg-black/40 dark:border-zinc-800' 
                  : isNext 
                    ? 'text-white bg-indigo-900/90 border-indigo-500 dark:bg-indigo-950/90' 
                    : 'text-slate-800 bg-white/90 border-slate-200 dark:text-white dark:bg-zinc-900/80 dark:border-zinc-700'
                }
              `}>
                {level.title}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}