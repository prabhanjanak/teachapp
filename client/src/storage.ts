import type { AppData, DayOfWeek, LoveNote, Note, Subject, Task, TimetableSlot, WeeklyTimetable } from './types';

const STORAGE_KEY = 'preethi_teacher_companion_v4';
const AUTH_KEY = 'preethi_auth_session';

export const SLOTS_METADATA: { time: string; start: string; end: string; isLunch?: boolean }[] = [
  { time: '9:00–10:00', start: '09:00', end: '10:00' },
  { time: '10:00–11:00', start: '10:00', end: '11:00' },
  { time: '11:00–12:00', start: '11:00', end: '12:00' },
  { time: '12:00–1:00', start: '12:00', end: '13:00' },
  { time: '1:00–1:40', start: '13:00', end: '13:40', isLunch: true },
  { time: '1:40–2:40', start: '13:40', end: '14:40' },
  { time: '2:40–3:40', start: '14:40', end: '15:40' },
  { time: '3:40–4:40', start: '15:40', end: '16:40' },
];

export const INITIAL_LOVE_NOTES: LoveNote[] = [];

export const INITIAL_TIMETABLE: WeeklyTimetable = {
  MON: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'LAB', type: 'lab' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'LAB', type: 'lab' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: 'ID1', type: 'class' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: '', type: 'free' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: '', type: 'free' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID2', type: 'class' },
  ],
  TUES: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'ID1', type: 'class' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: '', type: 'free' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: 'LAB', type: 'lab' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: 'LAB', type: 'lab' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'ID2', type: 'class' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: '', type: 'free' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: '', type: 'free' },
  ],
  WED: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'ID1', type: 'class' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'ID2', type: 'class' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: '', type: 'free' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'LAB', type: 'lab' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: 'LAB', type: 'lab' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID2', type: 'class' },
  ],
  THUR: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: '', type: 'free' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'ID2', type: 'class' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: 'ID1', type: 'class' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: '', type: 'free' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'ID1', type: 'class' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: '', type: 'free' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: '', type: 'free' },
  ],
  FRI: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'LAB', type: 'lab' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'LAB', type: 'lab' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: '', type: 'free' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'LAB', type: 'lab' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: 'LAB', type: 'lab' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID2', type: 'class' },
  ],
  SAT: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'ID2', type: 'class' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: '', type: 'free' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: 'ID1', type: 'class' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: '', type: 'free' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: 'ID2', type: 'class' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID1', type: 'class' },
  ],
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-id1',
    name: 'Class Section ID1',
    code: 'ID1',
    color: '#e85d82',
    units: [],
  },
  {
    id: 'subj-id2',
    name: 'Class Section ID2',
    code: 'ID2',
    color: '#527da6',
    units: [],
  },
  {
    id: 'subj-lab',
    name: 'Physics Practical Lab',
    code: 'LAB',
    color: '#4fa578',
    units: [],
  },
];

const todayIso = new Date().toISOString().slice(0, 10);

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Teaching spark: Start with real-life question',
    content: "For next week's Gauss law intro, bring a small balloon and ask students about lines of force penetrating the surface. Makes the concept crystal clear!",
    category: 'Teaching',
    pinned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Lab items needing replacement',
    content: 'Need 2 new connecting wire spools and 1 galvanometer with needle zero adjustment for Lab 1 table 3.',
    category: 'Lab Prep',
    pinned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-3',
    title: 'Staff Meeting reminders',
    content: 'Mid-term question papers submission due next Tuesday. Portions to cover before exams: Units 1, 2, and 3.',
    category: 'Reminders',
    pinned: false,
    createdAt: new Date().toISOString(),
  },
];

export function getInitialData(): AppData {
  return {
    tasks: INITIAL_TASKS,
    subjects: INITIAL_SUBJECTS,
    timetable: INITIAL_TIMETABLE,
    notes: INITIAL_NOTES,
    loveNotes: [],
    attendanceLogs: [],
    lastActiveDate: todayIso,
  };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      saveAppData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppData;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      subjects: Array.isArray(parsed.subjects) && parsed.subjects.length ? parsed.subjects : INITIAL_SUBJECTS,
      timetable: parsed.timetable ?? INITIAL_TIMETABLE,
      notes: Array.isArray(parsed.notes) && parsed.notes.length ? parsed.notes : INITIAL_NOTES,
      loveNotes: [],
      attendanceLogs: [],
      lastActiveDate: parsed.lastActiveDate ?? todayIso,
    };
  } catch (err) {
    console.error('Error loading app data, using default:', err);
    return getInitialData();
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function exportDataAsJson(data: AppData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `preethi-teacher-companion-backup-${todayIso}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromJson(jsonString: string): AppData | null {
  try {
    const parsed = JSON.parse(jsonString) as AppData;
    if (!parsed.tasks || !parsed.subjects || !parsed.timetable) {
      throw new Error('Invalid file structure');
    }
    saveAppData(parsed);
    return parsed;
  } catch (err) {
    console.error('Failed to parse backup file:', err);
    return null;
  }
}

export function getAuthSession(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

export function setAuthSession(token: string): void {
  localStorage.setItem(AUTH_KEY, token);
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_KEY);
}
