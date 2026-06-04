import { LevelStage } from '../../types/game';

export const hashTableLevelData: LevelStage[] = [
  // STAGE 1: Concept
  {
    id: 'hash-intro-1',
    type: 'intro',
    title: 'Hash Tables',
    content: 'A Hash Table is like a library with a super-fast index. It maps "Keys" (like a name) to "Values" (like a phone number) using a special mathematical function.',
    visualType: 'locker-row', 
  },
  // STAGE 2: The Hash Function
  {
    id: 'hash-intro-2',
    type: 'intro',
    title: 'The Hash Function',
    content: 'The "Magic" happens in the Hash Function. It takes any input and turns it into a fixed number. This number tells the computer exactly which "Bucket" to look in.',
    visualType: 'sequential-scan', 
  },
  // STAGE 3: Modulo Arithmetic
  {
    id: 'hash-intro-3',
    type: 'intro',
    title: 'Modulo Magic',
    content: 'Most hash tables use the Modulo (%) operator. If we have 5 buckets, the function (Value % 5) ensures the result is always between 0 and 4.',
    visualType: 'locker-row',
  },
  // STAGE 4: Quiz (Check-in)
  {
    id: 'hash-quiz-1',
    type: 'quiz',
    question: 'Using the function Index = Key % 10, where would Key 25 be stored?',
    options: ['Index 2', 'Index 5', 'Index 0', 'Index 10'],
    correctAnswer: 'Index 5',
  },
  // STAGE 5: Puzzle (Manual Mapping)
  {
    id: 'hash-puzzle-1',
    type: 'puzzle',
    instruction: 'Store the value 13 in the correct bucket using Index = Key % 5.',
    initialState: [0, 1, 2, 3, 4],
    targetValue: 3, // 13 % 5 = 3
    hint: 'Divide 13 by 5. The remainder is your target index!',
  },
  // STAGE 6: Efficiency
  {
    id: 'hash-intro-4',
    type: 'intro',
    title: 'Constant Time Access',
    content: 'Unlike Arrays where you might search every item, Hash Tables give you O(1) time complexity. You go straight to the data without searching!',
    visualType: 'locker-row',
  },
  // STAGE 7: Collisions Intro
  {
    id: 'hash-intro-5',
    type: 'intro',
    title: 'What is a Collision?',
    content: 'Sometimes two different keys result in the same index (e.g., 5 % 5 and 10 % 5 both equal 0). This is called a Collision.',
    visualType: 'graph',
  },
  // STAGE 8: Chaining (Linked Lists)
  {
    id: 'hash-intro-6',
    type: 'intro',
    title: 'Handling Collisions',
    content: 'One way to fix collisions is "Chaining." We turn each bucket into a Linked List. If two items land in the same spot, they just link together!',
    visualType: 'graph',
  },
  // STAGE 9: Collision Puzzle
  {
    id: 'hash-puzzle-2',
    type: 'puzzle',
    instruction: 'A collision occurred at Index 0. Link the new node "10" to the existing node "5".',
    initialState: [
      { id: 'node-5', value: '5', next: null },
      { id: 'node-10', value: '10', next: null }
    ],
    targetState: [
      { id: 'node-5', value: '5', next: 'node-10' },
      { id: 'node-10', value: '10', next: null }
    ],
  },
  // STAGE 10: Final Quiz
  {
    id: 'hash-quiz-2',
    type: 'quiz',
    question: 'In a perfect world with no collisions, what is the search time for a Hash Table?',
    options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
    correctAnswer: 'O(1)',
  },
  // STAGE 11: Summary
  {
    id: 'hash-summary',
    type: 'summary',
    xpReward: 300,
  }
];