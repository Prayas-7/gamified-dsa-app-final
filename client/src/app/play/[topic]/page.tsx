'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLevelStore } from '../../../store/levelStore';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import Link from 'next/link';

// LEVEL DATA IMPORTS
import { arrayLevelData } from '../../../lib/levels/array';
import { linkedListLevelData } from '../../../lib/levels/linkedLists';
import { stacksLevelData } from '../../../lib/levels/stack';
import { linearSearchLevelData } from '../../../lib/levels/linearSearch';
import { binarySearchLevelData } from '../../../lib/levels/binarySearch';
import { bubbleSortLevelData } from '../../../lib/levels/bubbleSort';
import { selectionSortLevelData } from '../../../lib/levels/selectionSort';
import { hashTableLevelData } from '../../../lib/levels/hashTable';
import { treeLevelData } from '../../../lib/levels/trees';
import { graphLevelData } from '../../../lib/levels/graph';

// COMPONENT IMPORTS
import IntroView from '../../../components/game/IntroView';
import PuzzleView from '../../../components/game/PuzzleView';
import LinkedListPuzzle from '../../../components/game/LinkedListPuzzle';
import StackPuzzle from '../../../components/game/StackPuzzle';
import LinearSearchPuzzle from '../../../components/game/LinearPuzzle';
import BinarySearchPuzzle from '../../../components/game/BinaryPuzzle';
import BubbleSortPuzzle from '../../../components/game/BubblePuzzle';
import HashTablePuzzle from '../../../components/game/HashPuzzle';
import SelectionSortPuzzle from '../../../components/game/SelectionSortPuzzle';
import BinaryTreePuzzle from '../../../components/game/TreePuzzle';
import GraphPuzzle from '../../../components/game/GraphPuzzle';
import QuizView from '../../../components/game/QuizView';
import SummaryView from '../../../components/game/SummaryView';
import StatsHeader from '../../../components/dashboard/StatsHeader';

import { LevelStage } from '../../../types/game';

const LEVEL_MAP: Record<string, LevelStage[]> = {
  arrays: arrayLevelData,
  'linked-lists': linkedListLevelData,
  stacks: stacksLevelData,
  'stacks-queues': stacksLevelData,
  'linear-search': linearSearchLevelData,
  'binary-search': binarySearchLevelData,
  'bubble-sort': bubbleSortLevelData,
  'selection-sort': selectionSortLevelData,
  'hash-tables': hashTableLevelData,
  trees: treeLevelData,
  graph: graphLevelData,
  graphs: graphLevelData,
};

export default function LevelPage() {
  const { topic } = useParams();
  const router = useRouter();
  const { currentStageIndex, stages, setStages, hearts } = useLevelStore();

  const [isMounted, setIsMounted] = useState(false);
  const currentTopic = Array.isArray(topic) ? topic[0] : topic;

  // Hydration Fix: Avoid cascading renders
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Sync stages when topic or mount status changes
  useEffect(() => {
    if (isMounted && currentTopic && LEVEL_MAP[currentTopic]) {
      setStages(LEVEL_MAP[currentTopic]);
    }
  }, [currentTopic, isMounted, setStages]);

  const currentStage = stages[currentStageIndex];

  // 1. Loading State
  if (!isMounted || !currentStage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="font-mono text-sm tracking-widest uppercase opacity-70">
          Spawning Level Engine...
        </p>
      </div>
    );
  }

  // 2. Game Over State
  if (hearts === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
        <h1 className="text-5xl font-extrabold text-red-500 mb-2">Game Over</h1>
        <p className="text-muted-foreground mb-6 text-lg">You ran out of hearts.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-3 bg-muted border border-border rounded-xl font-bold hover:bg-border transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
          <X className="w-5 h-5" />
        </Link>

        <div className="flex-1 max-w-md mx-6 hidden sm:block">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStageIndex / stages.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <StatsHeader />
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="container mx-auto px-4 py-8">
        
        {/* VIEW 1: INTRO */}
        {currentStage.type === 'intro' && <IntroView data={currentStage} />}

        {/* VIEW 2: GRAPH (New Logic Integration) */}
        {currentStage.type === 'graph' && <GraphPuzzle data={currentStage} />}

        {/* VIEW 3: PUZZLES & ALGORITHMS (Where Arrays Live) */}
        {(currentStage.type === 'puzzle' || currentStage.type === 'algorithm-puzzle') && (
          <>
            {/* Specific Logic Components */}
            {currentTopic === 'trees' && <BinaryTreePuzzle data={currentStage} />}
            {currentTopic === 'linear-search' && <LinearSearchPuzzle data={currentStage} />}
            {currentTopic === 'binary-search' && <BinarySearchPuzzle data={currentStage} />}
            {currentTopic === 'bubble-sort' && <BubbleSortPuzzle data={currentStage} />}
            {currentTopic === 'selection-sort' && <SelectionSortPuzzle data={currentStage} />}
            {currentTopic === 'hash-tables' && <HashTablePuzzle data={currentStage} />}
            {currentTopic?.includes('stack') && <StackPuzzle data={currentStage} />}
            {currentTopic?.includes('linked-list') && <LinkedListPuzzle data={currentStage} />}

            {/* THE ARRAYS FIX: Render PuzzleView if not one of the custom components above */}
            {![
              'trees',
              'linear-search',
              'binary-search',
              'bubble-sort',
              'selection-sort',
              'hash-tables',
              'stack',
              'stacks',
              'linked-list',
              'linked-lists'
            ].some(key => currentTopic?.includes(key)) && (
              <PuzzleView data={currentStage} />
            )}
          </>
        )}

        {/* VIEW 4: QUIZ */}
        {currentStage.type === 'quiz' && <QuizView data={currentStage} />}

        {/* VIEW 5: SUMMARY */}
        {currentStage.type === 'summary' && <SummaryView data={currentStage} />}

      </main>
    </div>
  );
}