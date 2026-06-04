'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/useStore';
import { Flame, Trophy, BookOpen, Swords, ArrowRight, Zap, Loader2, Award } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ActivityItem { day: string; active: boolean; }
interface DashboardApiData {
  username: string;
  xp: number;
  level: number;
  completedLevels: string[];
  streak: number;
  nextTopic: string;
  activityGraph: ActivityItem[];
}

export default function HomeDashboard() {
  const { username, xp, level, setUser } = useUserStore();
  const router = useRouter(); 
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    streak: 0,
    nextTopic: '', 
    graph: [] as ActivityItem[], 
  });

  // Calculate Progress (Assuming 1000XP per level based on your backend logic)
  const progressToNext = useMemo(() => (xp % 1000) / 10, [xp]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/game/dashboard'); 
        if (res.status === 401) { 
          router.push('/login'); 
          return; 
        }
        if (!res.ok) throw new Error('API Failed');

        const data: DashboardApiData = await res.json();
        setUser({ 
          username: data.username, 
          xp: data.xp, 
          level: data.level, 
          completedLevels: data.completedLevels 
        });
        setDashboardData({ 
          streak: data.streak || 0, 
          nextTopic: data.nextTopic || 'arrays', 
          graph: data.activityGraph || [] 
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
        setDashboardData(prev => ({ ...prev, nextTopic: 'arrays' }));
      } finally { 
        setIsLoading(false); 
      }
    };

    fetchDashboard();
  }, [isMounted, setUser, router]);

  const displayUsername = useMemo(() => {
    if (!isMounted) return '...';
    return username || 'Apprentice';
  }, [isMounted, username]);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4 px-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase text-center">Syncing Progress...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-24 md:pb-12 w-full min-w-0 text-foreground transition-colors duration-300">

      {/* 1. TOP ROW: Stats Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-md transition-colors duration-300"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mb-3 border-4 border-card text-white shadow-sm">
            {displayUsername.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate max-w-full px-2">{displayUsername}</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-mono text-xs sm:text-sm font-semibold mb-2">Lvl {level || 1} Apprentice</p>
          
          {/* XP Progress Bar */}
          <div className="w-full h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
             <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${progressToNext}%` }} 
                className="h-full bg-indigo-500" 
             />
          </div>
          
          <div className="flex gap-3 sm:gap-4 w-full">
            <div className="flex-1 bg-slate-50 border border-slate-100 dark:bg-background/60 dark:border-border rounded-xl p-2.5 sm:p-3 text-center transition-colors duration-300">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-extrabold text-foreground">{dashboardData.streak}</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Streak</div>
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-100 dark:bg-background/60 dark:border-border rounded-xl p-2.5 sm:p-3 text-center transition-colors duration-300">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-yellow-500 mx-auto mb-1" />
              <div className="text-lg sm:text-xl font-extrabold text-foreground">{xp || 0}</div>
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-bold tracking-wide">XP</div>
            </div>
          </div>
        </motion.div>

        {/* Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-md w-full min-w-0 transition-colors duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Activity</h3>
              <p className="text-muted-foreground text-[10px] sm:text-xs font-medium">Last 7 Days</p>
            </div>
          </div>

          <div className="flex justify-between items-end h-24 sm:h-28 px-1 gap-1.5 overflow-hidden w-full">
            {dashboardData.graph.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                <div
                  className={`w-full max-w-3 sm:max-w-4 rounded-full transition-all duration-300 ${
                    item.active
                      ? 'h-16 sm:h-20 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.25)] dark:shadow-[0_0_14px_rgba(249,115,22,0.5)]'
                      : 'bg-slate-100 dark:bg-muted h-5 sm:h-6'
                  }`}
                />
                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold block truncate">
                  {item.day ? item.day.charAt(0) : ''}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-linear-to-br from-card to-indigo-500/2 dark:to-indigo-500/10 border border-border rounded-2xl p-5 sm:p-6 relative flex flex-col justify-between shadow-md transition-colors duration-300 col-span-1 sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute top-2 right-2 p-2 opacity-5 dark:opacity-15 pointer-events-none hidden sm:block">
            <Trophy className="w-24 h-24 lg:w-32 lg:h-32 text-indigo-600 dark:text-indigo-500" />
          </div>
          <div className="z-10 h-full flex flex-col justify-between items-start">
            <div>
              <h3 className="text-foreground font-bold text-base sm:text-lg mb-0.5">Leaderboard</h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-4 font-medium">Check your rank among peers</p>
            </div>
            <Link href="/dashboard/leaderboard" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 text-sm group mt-auto">
              View Leaderboard <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 2. MAIN BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 5 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        className="w-full bg-linear-to-br from-emerald-500/6 to-emerald-500/2 dark:from-emerald-950/40 dark:to-emerald-600/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm transition-colors duration-300"
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <h4 className="text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Up Next</h4>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground capitalize truncate">Continue: {dashboardData.nextTopic.replace('-', ' ')}</h2>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium">Keep your momentum high and unlock new badges.</p>
        </div>
        <Link href={`/play/${dashboardData.nextTopic}`} className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm shadow-sm">
          Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* 3. ACTION GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/dashboard/course" className="block group">
          <motion.div whileHover={{ y: -1 }} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-muted/30 h-full">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-indigo-500/20">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-foreground font-bold text-sm sm:text-base mb-0.5 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Course Map</h3>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium truncate">Main curriculum</p>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/challenges" className="block group">
          <motion.div whileHover={{ y: -1 }} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-muted/30 h-full">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-rose-500/20">
              <Swords className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 dark:text-rose-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-foreground font-bold text-sm sm:text-base mb-0.5 transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400">Challenges</h3>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium truncate">Daily puzzles</p>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/achievements" className="block group">
          <motion.div whileHover={{ y: -1 }} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-muted/30 h-full">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-amber-500/20">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-foreground font-bold text-sm sm:text-base mb-0.5 transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">Achievements</h3>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium truncate">Badges & Glory</p>
            </div>
          </motion.div>
        </Link>
      </div>

    </div>
  );
}