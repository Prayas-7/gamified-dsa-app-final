import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserState {
  username: string;
  xp: number;
  level: number;
  completedLevels: string[];
  
  // Actions
  setUser: (user: { username: string; xp: number; level?: number; completedLevels: string[] }) => void;
  updateProgress: (xp: number, levelId: string) => void;
  logout: () => void; // <--- ADDED THIS
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial State
      username: 'Guest',
      xp: 0,
      level: 1, 
      completedLevels: [],

      setUser: (user) => set({ 
        username: user.username, 
        xp: user.xp, 
        level: user.level || Math.floor(Math.sqrt(user.xp / 100)) + 1,
        completedLevels: user.completedLevels || [] 
      }),

      updateProgress: (newXp, levelId) => set((state) => {
        const updatedXp = state.xp + newXp;
        const newLevel = Math.floor(Math.sqrt(updatedXp / 100)) + 1;
        const isNew = !state.completedLevels.includes(levelId);
        
        return {
          xp: updatedXp,
          level: newLevel,
          completedLevels: isNew ? [...state.completedLevels, levelId] : state.completedLevels
        };
      }),

      
      logout: () => set({
        username: 'Guest',
        xp: 0,
        level: 1,
        completedLevels: []
      }),
    }),
    { name: 'gamified-dsa-user' }
  )
);