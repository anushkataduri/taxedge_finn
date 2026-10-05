import { create } from "zustand";

interface RevisedProgressStore {
  maxStepReached: number;
  setMaxStepReached: (step: number) => void;
  reset: () => void;
}

export const useRevisedProgressStore = create<RevisedProgressStore>((set) => ({
  maxStepReached: 1,
  setMaxStepReached: (step) =>
    set((state) => ({ maxStepReached: Math.max(state.maxStepReached, step) })),
  reset: () => set({ maxStepReached: 1 }),
}));

