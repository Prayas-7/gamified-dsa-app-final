'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Background Glow Effect - Indigo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Indigo Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium border border-indigo-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Interactive Learning Reimagined
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
            Don&apos;t Just Watch Algorithms. <br />
            <span className="text-indigo-600 dark:text-indigo-400">Play Them.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Standard tutorials make you a spectator. We make you a player. 
            Drag, drop, and link your way to mastering Data Structures 
            without writing a single line of code first.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center gap-2 w-full sm:w-auto justify-center group shadow-lg shadow-indigo-500/20"
            >
              Let&apos;s Play
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#about"
              className="px-8 py-4 rounded-xl bg-card hover:bg-accent border border-border text-foreground font-semibold transition-all w-full sm:w-auto text-center"
            >
              How it Works
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}