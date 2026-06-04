'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion'; // Removed AnimatePresence as it wasn't used in this file
import { PuzzleStage, GraphNode } from '../../types/game';
import { useLevelStore } from '../../store/levelStore';
import { toast } from 'sonner';
import { GitBranch } from 'lucide-react';

interface TreePoint extends GraphNode {
  x: number;
  y: number;
  level: number;
}

// 1. UPDATED: Added a proper interface that accepts the optional onComplete
interface BinaryTreeProps {
  data: PuzzleStage;
  onComplete?: () => void; // Optional so Story Mode still works
}

export default function BinaryTreePuzzle({ data, onComplete }: BinaryTreeProps) {
  const { nextStage } = useLevelStore();

  // 2. UPDATED: Define which function to call on success
  const handleSuccess = onComplete || nextStage;

  // 1. Calculate Coordinates (Pyramid Mapping)
  const treeData: TreePoint[] = useMemo(() => {
    const nodes = (data.initialState as GraphNode[]).map(n => ({
      ...n,
      id: n.id.trim(),
      left: n.left?.trim() || null,
      right: n.right?.trim() || null
    }));

    if (!nodes.length) return [];
    const mapped: TreePoint[] = [];
    const getNode = (id: string) => nodes.find(n => n.id === id);

    const mapNode = (id: string, x: number, y: number, level: number, offset: number) => {
      const node = getNode(id);
      if (!node) return;

      mapped.push({ ...node, x, y, level });
      const nextXOffset = offset / 2;
      const spacingY = 160;

      if (node.left) mapNode(node.left, x - offset, y + spacingY, level + 1, nextXOffset);
      if (node.right) mapNode(node.right, x + offset, y + spacingY, level + 1, nextXOffset);
    };

    mapNode(nodes[0].id, 500, 80, 1, 240);
    return mapped;
  }, [data.initialState]);

  // 2. State
  const [currentNodeId, setCurrentNodeId] = useState<string>(treeData[0]?.id || '');
  const [visitedIds, setVisitedIds] = useState<string[]>(treeData[0]?.id ? [treeData[0].id] : []);
  const [isSolved, setIsSolved] = useState(false);

  const target = Number(data.targetValue);
  const currentNode = treeData.find(n => n.id === currentNodeId);

  const handleNodeClick = (nodeId: string) => {
    if (isSolved || !currentNode) return;

    const clickedNode = treeData.find(n => n.id === nodeId);
    if (!clickedNode) return;

    const isLeftChild = currentNode.left === nodeId;
    const isRightChild = currentNode.right === nodeId;

    if (!isLeftChild && !isRightChild) return;

    // BST Logic Check
    if (isLeftChild && target > Number(currentNode.value)) {
      toast.error("BST Violation!", { description: `${target} > ${currentNode.value}. Go RIGHT.` });
      return;
    }
    if (isRightChild && target < Number(currentNode.value)) {
      toast.error("BST Violation!", { description: `${target} < ${currentNode.value}. Go LEFT.` });
      return;
    }

    setVisitedIds(prev => [...prev, nodeId]);
    setCurrentNodeId(nodeId);

    if (Number(clickedNode.value) === target) {
      setIsSolved(true);
      toast.success("🎯 Target Found!", { description: "Advancing..." });
      
      // 3. UPDATED: Call handleSuccess instead of nextStage
      setTimeout(handleSuccess, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-6 text-foreground bg-background transition-colors duration-300">
      {/* Level Header Container */}
      <div className="text-center mb-6 w-full max-w-xl bg-card border border-border p-5 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-extrabold mb-1 flex items-center justify-center gap-2 text-foreground">
          <GitBranch className="text-blue-600 dark:text-blue-400 w-6 h-6" /> {data.instruction}
        </h2>
        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-500/20 inline-block mt-2 shadow-sm">
          Find Target: {target}
        </div>
      </div>

      {/* Main SVG Viewport Canvas Layout */}
      <div className="relative w-full aspect-3/4 max-h-187.5 bg-background border border-border rounded-3xl overflow-hidden shadow-xl transition-colors duration-300">
        <div
          className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
          style={{ pointerEvents: 'none' }}
        />

        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          {treeData.map(node => {
            const isParentVisited = visitedIds.includes(node.id);
            const leftChild = node.left ? treeData.find(n => n.id === node.left) : null;
            const rightChild = node.right ? treeData.find(n => n.id === node.right) : null;

            return (
              <g key={`edges-${node.id}`}>
                {isParentVisited && leftChild && (
                  <TreeLine from={node} to={leftChild} active={visitedIds.includes(leftChild.id)} />
                )}
                {isParentVisited && rightChild && (
                  <TreeLine from={node} to={rightChild} active={visitedIds.includes(rightChild.id)} />
                )}
              </g>
            );
          })}

          {treeData.map(node => {
            const isCurrent = node.id === currentNodeId;
            const isVisited = visitedIds.includes(node.id);
            const isTarget = isSolved && Number(node.value) === target;
            const isLegalMove = currentNode?.left === node.id || currentNode?.right === node.id;

            return (
              <g key={node.id}>
                {isLegalMove && !isSolved && (
                  <motion.circle
                    cx={node.x} cy={node.y} r="36"
                    initial={{ opacity: 0 }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                <motion.circle
                  cx={node.x} cy={node.y} r="30"
                  onClick={() => handleNodeClick(node.id)}
                  animate={{
                    fill: (isTarget || isCurrent) ? '#22c55e' : isVisited ? '#3b82f6' : 'var(--background)',
                    stroke: (isTarget || isCurrent) ? '#16a34a' : isVisited ? '#2563eb' : '#3b82f6',
                    strokeWidth: (isCurrent || isVisited) ? 0 : 4
                  }}
                  whileHover={{ scale: isLegalMove ? 1.1 : 1 }}
                  style={{ pointerEvents: 'all' }}
                  className={`${isLegalMove ? 'cursor-pointer' : 'cursor-default'} transition-all shadow-sm`}
                />

                <text
                  x={node.x} y={node.y} dy="5"
                  textAnchor="middle"
                  fill={(isCurrent || isVisited) ? '#ffffff' : 'var(--foreground)'}
                  className="text-[16px] font-black pointer-events-none select-none transition-colors duration-200"
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// TreeLine Helper remains unchanged
function TreeLine({ from, to, active }: { from: TreePoint; to: TreePoint; active: boolean }) {
  return (
    <motion.line
      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
      initial={{ opacity: 0 }}
      animate={{
        stroke: '#3b82f6',
        strokeWidth: active ? 5 : 2,
        opacity: active ? 1 : 0.4
      }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: 'none' }}
    />
  );
}