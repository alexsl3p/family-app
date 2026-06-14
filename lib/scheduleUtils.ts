import { ScheduleSlot } from '@/store/scheduleStore';

export function getCurrentStatus(slots: ScheduleSlot[], now: Date = new Date()): string | null {
  const jsDay = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1; // 0=Mon...6=Sun
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const slot of slots) {
    if (!slot.days.includes(dayIndex)) continue;
    const [sh, sm] = slot.startTime.split(':').map(Number);
    const [eh, em] = slot.endTime.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (currentMinutes >= start && currentMinutes < end) {
      return slot.label;
    }
  }
  return null;
}

export const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const SCHEDULE_PRESETS = [
  { type: 'work'   as const, label: 'На работе',    icon: 'briefcase-outline'  as const, color: '#60A5FA' },
  { type: 'school' as const, label: 'В школе',      icon: 'school-outline'     as const, color: '#4ADE80' },
  { type: 'other'  as const, label: 'На тренировке',icon: 'barbell-outline'    as const, color: '#C084FC' },
];
