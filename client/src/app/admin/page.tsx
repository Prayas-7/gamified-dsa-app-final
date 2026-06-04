'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Users, Puzzle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminSummary } from '../../types/admin';

export default function AdminDashboard() {
  const [data, setData] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    async function getStats() {
      try {
        // 1. Updated URL to match your backend route (assuming /api/admin/stats)
        const response = await fetch('http://localhost:5000/api/admin/stats'); 
        
        if (!response.ok) throw new Error('Backend returned an error');
        
        const result = await response.json();

        // 2. Map your backend's "stats" object to the frontend state
        if (result.success) {
          setData({
            activeUsers: result.stats.totalUsers,
            totalPuzzles: result.stats.totalPuzzles,
            systemHealth: 100, // Static for now
            recentLogs: [
              `System synchronized: ${result.stats.totalSystemXP} total XP tracked.`
            ]
          });
        }
      } catch (error) {
        toast.error("Connection failed. Check if server is on port 5000.");
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-mono">Establishing Secure MongoDB Connection...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-zinc-500 mt-2">Live synchronization with your database cluster.</p>
      </header>

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Active Players" 
          value={data?.activeUsers ?? 0} 
          icon={<Users className="text-blue-400" />} 
          trend="Real-time Count"
        />
        <StatCard 
          title="Total Puzzles" 
          value={data?.totalPuzzles ?? 0} 
          icon={<Puzzle className="text-emerald-400" />} 
          trend="Collection: 'puzzles'"
        />
        <StatCard 
          title="Avg. Completion" 
          value="74%" // You can make this dynamic by calculating (completed/total) in the controller
          icon={<CheckCircle2 className="text-purple-400" />} 
          trend="Stable"
        />
        <StatCard 
          title="System Health" 
          value={`${data?.systemHealth ?? 0}%`} 
          icon={<Activity className="text-orange-400" />} 
          trend="Status: Operational"
        />
      </div>

      {/* Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Recent System Logs
          </h2>
          <div className="space-y-3">
            {data?.recentLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-white/5 text-sm text-zinc-400 font-mono">
                <span className="text-blue-500 font-bold shrink-0">[SYNC]</span>
                {log}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend: string }) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">
          {trend}
        </span>
      </div>
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-mono font-bold mt-2 text-white">{value}</h3>
    </div>
  );
}