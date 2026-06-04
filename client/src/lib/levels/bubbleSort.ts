import { LevelStage } from '../../types/game';

export const bubbleSortLevelData: LevelStage[] = [
  {
    id: 'bubble-intro',
    type: 'intro',
    title: 'Bubble Sort',
    content: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.',
    visualType: 'locker-row', 
  },
  {
    id: 'bubble-puzzle-1',
    type: 'puzzle',
    instruction: 'Sort the array in ascending order by swapping adjacent bars.',
    initialState: [65, 30, 85, 15, 45], // Unsorted
    targetValue: 'sorted', // We'll check if the array matches its sorted version
  },
  {
    id: 'bubble-summary',
    type: 'summary',
    xpReward: 250,
  }
];