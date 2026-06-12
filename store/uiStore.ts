import { create } from 'zustand';

interface UIStore {
  fabOpen: boolean;
  setFabOpen: (open: boolean) => void;
  // undo-снекбар для complete_task (roll-forward)
  undoTask: { id: string; title: string } | null;
  setUndoTask: (task: { id: string; title: string } | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  fabOpen: false,
  setFabOpen: (open) => set({ fabOpen: open }),
  undoTask: null,
  setUndoTask: (task) => set({ undoTask: task }),
}));
