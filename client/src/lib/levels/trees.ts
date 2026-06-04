import { LevelStage } from '../../types/game';

export const treeLevelData: LevelStage[] = [
  // Stage 1: Theory
  {
    id: 'tree-intro-1',
    type: 'intro',
    title: 'The Binary Tree Structure',
    content: 'A Binary Tree is a hierarchical data structure where each node has at most two children, referred to as the left child and the right child. The top-most node is called the Root.',
    visualType: 'tree',
  },


  // Stage 3: Assessment (Quiz)
  {
    id: 'tree-quiz-1',
    type: 'quiz',
    question: 'What is a "Leaf" node in a Binary Tree?',
    options: [
      'The top-most node',
      'A node with exactly two children',
      'A node with no children',
      'The connection between two nodes'
    ],
    correctAnswer: 'A node with no children',
  },

  // Stage 4: Logical Challenge (BST Property)
  // This uses the 'algorithm-puzzle' type to trigger the BST logic we built
  {
    id: 'tree-puzzle-algo',
    type: 'algorithm-puzzle',
    instruction: 'Navigate the Binary Search Tree to find the target value.',
    targetValue: 7,
    initialState: [
      { id: 'r', value: 10, left: 'l1', right: 'r1' },
    { id: 'l1', value: 5, left: 'l2', right: 'r2' },
    { id: 'r1', value: 15 },
    { id: 'l2', value: 2 },
    { id: 'r2', value: 7 },
    ],
    hint: 'If the target is smaller than the current node, go left. If it is larger, go right!',
  },

  // Stage 5: Completion
  {
    id: 'tree-summary-1',
    type: 'summary',
    xpReward: 150,
  }
];