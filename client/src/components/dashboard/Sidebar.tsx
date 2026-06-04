'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import {
  LayoutDashboard,
  Trophy,
  Settings,
  LogOut,
  User,
  Swords,
  BookOpen,
  Sun,
  Moon,
  Award, // 1. Added Award icon for Achievements
} from 'lucide-react';
import clsx from 'clsx';
import { useUserStore } from '../../store/useStore';
import api from '../../lib/axios';
import { toast } from 'sonner';

// 2. Added Achievements to the navItems array
const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: BookOpen, label: 'Course', href: '/dashboard/course' },
  { icon: Trophy, label: 'Leaderboard', href: '/dashboard/leaderboard' },
  { icon: Swords, label: 'Challenges', href: '/dashboard/challenges' },
  { icon: Award, label: 'Achievements', href: '/dashboard/achievements' }, // New Item
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { username, xp, level, logout: clearStore } = useUserStore();

  // Simplified progress calculation to match your dashboard dashboard logic
  const progressPercent = Math.min(100, (xp % 1000) / 10);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      clearStore();
      router.push('/login');
      toast.success('Signed out successfully');
    } catch {
      clearStore();
      router.push('/login');
    }
  };

  return (
    <>
      {/* MOBILE BOTTOM BAR - Adjusted padding/size for 6 items */}
      <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-border flex md:hidden justify-around items-center z-100 px-1 transition-colors duration-300 bg-background">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={clsx(
              "p-1.5 rounded-lg transition-colors",
              isActive ? "text-indigo-600" : "text-muted"
            )}>
              <item.icon size={22} />
            </Link>
          );
        })}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside 
        key={resolvedTheme} 
        className="hidden md:flex w-64 h-screen fixed left-0 top-0 flex-col p-4 z-50 border-r border-border transition-colors duration-300 bg-background text-foreground"
      >
        {/* Profile Card */}
        <div className="mb-6 p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-indigo-600/20">
              {username?.charAt(0).toUpperCase() || <User size={20} />}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{username || 'Guest'}</div>
              <div className="text-xs text-indigo-600 font-mono font-bold">Lvl {level}</div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-muted hover:bg-card hover:text-foreground'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-border space-y-1">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted hover:bg-card hover:text-foreground transition-all"
          >
            {resolvedTheme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-muted hover:bg-card hover:text-rose-500 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}