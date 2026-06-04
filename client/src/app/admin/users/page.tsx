'use client';

import React, { useState, useEffect } from 'react';
import { Users, Trophy, AlertTriangle, Search, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  _id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        if (data.success) setUsers(data.users);
      } catch {
        toast.error("Could not load users from MongoDB");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Performance Logic
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
  const topPerformer = sortedUsers[0];
  const lowestPerformer = sortedUsers[sortedUsers.length - 1];

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-zinc-500 animate-pulse font-mono">Querying user cluster...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-zinc-500">Monitor student progress and performance metrics.</p>
      </header>

      {/* Quick Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <Trophy size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Top Performer</span>
          </div>
          <h3 className="text-xl font-bold text-white">{topPerformer?.username ?? 'N/A'}</h3>
          <p className="text-zinc-500 text-sm">{topPerformer?.xp ?? 0} Total XP</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3 text-orange-400 mb-2">
            <AlertTriangle size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Needs Attention</span>
          </div>
          <h3 className="text-xl font-bold text-white">{lowestPerformer?.username ?? 'N/A'}</h3>
          <p className="text-zinc-500 text-sm">Level {lowestPerformer?.level ?? 0} • Lowest Engagement</p>
        </div>

        <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Users size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Total Students</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{users.length}</h3>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <Search className="text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by username or email..." 
            className="bg-transparent border-none text-white focus:ring-0 w-full text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-zinc-500 text-[11px] uppercase tracking-widest bg-black/20">
              <th className="p-4 font-black">User</th>
              <th className="p-4 font-black text-center">Level</th>
              <th className="p-4 font-black text-center">XP</th>
              <th className="p-4 font-black text-center">Streak</th>
              <th className="p-4 font-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{user.username}</span>
                    <span className="text-zinc-500 text-xs flex items-center gap-1">
                      <Mail size={12} /> {user.email}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center text-zinc-300 font-mono">{user.level}</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                    {user.xp} XP
                  </span>
                </td>
                <td className="p-4 text-center text-orange-400">🔥 {user.streak}</td>
                <td className="p-4 text-right">
                   <ShieldCheck className="inline text-zinc-700 group-hover:text-blue-500 transition-colors" size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}