import { create } from 'zustand';
import { LevelStage } from '../types/game';

interface LevelState {
  currentStageIndex: number;
  stages: LevelStage[];
  hearts: number;
  xpEarned: number;
  
  // Actions
  setStages: (stages: LevelStage[]) => void;
  nextStage: () => void;
  loseHeart: () => void;
  resetLevel: () => void;
}

export const useLevelStore = create<LevelState>((set, get) => ({
  currentStageIndex: 0,
  stages: [],
  hearts: 5,
  xpEarned: 0,

  setStages: (stages) => set({ stages, currentStageIndex: 0, xpEarned: 0, hearts: 5 }),
  
  nextStage: () => {
    const { currentStageIndex, stages } = get();
    if (currentStageIndex < stages.length - 1) {
      set({ currentStageIndex: currentStageIndex + 1 });
    }
  },

  loseHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  
  resetLevel: () => set({ currentStageIndex: 0, hearts: 5, xpEarned: 0 }),
}));