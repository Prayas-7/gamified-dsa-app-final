import { LevelStage } from '../../types/game';

export const selectionSortLevelData: LevelStage[] = [
  {
    id: 'selection-intro',
    type: 'intro',
    title: 'Selection Sort',
    content: 'Selection Sort divides the array into a sorted and unsorted part. It repeatedly finds the smallest element from the unsorted part and swaps it with the first element of that part.',
    visualType: 'sequential-scan', // Uses the scanning visual we just built
  },
  {
    id: 'selection-puzzle-1',
    type: 'puzzle',
    instruction: 'Find the smallest bar and swap it with the first unsorted position.',
    initialState: [42, 12, 89, 25, 7], 
    targetValue: 'sorted',
  },
  {
    id: 'selection-summary',
    type: 'summary',
    xpReward: 250,
  }
];