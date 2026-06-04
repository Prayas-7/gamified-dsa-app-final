import { LevelStage } from '../../types/game';

export const arrayLevelData: LevelStage[] = [
  // Stage 1: Theory
  {
    id: 'intro-1',
    type: 'intro',
    title: 'What is an Array?',
    content: 'An array is a collection of items stored at contiguous memory locations. Think of it like a row of lockers, where each locker has a unique number (index) starting at 0.',
    visualType: 'locker-row',
  },
  // Stage 2: Interaction (Click Puzzle)
  {
    id: 'puzzle-1',
    type: 'puzzle',
    instruction: 'Click on the element at Index 2.',
    initialState: ['🍎', '🍌', '🍇', '🍊'], 
    correctAnswer: 2, // Index 2 is Grapes
    hint: 'Remember, the first element is Index 0!',
  },
  // Stage 3: Assessment
  {
    id: 'quiz-1',
    type: 'quiz',
    question: 'If an array has 5 elements, what is the index of the last element?',
    options: ['5', '4', '0', 'Unknown'],
    correctAnswer: '4',
  },
                      
  // Stage 5: Completion
  {
    id: 'summary-1',
    type: 'summary',
    xpReward: 100,
  }
];