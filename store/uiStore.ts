import { create } from 'zustand';

interface UIStore {
  fabOpen: boolean;
  setFabOpen: (open: boolean) => void;
  undoTask: { id: string; title: string } | null;
  setUndoTask: (task: { id: string; title: string } | null) => void;
  // Флаг для роутинга: true = прошёл онбординг → tabs, false → welcome
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  fabOpen: false,
  setFabOpen: (open) => set({ fabOpen: open }),
  undoTask: null,
  setUndoTask: (task) => set({ undoTask: task }),
  hasCompletedOnboarding: false,
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
  logout: () => set({ hasCompletedOnboarding: false }),
}));
