import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScheduleSlot {
  id: string;
  type: 'work' | 'school' | 'other';
  label: string;
  color: string;
  days: number[]; // 0=Mon, 1=Tue, ..., 6=Sun
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

interface ScheduleState {
  schedules: Record<string, ScheduleSlot[]>; // memberId -> slots
  addSlot: (memberId: string, slot: ScheduleSlot) => void;
  removeSlot: (memberId: string, slotId: string) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      schedules: {},
      addSlot: (memberId, slot) =>
        set((s) => ({
          schedules: {
            ...s.schedules,
            [memberId]: [...(s.schedules[memberId] ?? []), slot],
          },
        })),
      removeSlot: (memberId, slotId) =>
        set((s) => ({
          schedules: {
            ...s.schedules,
            [memberId]: (s.schedules[memberId] ?? []).filter((sl) => sl.id !== slotId),
          },
        })),
    }),
    {
      name: 'schedule-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
