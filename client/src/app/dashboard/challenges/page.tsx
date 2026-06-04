'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Network, Layers, Hash, GitBranch, 
  ArrowDownAZ 
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  Hash: <Hash className="w-6 h-6" />,
  GitBranch: <GitBranch className="w-6 h-6" />,
  Network: <Network className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  ArrowDownAZ: <ArrowDownAZ className="w-6 h-6" />,
};

// Removed: Hash Tables, Linear Search, Binary Search
const topics = [
  { id: 'arrays', name: 'Arrays & Hashing', iconName: 'Hash', color: 'from-blue-500 to-indigo-600', lightBorder: 'hover:border-blue-400' },
  { id: 'linked-lists', name: 'Linked Lists', iconName: 'GitBranch', color: 'from-purple-500 to-indigo-600', lightBorder: 'hover:border-purple-400' },
  { id: 'trees', name: 'Binary Trees', iconName: 'Network', color: 'from-emerald-500 to-indigo-600', lightBorder: 'hover:border-emerald-400' },
  { id: 'stacks', name: 'Stacks', iconName: 'Layers', color: 'from-orange-500 to-indigo-600', lightBorder: 'hover:border-orange-400' },
  { id: 'selection-sort', name: 'Selection Sort', iconName: 'ArrowDownAZ', color: 'from-yellow-500 to-indigo-600', lightBorder: 'hover:border-yellow-400' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring" as const, stiffness: 260, damping: 20 } 
  }
};

export default function ChallengeSelector() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 transition-colors duration-500 relative overflow-hidden">
      {/* Blueprint/Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center sm:text-left"
        >
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
            Practice Mode
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
            Pick your <span className="text-indigo-600">Challenge</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Master fundamental data structures through high-fidelity visual puzzles.
          </p>
        </motion.header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {topics.map((topic) => (
            <motion.button
              key={topic.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/dashboard/puzzlemode/${topic.id}`)}
              className={`group relative p-8 rounded-4x1 bg-white dark:bg-card border-2 border-indigo-50 dark:border-white/5 ${topic.lightBorder} dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 text-left overflow-hidden w-full`}
            >
              <div className={`absolute -right-2 -top-2 w-24 h-24 bg-linear-to-br ${topic.color} opacity-[0.05] blur-2xl group-hover:opacity-20 transition-opacity`} />

              <div className="flex items-center justify-between mb-8">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-muted text-indigo-600 dark:text-foreground group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  {iconMap[topic.iconName]}
                </div>
                <div className="text-right">
                    <span className="block text-[10px] font-black text-indigo-300 dark:text-muted-foreground uppercase tracking-[0.2em]">
                      Pool Size
                    </span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-foreground">
                      5 Puzzles
                    </span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-foreground mb-3">
                {topic.name}
              </h3>

              <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">
                Solve interactive visual puzzles to master {topic.name.toLowerCase()} logic.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-indigo-50 dark:border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  Start Practice
                </span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ArrowDownAZ className="w-4 h-4 text-indigo-400 -rotate-90" />
                </motion.div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}