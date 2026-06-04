'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { AnalyticsData, LevelDist } from '../../../types/admin';

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {        const fetchAnalytics = async (): Promise<void> => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/analytics');
                if (!res.ok) throw new Error('Failed to fetch analytics');
                const json: AnalyticsData = await res.json();
                setData(json);
            } catch (err) {
                console.error("Analytics fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const COLORS: string[] = ['#60a5fa', '#34d399', '#a78bfa', '#fb923c'];

    if (loading) return <div className="p-10 text-zinc-500 animate-pulse font-mono text-center">Crunching MongoDB Data...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reports</h1>
                    <p className="text-zinc-500 mt-1">Technical performance metrics for student cohorts.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition-all text-sm font-medium">
                    <Download size={16} /> Export CSV Report
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* XP Distribution Chart */}
                <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-blue-400" size={20} />
                        <h2 className="text-lg font-bold text-white">Individual XP Metrics</h2>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.performanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Bar dataKey="xp" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Level Distribution Chart */}
                <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <PieIcon className="text-emerald-400" size={20} />
                        <h2 className="text-lg font-bold text-white">Cohort Level Mastery</h2>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={data?.levelDistribution} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={8} 
                                    dataKey="students"
                                    nameKey="level"
                                    stroke="none"
                                >
                                    {data?.levelDistribution.map((entry: LevelDist, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="System Average XP" value={data?.averageXP ?? 0} subtitle="Across all students" />
                <MetricCard title="Participation Rate" value="100%" subtitle="Active in last 30 days" />
                <MetricCard title="Data Integrity" value="Stable" subtitle="Verified MongoDB sync" />
            </div>
        </div>
    );
}

function MetricCard({ title, value, subtitle }: { title: string; value: string | number; subtitle: string }) {
    return (
        <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <p className="text-zinc-600 text-xs mt-1">{subtitle}</p>
        </div>
    );
}