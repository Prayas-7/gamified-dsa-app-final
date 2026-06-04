'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { getRandomChallengeByTopic } from '@/src/lib/strapi'; 
import PuzzleView from '@/src/components/game/PuzzleView';
import LinearSearchPuzzle from '@/src/components/game/LinearPuzzle';
import LinkedListPuzzle from '@/src/components/game/LinkedListPuzzle';
import BinaryTreePuzzle from '@/src/components/game/TreePuzzle';
import StackQueuePuzzle from '@/src/components/game/StackPuzzle'; 
import StatsHeader from '@/src/components/dashboard/StatsHeader';
import SummaryView from '@/src/components/game/SummaryView';
import { PuzzleStage, SummaryStage } from '@/src/types/game';

export default function ChallengePracticePage() {
  const { topic } = useParams();
  const currentTopic = (Array.isArray(topic) ? topic[0] : topic) || '';

  const [rawPuzzle, setRawPuzzle] = useState<PuzzleStage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [streak, setStreak] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [nonce, setNonce] = useState(0); 
  
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isFetching = useRef(false);

  const loadNewChallenge = useCallback(async () => {
    if (!currentTopic || showSummary || isFetching.current) return;
    
    isFetching.current = true;
    setLoading(true);
    
    try {
      let puzzle: PuzzleStage | null = null;
      let attempts = 0;
      const maxAttempts = 15; 

      while (attempts < maxAttempts) {
        const candidate: PuzzleStage = await getRandomChallengeByTopic(currentTopic);
        
        if (!candidate) break;
        const candidateId = candidate.id.toString();

        if (!seenIdsRef.current.has(candidateId)) {
          puzzle = candidate;
          seenIdsRef.current.add(candidateId); 
          break;
        }
        
        if (attempts === maxAttempts - 1) {
          puzzle = candidate;
        }

        attempts++;
      }

      if (puzzle) {
        setRawPuzzle(puzzle);
        setNonce(n => n + 1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [currentTopic, showSummary]);

  const handleSuccess = useCallback(() => {
    setStreak(prev => {
      const next = prev + 1;
      setRawPuzzle(null);

      if (next > 0 && next % 5 === 0) {
        setShowSummary(true);
        seenIdsRef.current.clear(); 
      } else {
        setTimeout(() => loadNewChallenge(), 300);
      }
      return next;
    });
  }, [loadNewChallenge]);

  const handleFail = useCallback(() => setStreak(0), []);

  useEffect(() => {
    if (currentTopic && !rawPuzzle && !showSummary && !isFetching.current) {
      loadNewChallenge();
    }
  }, [currentTopic, loadNewChallenge, rawPuzzle, showSummary]);

  const puzzleData: PuzzleStage | null = rawPuzzle ? {
    ...rawPuzzle,
    initialState: typeof rawPuzzle.initialState === 'string' ? JSON.parse(rawPuzzle.initialState) : rawPuzzle.initialState,
    targetState: typeof rawPuzzle.targetState === 'string' ? JSON.parse(rawPuzzle.targetState) : rawPuzzle.targetState,
  } : null;

  if (loading && !puzzleData && !showSummary) {
    return <div className="flex items-center justify-center h-screen bg-background font-bold animate-pulse">Loading {currentTopic} Challenge...</div>;
  }

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-background text-foreground overflow-hidden">
      {!showSummary && (
        <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card/50">
          <Link href="/dashboard/challenges"><X className="w-6 h-6 text-muted hover:text-foreground" /></Link>
          <div className="flex flex-col items-center">
            <span className="text-indigo-500 font-black text-2xl">{streak}</span>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Streak</span>
          </div>
          <StatsHeader />
        </header>
      )}

      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {showSummary ? (
            <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              <SummaryView data={{ type: 'summary', xpReward: 50 } as SummaryStage} />
            </motion.div>
          ) : (
            puzzleData && (
              <motion.div 
                key={`${puzzleData.id}-${nonce}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-6xl"
              >
                {(() => {
                  const pType = (puzzleData as { type?: string }).type;
                  
                  // ROUTING LOGIC FOR DIFFERENT PUZZLES
                  if (currentTopic === 'linear-search') 
                    return <LinearSearchPuzzle data={puzzleData} />;
                  if (currentTopic.includes('linked') || pType === 'linked-list') 
                    return <LinkedListPuzzle data={puzzleData} onComplete={handleSuccess} onFail={handleFail} />;
                  
                  if (currentTopic.includes('tree') || pType === 'binary-tree') 
                    return <BinaryTreePuzzle data={puzzleData} onComplete={handleSuccess} />;

                  // ADDED: STACK & QUEUE SUPPORT
                  if (currentTopic === 'stacks' || pType === 'stacks' ) 
                    return <StackQueuePuzzle data={puzzleData} onComplete={handleSuccess} />;

                  return <PuzzleView data={puzzleData} onComplete={handleSuccess} onFail={handleFail} />;
                })()}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}