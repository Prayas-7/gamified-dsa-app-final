'use client';

import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PuzzleStage, GraphNode } from '../../types/game';
import { useLevelStore } from '../../store/levelStore'; // Added for Story Mode fallback
import { toast } from 'sonner';
import { RotateCcw, XCircle } from 'lucide-react';

interface LinkedListProps {
  data: PuzzleStage;
  onComplete?: () => void; 
  onFail?: () => void;     
}

export default function LinkedListPuzzle({ data, onComplete }: LinkedListProps) {
  // 1. STORY MODE COMPATIBILITY LOGIC
  // If parent (Challenge Mode) doesn't provide handlers, use the LevelStore (Story Mode)
  const { nextStage } = useLevelStore();
  const handleSuccess = onComplete || nextStage;

  // 2. STATE MANAGEMENT
  // useMemo ensures that when the initial state changes, the nodes reset automatically
  const initialNodes = useMemo(() => 
    data.initialState ? JSON.parse(JSON.stringify(data.initialState)) : [],
    [data.initialState]
  );

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (clickedId: string) => {
    if (isSolved) return;
    if (!selectedSourceId) {
      setSelectedSourceId(clickedId);
      return;
    }
    if (selectedSourceId === clickedId) {
      setSelectedSourceId(null);
      return;
    }
    const newNodes = nodes.map(node => 
      node.id === selectedSourceId ? { ...node, next: clickedId } : node
    );
    setNodes(newNodes);
    setSelectedSourceId(null);
    checkSolution(newNodes);
  };

  const handleNullClick = () => {
    if (!selectedSourceId || isSolved) return;
    const newNodes = nodes.map(node => 
      node.id === selectedSourceId ? { ...node, next: null } : node
    );
    setNodes(newNodes);
    setSelectedSourceId(null);
    checkSolution(newNodes);
  };

  const checkSolution = (currentNodes: GraphNode[]) => {
    if (!data.targetState) return;
    
    // Parse target state if it's coming in as a string from Strapi
    const target = typeof data.targetState === 'string' 
      ? JSON.parse(data.targetState) 
      : data.targetState;

    const isCorrect = JSON.stringify(currentNodes) === JSON.stringify(target);
    
    if (isCorrect) {
      setIsSolved(true);
      toast.success('Chain Restored!', { icon: '🔗' });
      
      // Use the resolved success handler
      setTimeout(handleSuccess, 800);
    }
  };

  // Layout Constants
  const NODE_WIDTH = 80;
  const GAP = 64;
  const CENTER = 40;

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-6xl flex flex-col items-center gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">{data.instruction}</h2>
          <p className="text-muted-foreground text-sm font-medium italic">
            Select a node, then click its next destination to repair the list.
          </p>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar flex justify-center py-12">
          <div className="relative p-12 bg-card rounded-3xl border border-border shadow-xl min-w-150" ref={containerRef}>
            <div className="relative flex items-center gap-16">
              
              {/* Arrow SVG Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className="fill-indigo-500" />
                  </marker>
                </defs>
                {nodes.map((node, i) => {
                  if (!node.next) return null;
                  const sourceIdx = i;
                  const targetIdx = nodes.findIndex(n => n.id === node.next);
                  if (targetIdx === -1) return null;
                  
                  const x1 = sourceIdx * (NODE_WIDTH + GAP) + CENTER;
                  const x2 = targetIdx * (NODE_WIDTH + GAP) + CENTER;
                  const y = CENTER;

                  if (targetIdx === sourceIdx + 1) {
                    return (
                      <motion.line 
                        key={`${node.id}-${node.next}`} 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: 1 }}
                        x1={x1 + 40} y1={y} x2={x2 - 45} y2={y} 
                        strokeWidth="3" markerEnd="url(#arrow)" className="stroke-indigo-500" 
                      />
                    );
                  }
                  
                  const isBackward = targetIdx < sourceIdx;
                  const path = `M ${x1} ${isBackward ? y-40 : y+40} Q ${(x1 + x2) / 2} ${isBackward ? -60 : 140} ${x2} ${isBackward ? y-40 : y+40}`;
                  return (
                    <motion.path 
                      key={`${node.id}-${node.next}`} 
                      initial={{ pathLength: 0 }} 
                      animate={{ pathLength: 1 }}
                      d={path} fill="none" strokeWidth="3" strokeDasharray="6 4" 
                      markerEnd="url(#arrow)" className="stroke-indigo-500 opacity-60" 
                    />
                  );
                })}
              </svg>

              {/* Node Buttons */}
              {nodes.map((node, index) => (
                <div key={node.id} className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-indigo-500 uppercase">
                    {index === 0 ? 'HEAD' : `ADDR: ${node.id.slice(0, 4)}`}
                  </div>
                  <motion.button 
                    onClick={() => handleNodeClick(node.id)}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center z-10 relative font-black text-xl transition-all
                      ${selectedSourceId === node.id ? 'border-indigo-500 bg-indigo-500/10 shadow-lg' : 'border-border bg-background'}
                      ${isSolved ? 'border-emerald-500 bg-emerald-500/10' : ''}`}
                  >
                    {node.value}
                  </motion.button>
                </div>
              ))}

              {/* Null Terminator */}
              <button 
                onClick={handleNullClick}
                className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all 
                  ${selectedSourceId ? 'border-red-500 bg-red-500/5 animate-pulse' : 'border-border bg-muted/40'}`}
              >
                <XCircle size={20} className="text-red-500 mb-1" />
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">Null</span>
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setNodes(JSON.parse(JSON.stringify(data.initialState)))}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground border border-border px-4 py-2 rounded-lg bg-card transition-colors"
        >
          <RotateCcw size={14} /> Reset Connections
        </button>
      </div>
    </div>
  );
}