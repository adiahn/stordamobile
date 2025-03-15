import { create } from 'zustand';

interface PointsState {
  points: number;
  addPoints: (amount: number) => void;
  usePoints: (amount: number) => boolean; // Returns false if not enough points
}

export const usePointsStore = create<PointsState>((set, get) => ({
  points: 500, // Start with some points
  addPoints: (amount) => set((state) => ({ points: state.points + amount })),
  usePoints: (amount) => {
    const currentPoints = get().points;
    if (currentPoints >= amount) {
      set({ points: currentPoints - amount });
      return true;
    }
    return false;
  },
})); 