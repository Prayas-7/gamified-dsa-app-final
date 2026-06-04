'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
// 1. Import the actual type from your store file
import { useUserStore } from '../../../store/useStore'; 
import type { UserState } from '../../../store/useStore'; 
import { Award, Lock, Star, Shield, Zap, Trophy, Swords, Flame } from 'lucide-react';

// 2. Use the imported UserState for the badge check
interface Badge {
  id: number;
  name: string;
  icon: ReactNode;
  desc: string;
  check: (state: UserState) => boolean;
}

const BADGES: Badge[] = [
  { 
    id: 1, 
    name: "Data Apprentice", 
    icon: <Zap />, 
    desc: "Began the journey into DSA.",
    check: (state) => state.level >= 1 
  },
  { 
    id: 2, 
    name: "Array Master", 
    icon: <Shield />, 
    desc: "Mastered basic linear structures.",
    check: (state) => state.completedLevels.includes('arrays') 
  },
  { 
    id: 3, 
    name: "XP Grinder", 
    icon: <Flame />, 
    desc: "Earned over 500 total XP.",
    // Changed from streak (missing in store) to XP
    check: (state) => state.xp >= 500 
  },
  { 
    id: 4, 
    name: "Challenge Seeker", 
    icon: <Swords />, 
    desc: "Completed your first daily challenge.",
    check: (state) => state.completedLevels.includes('daily-challenge-1') 
  },
  { 
    id: 5, 
    name: "Logic Knight", 
    icon: <Award />, 
    desc: "Reached the Level 5 milestone.",
    check: (state) => state.level >= 5 
  },
  { 
    id: 6, 
    name: "Stack Architect", 
    icon: <Star />, 
    desc: "Deep understanding of LIFO structures.",
    check: (state) => state.completedLevels.includes('stack') 
  },
  { 
    id: 7, 
    name: "DSA Veteran", 
    icon: <Trophy />, 
    desc: "Mastered all core data structures.",
    check: (state) => state.level >= 10 
  },
];

export default function AchievementsPage() {
  // Zustand hook is already typed if you created it with create<UserState>()
  const userState = useUserStore();

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Your Achievements</h1>
        <p className="text-muted-foreground">Unlock badges by completing topics, challenges, and leveling up.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES.map((badge) => {
          const isUnlocked = badge.check(userState);
          
          return (
            <motion.div 
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: badge.id * 0.05 }}
              whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
              className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isUnlocked 
                ? 'bg-card border-indigo-500/40 shadow-indigo-500/10 shadow-xl' 
                : 'bg-muted/40 border-border opacity-60 grayscale'
              }`}
            >
              {isUnlocked && (
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
              )}

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 ${
                isUnlocked ? 'bg-indigo-500/20 text-indigo-500 rotate-0' : 'bg-background text-muted-foreground'
              }`}>
                {isUnlocked ? badge.icon : <Lock className="w-6 h-6" />}
              </div>

              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                {badge.name}
                {isUnlocked && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3">{badge.desc}</p>
              
              {!isUnlocked && (
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground/20 w-1/3" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Locked
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}