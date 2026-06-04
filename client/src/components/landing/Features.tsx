'use client';
import { motion } from 'framer-motion';
import { BrainCircuit, Layers, Trophy, Zap } from 'lucide-react';

const features = [
  { title: 'Active Learning', desc: 'VisuAlgo makes you watch. We make you solve. Build intuition by manually sorting arrays and linking nodes.', icon: <Zap className="w-6 h-6 text-yellow-500" />, colSpan: 'md:col-span-2' },
  { title: 'Skill Tree Progression', desc: 'Track your journey from Arrays to Graphs with an RPG-style progression system.', icon: <Trophy className="w-6 h-6 text-indigo-500" />, colSpan: 'md:col-span-1' },
  { title: 'Visual Intuition', desc: 'No syntax errors. No compiler issues. Just pure logic visualized in real-time.', icon: <Layers className="w-6 h-6 text-pink-500" />, colSpan: 'md:col-span-1' },
  { title: 'Gamified Mastery', desc: 'Earn XP, maintain streaks, and compete on leaderboards. Learning DSA shouldn’t be boring.', icon: <BrainCircuit className="w-6 h-6 text-emerald-500" />, colSpan: 'md:col-span-2' },
];

export default function Features() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight">Why this works better</h2>
          <p className="text-muted-foreground text-lg">Bridging the gap between theory and code.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className={`group p-8 rounded-3xl border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5 ${f.colSpan}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Icon Container with subtle purple glow */}
              <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                {f.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}