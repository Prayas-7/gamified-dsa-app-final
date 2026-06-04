import { LevelStage } from '../../types/game';

export const binarySearchLevelData: LevelStage[] = [
  {
    id: 'bs-intro',
    type: 'intro',
    title: 'Binary Search',
    content: 'Unlike Linear Search, Binary Search "divides and conquers." It jumps to the middle and eliminates half of the remaining elements in every step.',
    visualType: 'tree', 
  },
  {
    id: 'bs-puzzle-1',
    type: 'puzzle', 
    instruction: 'Find the value 72 using Binary Search logic.',
    // MUST BE SORTED
    initialState: [10, 22, 35, 47, 50, 61, 72, 88, 99],
    targetValue: 72,
    hint: 'Start at the middle index. Is 72 higher or lower than the middle?',
  },
  {
    id: 'bs-quiz-1',
    type: 'quiz',
    question: 'What is the time complexity of Binary Search?',
    options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
    correctAnswer: 'O(log N)',
  },
  {
    id: 'bs-summary',
    type: 'summary',
    xpReward: 200,
  }
];