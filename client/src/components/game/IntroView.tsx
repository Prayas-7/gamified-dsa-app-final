'use client';
import { motion } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { IntroStage } from '../../types/game';
import { ArrowRight, Box, Database, Layers, Search, Share2 } from 'lucide-react';

export default function IntroView({ data }: { data: IntroStage }) {
  const { nextStage } = useLevelStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 text-foreground bg-background transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl flex flex-col items-center text-center"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 tracking-tight">
          {data.title}
        </h1>
        
        <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed font-medium">
          {data.content}
        </p>

        {/* Responsive Sandbox Container */}
        <div className="mb-12 p-6 sm:p-10 bg-card rounded-3xl border border-border shadow-lg w-full flex items-center justify-center overflow-hidden">
          <div className="scale-75 sm:scale-100 origin-center">
            
            {/* 1. LOCKER ROW */}
            {data.visualType === 'locker-row' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 border-2 border-indigo-500/30 bg-indigo-500/5 rounded-xl flex items-center justify-center">
                        <Box className="w-6 h-6 text-indigo-500/40" />
                      </div>
                      <span className="text-[9px] font-mono text-muted">Idx {i}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-2"><Database size={10}/> Continuous Memory</p>
              </div>
            )}

            {/* 2. GRAPH */}
            {data.visualType === 'graph' && (
              <div className="w-32 h-32 relative">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="absolute w-10 h-10 bg-cyan-500/20 border-2 border-cyan-500 rounded-full flex items-center justify-center"
                    style={{ top: i===0?0:'auto', bottom: i!==0?0:'auto', left: i===1?0:'auto', right: i===2?0:'auto' }}>
                    <Share2 size={16} className="text-cyan-600" />
                  </div>
                ))}
              </div>
            )}

            {/* 3. TREE */}
            {data.visualType === 'tree' && (
              <div className="flex flex-col items-center gap-4">
                <svg className="w-48 h-24" viewBox="0 0 200 120">
                  <line x1="100" y1="30" x2="50" y2="90" className="stroke-indigo-500" strokeWidth="3" />
                  <line x1="100" y1="30" x2="150" y2="90" className="stroke-indigo-500" strokeWidth="3" />
                  <circle cx="100" cy="30" r="16" className="fill-indigo-600" />
                  <circle cx="50" cy="90" r="16" className="fill-card stroke-indigo-600" strokeWidth="3" />
                  <circle cx="150" cy="90" r="16" className="fill-card stroke-indigo-600" strokeWidth="3" />
                </svg>
              </div>
            )}

            {/* 4. SEQUENTIAL SCAN */}
            {data.visualType === 'sequential-scan' && (
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 border-2 rounded-md flex items-center justify-center ${i === 2 ? 'border-indigo-500 bg-indigo-500/10' : 'border-border'}`}>
                    {i === 2 ? <Search size={16} /> : <div className="w-2 h-2 bg-muted rounded-full" />}
                  </div>
                ))}
              </div>
            )}

            {/* 5. STACK */}
            {data.visualType === 'stack-visual' && (
              <div className="flex flex-col-reverse gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-28 h-8 bg-indigo-500/10 border border-indigo-500/30 rounded flex items-center justify-center text-[10px] font-bold">
                    <Layers size={12} className="mr-2" /> DATA_{i}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={nextStage}
          className="group inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-8 font-bold text-white transition-all hover:bg-indigo-500 hover:scale-105"
        >
          Begin Level <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
}