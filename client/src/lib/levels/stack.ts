import { LevelStage } from '../../types/game';

export const stacksLevelData: LevelStage[] = [
  // Stage 1: Theory
  {
    id: 'intro-stack',
    type: 'intro',
    title: 'The Stack Data Structure',
    content: 'A Stack is a linear data structure that follows the LIFO principle: Last In, First Out. Imagine a stack of plates in a cafeteria; you can only take the top one off, and you must place new plates on top.',
    visualType: 'locker-row', // Reusing the simple visualizer for the abstract concept
  },
  


  // Stage 3: Construction Puzzle (The new StackPuzzle component)
  {
    id: 'puzzle-stack-build',
    type: 'puzzle',
    instruction: 'Build a stack where 5 is at the bottom and 15 is at the top.',
    
    // Items available in the "Bank" (scrambled)
    initialState: [10, 5, 15], 
    
    // The Goal Stack (Bottom -> Top)
    targetState: [5, 10, 15], 
    
    hint: 'Order matters! The first item you Push will settle at the bottom.',
  },

  // Stage 4: Assessment
  {
    id: 'quiz-stack',
    type: 'quiz',
    question: 'Which operation removes an element from the stack?',
    options: ['Enqueue', 'Push', 'Pop', 'Peek'],
    correctAnswer: 'Pop',
  },

  // Stage 5: Completion
  {
    id: 'summary-stack',
    type: 'summary',
    xpReward: 200,
  }
];