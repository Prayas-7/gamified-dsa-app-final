'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../../../lib/axios';
import clsx from 'clsx';

interface LeaderboardUser {
  _id: string;
  username: string;
  xp: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/game/leaderboard');
        setLeaderboardData(res.data);
      } catch (err) {
        console.error("Leaderboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Calculating Rankings...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:p-8 text-foreground transition-colors duration-300">
      
      {/* Header Container */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2 text-base sm:text-lg">Top learners this week</p>
      </div>

      {/* The List Table Card */}
      <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-xl transition-colors duration-300">
        
        {/* Table Header Row - Hidden on very small screens to save vertical space */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-5 border-b border-border bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-7">User</div>
          <div className="col-span-3 text-right">XP Points</div>
        </div>

        {/* Dynamic Leaderboard Rows */}
        <div className="divide-y divide-border">
          {leaderboardData.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="grid grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 items-center hover:bg-muted/40 transition-colors group"
            >
              {/* Rank Badge */}
              <div className="col-span-2 flex justify-center">
                <div className={clsx(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-transform group-hover:scale-110",
                  index === 0 ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : 
                  index === 1 ? "bg-slate-400 text-white" :
                  index === 2 ? "bg-orange-400 text-white" :
                  "bg-muted text-muted-foreground border border-border"
                )}>
                  {index + 1}
                </div>
              </div>

              {/* User Avatar & Info */}
              <div className="col-span-7 sm:col-span-7 flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-100 dark:bg-white/5 border border-border flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                </div>
                <div className="font-bold text-sm sm:text-lg truncate pr-2">
                  {user.username}
                </div>
              </div>

              {/* XP Score Display */}
              <div className="col-span-3 text-right font-mono font-bold text-sm sm:text-lg">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {user.xp.toLocaleString()}
                </span>
                <span className="hidden xs:inline ml-1 text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-tighter">
                  xp
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}