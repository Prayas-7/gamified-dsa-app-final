import { LevelStage } from '../../types/game';

export const linearSearchLevelData: LevelStage[] = [
  // Stage 1: Theory
  {
    id: 'ls-intro',
    type: 'intro',
    title: 'Linear Search Basics',
    content: 'Linear Search is the simplest searching algorithm. It starts at the beginning of a collection and checks every item one by one until it finds a match or reaches the end.',
    visualType: 'sequential-scan',
  },
  // Stage 2: Complexity Insight
  {
    id: 'ls-theory-2',
    type: 'intro',
    title: 'Time Complexity',
    content: 'In the worst-case scenario (if the item is at the very end or not there at all), you have to check all N elements. We call this O(N) time complexity.',
  },
  // Stage 3: The Interactive Puzzle
  {
    id: 'ls-puzzle-1',
    // Changed to algorithm-puzzle to match your master union type
    type: 'puzzle', 
    instruction: 'Find the hidden value: 42',
    initialState: [12, 5, 89, 42, 7, 33, 19], 
    targetValue: 42, 
    hint: 'Linear search is sequential. You cannot skip! Check index 0, then 1, then 2...',
  },
  // Stage 4: Logic Quiz
  {
    id: 'ls-quiz-1',
    type: 'quiz',
    question: 'What is the main requirement for performing a Linear Search?',
    options: [
      'The array must be sorted', 
      'The array must be unsorted', 
      'There are no requirements', 
      'The array must contain only integers'
    ],
    correctAnswer: 'There are no requirements',
  },

  // Stage 6: Completion
  {
    id: 'ls-summary',
    type: 'summary',
    xpReward: 150, 
  }
];