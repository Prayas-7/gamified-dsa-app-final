'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, BarChart3, 
  Settings, LogOut, ShieldCheck 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'User Management', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Analytics & Reports', href: '/admin/reports', icon: <BarChart3 size={20} /> },
    { name: 'System Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 bg-[#0c0c0e]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">CORE ADMIN</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                  ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-zinc-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-400 transition-colors font-medium">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}