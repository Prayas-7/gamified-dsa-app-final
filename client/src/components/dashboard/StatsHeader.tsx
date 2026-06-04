'use client';

import { Heart, Zap, Flame, Crown } from 'lucide-react';
import { useUserStore } from '../../store/useStore';
import { useLevelStore } from '../../store/levelStore';

export default function StatsHeader() {
  const { xp, level } = useUserStore();
  const { hearts } = useLevelStore();

  return (
    <div className="flex items-center gap-3 md:gap-6 px-4 py-2 md:px-6 md:py-3 rounded-full backdrop-blur-md shadow-lg transition-all
      /* Light Mode: Slight dark tint so it stands out on white */
      bg-black/3 border-black/10 
      /* Dark Mode: Slight white tint for depth */
      dark:bg-white/5 dark:border-white/10 
      border"
    >
      
      {/* LEVEL - Hidden on very small screens, shown from 'sm' up */}
      <div className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold sm:border-r border-black/10 dark:border-white/10 sm:pr-4 md:pr-6">
        <Crown className="w-4 h-4 md:w-5 md:h-5 fill-indigo-600/10 dark:fill-indigo-400/20" />
        <span className="text-sm md:text-base">Lvl {level}</span>
      </div>

      {/* HEARTS */}
      <div className="flex items-center gap-1.5 md:gap-2 text-rose-500 font-bold">
        <Heart className="w-4 h-4 md:w-5 md:h-5 fill-rose-500" />
        <span className="text-sm md:text-base">{hearts}</span>
      </div>
      
      {/* XP */}
      <div className="flex items-center gap-1.5 md:gap-2 text-amber-500 dark:text-yellow-500 font-bold">
        <Zap className="w-4 h-4 md:w-5 md:h-5 fill-amber-500 dark:fill-yellow-500" />
        <span className="text-sm md:text-base">{xp} <span className="hidden xs:inline">XP</span></span>
      </div>
      
      {/* STREAK */}
      <div className="flex items-center gap-1.5 md:gap-2 text-orange-500 font-bold">
        <Flame className="w-4 h-4 md:w-5 md:h-5 fill-orange-500" />
        <span className="text-sm md:text-base">1</span>
      </div>
    </div>
  );
}