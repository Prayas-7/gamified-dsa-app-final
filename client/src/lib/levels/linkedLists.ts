import { LevelStage } from '../../types/game';

export const linkedListLevelData: LevelStage[] = [
  // 1. Intro: The Concept
  {
    id: 'intro-ll',
    type: 'intro',
    title: 'The Chain of Nodes',
    content: 'Unlike arrays, Linked List nodes are not stored next to each other in memory. Each node holds a value and a "Pointer" (address) to the next node. If the pointer is broken, the list stops.',
    visualType: 'graph', // We will use this to trigger the node visualizer
  },
  // 2. The Puzzle: Fix the broken link
  {
    id: 'puzzle-ll-fix',
    type: 'puzzle', // We will detect this specific ID or add a 'subType' in logic
    instruction: 'The list is broken! Connect Node [B] to Node [C].',
    hint: 'Click the dot on Node B, then click Node C to create a link.',
    
    // Initial State: A->B and C->D are separate. B points to nothing (null).
    initialState: [
      { id: 'node-a', value: 'A', next: 'node-b' },
      { id: 'node-b', value: 'B', next: null },     
      { id: 'node-c', value: 'C', next: 'node-d' },
      { id: 'node-d', value: 'D', next: null },
    ],
    
    // Target: B must point to C
    targetState: [
      { id: 'node-a', value: 'A', next: 'node-b' },
      { id: 'node-b', value: 'B', next: 'node-c' },
      { id: 'node-c', value: 'C', next: 'node-d' },
      { id: 'node-d', value: 'D', next: null },
    ],
  },
  // 3. Quiz
  {
    id: 'quiz-ll',
    type: 'quiz',
    question: 'What is the "next" pointer of the very last node usually set to?',
    options: ['The Head', 'Null', 'The Previous Node', 'Random Address'],
    correctAnswer: 'Null',
  },
  // 4. Summary
  {
    id: 'summary-ll',
    type: 'summary',
    xpReward: 150,
  }
];