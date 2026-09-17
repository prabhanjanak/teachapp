import confetti from 'canvas-confetti';
import type { DayOfWeek, PeriodType, TimetableSlot, WeeklyTimetable } from './types';

// Web Audio API harmonic chime (meditation / singing bowl tone)
export function playGentleChime(type: 'bell' | 'chime' | 'success' = 'chime') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = type === 'bell' ? 432 : type === 'success' ? 587.33 : 528;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    if (type === 'success') {
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    }

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === 'bell' ? 3.0 : 1.8));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (type === 'bell' ? 3.0 : 1.8));
  } catch {
    // Gracefully handle browser autoplay policies
  }
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#e85d82', '#ff9cb3', '#4ba677', '#4578a2', '#f6d1c8'],
    });
  } catch {
    // fallback
  }
}

export function triggerHearts() {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#e85d82', '#ff4d79', '#ff8fae', '#ffdbe4'],
      shapes: ['circle'],
    });
  } catch {
    // fallback
  }
}

export function getTodayDayCode(): DayOfWeek {
  const dayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  switch (dayIndex) {
    case 1: return 'MON';
    case 2: return 'TUES';
    case 3: return 'WED';
    case 4: return 'THUR';
    case 5: return 'FRI';
    case 6: return 'SAT';
    default: return 'MON'; // fallback for Sunday
  }
}

export function getCurrentAndNextClass(timetable: WeeklyTimetable): {
  isTodayTeachingDay: boolean;
  currentSlot: TimetableSlot | null;
  nextSlot: TimetableSlot | null;
  statusText: string;
} {
  const dayIndex = new Date().getDay();
  if (dayIndex === 0) {
    return {
      isTodayTeachingDay: false,
      currentSlot: null,
      nextSlot: null,
      statusText: 'Sunday · Rest & take care of yourself 🌸',
    };
  }

  const dayCode = getTodayDayCode();
  const slots = timetable[dayCode] || [];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentSlot: TimetableSlot | null = null;
  let nextSlot: TimetableSlot | null = null;

  for (const slot of slots) {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    const slotStartMin = startH * 60 + startM;
    const slotEndMin = endH * 60 + endM;

    if (currentMinutes >= slotStartMin && currentMinutes < slotEndMin) {
      currentSlot = slot;
    } else if (currentMinutes < slotStartMin && !nextSlot) {
      nextSlot = slot;
    }
  }

  let statusText = '';
  if (currentSlot) {
    if (currentSlot.type === 'lunch') {
      statusText = 'Currently: Lunch break ☕ Take time to eat!';
    } else if (currentSlot.type === 'free') {
      statusText = 'Currently: Free period · Preparation or tea breather';
    } else {
      statusText = `Currently in class: ${currentSlot.subject} (${currentSlot.time})${currentSlot.room ? ` · ${currentSlot.room}` : ''}`;
    }
  } else if (nextSlot) {
    statusText = `Next up: ${nextSlot.subject || 'Free Period'} at ${nextSlot.startTime}`;
  } else {
    statusText = 'All classes done for today! Time to relax, Preethi 🌸';
  }

  return {
    isTodayTeachingDay: true,
    currentSlot,
    nextSlot,
    statusText,
  };
}

export function formatTimeRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
