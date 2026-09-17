import type { AppData, DayOfWeek, LoveNote, Note, Subject, Task, TimetableSlot, WeeklyTimetable } from './types';

const STORAGE_KEY = 'preethi_teacher_companion_v2';
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

export const INITIAL_LOVE_NOTES: LoveNote[] = [
  {
    id: 'love-1',
    from: 'Prabhanjan',
    message: 'Good morning, Baby 💗 Whatever today brings, take it one class at a time. You are doing better than you think. Love you always.',
    favorited: true,
  },
  {
    id: 'love-2',
    from: 'Dummu',
    message: "Hey Baby 🌸 Drink some water, smile a little, and don't forget that someone is always cheering for you. Have a beautiful day. ❤️",
    favorited: true,
  },
  {
    id: 'love-3',
    from: 'Baby',
    message: "Hi Preethi 💕 Your only job today is to do your best, not to be perfect. I'm proud of you. Love you, Baby.",
    favorited: false,
  },
  {
    id: 'love-4',
    from: 'Prabhanjan',
    message: "A tiny reminder from your Dummu: you are loved, appreciated, and never alone. Go make your students' day brighter. 💗",
    favorited: true,
  },
  {
    id: 'love-5',
    from: 'Dummu',
    message: 'Good day, Preethi 🌷 Finish what matters, ignore the little chaos, and save a little smile for me. Love you.',
    favorited: false,
  },
  {
    id: 'love-6',
    from: 'Dummu',
    message: "To the most dedicated teacher and the prettiest girl ever: don't let anyone steal your peace today. Dummu is right here. ☕✨",
    favorited: true,
  },
  {
    id: 'love-7',
    from: 'Prabhanjan',
    message: 'Take a deep breath between periods, Preethi. You put your whole heart into everything you do, and that makes all the difference.',
    favorited: false,
  },
  {
    id: 'love-8',
    from: 'Baby',
    message: "Thinking of your sweet smile while you're teaching today. Can't wait to hear how your day went. Love you to pieces! 💗",
    favorited: true,
  },
];

export const INITIAL_TIMETABLE: WeeklyTimetable = {
  MON: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'LAB', type: 'lab', room: 'Physics Lab 1' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'LAB', type: 'lab', room: 'Physics Lab 1' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free', notes: 'Correction & prep time' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: 'ID1', type: 'class', room: 'Room 204' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch', notes: 'Eat peacefully 🍲' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: '', type: 'free', notes: 'Staff room / breather' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: '', type: 'free' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID2', type: 'class', room: 'Room 302' },
  ],
  TUES: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'ID1', type: 'class', room: 'Room 204' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: '', type: 'free' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: 'LAB', type: 'lab', room: 'Physics Lab 2' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: 'LAB', type: 'lab', room: 'Physics Lab 2' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'ID2', type: 'class', room: 'Room 302' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: '', type: 'free' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: '', type: 'free' },
  ],
  WED: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'ID1', type: 'class', room: 'Room 204' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'ID2', type: 'class', room: 'Room 302' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: '', type: 'free' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'LAB', type: 'lab', room: 'Physics Lab 1' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: 'LAB', type: 'lab', room: 'Physics Lab 1' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID2', type: 'class', room: 'Room 302' },
  ],
  THUR: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: '', type: 'free' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'ID2', type: 'class', room: 'Room 302' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: 'ID1', type: 'class', room: 'Room 204' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: '', type: 'free' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'ID1', type: 'class', room: 'Room 204' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: '', type: 'free' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: '', type: 'free' },
  ],
  FRI: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'LAB', type: 'lab', room: 'Physics Lab 1' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: 'LAB', type: 'lab', room: 'Physics Lab 1' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: '', type: 'free' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: 'LAB', type: 'lab', room: 'Physics Lab 2' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: 'LAB', type: 'lab', room: 'Physics Lab 2' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID2', type: 'class', room: 'Room 302' },
  ],
  SAT: [
    { time: '9:00–10:00', startTime: '09:00', endTime: '10:00', subject: 'ID2', type: 'class', room: 'Room 302' },
    { time: '10:00–11:00', startTime: '10:00', endTime: '11:00', subject: '', type: 'free' },
    { time: '11:00–12:00', startTime: '11:00', endTime: '12:00', subject: '', type: 'free' },
    { time: '12:00–1:00', startTime: '12:00', endTime: '13:00', subject: 'ID1', type: 'class', room: 'Room 204' },
    { time: '1:00–1:40', startTime: '13:00', endTime: '13:40', subject: 'Lunch break', type: 'lunch' },
    { time: '1:40–2:40', startTime: '13:40', endTime: '14:40', subject: '', type: 'free' },
    { time: '2:40–3:40', startTime: '14:40', endTime: '15:40', subject: 'ID2', type: 'class', room: 'Room 302' },
    { time: '3:40–4:40', startTime: '15:40', endTime: '16:40', subject: 'ID1', type: 'class', room: 'Room 204' },
  ],
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-id1',
    name: 'Class Section ID1',
    code: 'ID1',
    color: '#e85d82',
    room: 'Room 204',
    units: [
      {
        id: 'u-id1-1',
        subjectId: 'subj-id1',
        unitNumber: 1,
        name: 'Laws of Motion & Work Energy',
        topics: [
          { id: 't-1', unitId: 'u-id1-1', title: "Newton's Laws & Free Body Diagrams", status: 'Completed', notes: 'Derivations completed with examples' },
          { id: 't-2', unitId: 'u-id1-1', title: 'Friction on inclined planes & Circular Motion', status: 'Completed', notes: 'Numerical practice done' },
          { id: 't-3', unitId: 'u-id1-1', title: 'Work-Energy Theorem & Conservation of Energy', status: 'In Progress', notes: 'Explain conservative vs non-conservative forces' },
          { id: 't-4', unitId: 'u-id1-1', title: 'Collisions in One & Two Dimensions', status: 'Not Started' },
        ],
      },
      {
        id: 'u-id1-2',
        subjectId: 'subj-id1',
        unitNumber: 2,
        name: 'Gravitation & Satellite Motion',
        topics: [
          { id: 't-5', unitId: 'u-id1-2', title: "Kepler's Laws of Planetary Motion", status: 'Completed' },
          { id: 't-6', unitId: 'u-id1-2', title: 'Gravitational Potential & Field Intensity', status: 'In Progress' },
          { id: 't-7', unitId: 'u-id1-2', title: 'Escape Velocity & Geostationary Satellites', status: 'Not Started' },
        ],
      },
      {
        id: 'u-id1-3',
        subjectId: 'subj-id1',
        unitNumber: 3,
        name: 'Thermodynamics & Kinetic Theory',
        topics: [
          { id: 't-8', unitId: 'u-id1-3', title: 'Zeroth & First Law of Thermodynamics', status: 'Not Started' },
          { id: 't-9', unitId: 'u-id1-3', title: 'Carnot Engine & Second Law', status: 'Not Started' },
        ],
      },
    ],
  },
  {
    id: 'subj-id2',
    name: 'Class Section ID2',
    code: 'ID2',
    color: '#527da6',
    room: 'Room 302',
    units: [
      {
        id: 'u-id2-1',
        subjectId: 'subj-id2',
        unitNumber: 1,
        name: 'Electrostatics & Electric Potential',
        topics: [
          { id: 't-10', unitId: 'u-id2-1', title: "Coulomb's Law & Principle of Superposition", status: 'Completed' },
          { id: 't-11', unitId: 'u-id2-1', title: "Gauss's Law and its Applications", status: 'Completed', notes: 'Students did well in quiz' },
          { id: 't-12', unitId: 'u-id2-1', title: 'Capacitance & Dielectrics in Parallel Plates', status: 'In Progress' },
        ],
      },
      {
        id: 'u-id2-2',
        subjectId: 'subj-id2',
        unitNumber: 2,
        name: 'Current Electricity & Circuits',
        topics: [
          { id: 't-13', unitId: 'u-id2-2', title: "Ohm's Law, Drift Velocity & Mobility", status: 'Completed' },
          { id: 't-14', unitId: 'u-id2-2', title: "Kirchhoff's Rules & Wheatstone Bridge", status: 'In Progress', notes: 'Draw circuit diagrams neatly on board' },
          { id: 't-15', unitId: 'u-id2-2', title: 'Potentiometer: EMF Comparison & Internal Resistance', status: 'Not Started' },
        ],
      },
      {
        id: 'u-id2-3',
        subjectId: 'subj-id2',
        unitNumber: 3,
        name: 'Magnetic Effects of Current',
        topics: [
          { id: 't-16', unitId: 'u-id2-3', title: 'Biot-Savart Law & Circular Coil Field', status: 'Not Started' },
          { id: 't-17', unitId: 'u-id2-3', title: 'Cyclotron & Ampere Circuital Law', status: 'Not Started' },
        ],
      },
    ],
  },
  {
    id: 'subj-lab',
    name: 'Physics Practical Lab',
    code: 'LAB',
    color: '#4fa578',
    room: 'Physics Lab 1 & 2',
    units: [
      {
        id: 'u-lab-1',
        subjectId: 'subj-lab',
        unitNumber: 1,
        name: 'Core Experiments & Verification',
        topics: [
          { id: 't-18', unitId: 'u-lab-1', title: 'Simple Pendulum: Variation of L vs T^2', status: 'Completed', notes: 'Batch A & B verified' },
          { id: 't-19', unitId: 'u-lab-1', title: "Sonometer: AC Mains frequency determination", status: 'Completed' },
          { id: 't-20', unitId: 'u-lab-1', title: "Ohm's Law & Verification of Resistance Wire", status: 'In Progress', notes: 'Check rheostats' },
          { id: 't-21', unitId: 'u-lab-1', title: 'Focal length of Convex Lens by u-v method', status: 'In Progress' },
          { id: 't-22', unitId: 'u-lab-1', title: 'Refractive Index of Glass Prism (i-d curve)', status: 'Not Started' },
        ],
      },
    ],
  },
];

const todayIso = new Date().toISOString().slice(0, 10);

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: "Prepare Class Test question paper for ID1 (Rotational Motion)",
    category: 'Exam',
    priority: 'High',
    dueDate: todayIso,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Check and sign Physics practical records for Friday Batch',
    category: 'Lab Work',
    priority: 'Urgent',
    dueDate: todayIso,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Review Unit 2 numericals for ID2 class',
    category: 'Teaching',
    priority: 'Medium',
    dueDate: todayIso,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Update monthly student attendance register',
    category: 'Admin',
    priority: 'Low',
    dueDate: todayIso,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Drink warm water and take 5 mins to relax between periods 🌸',
    category: 'Personal',
    priority: 'High',
    dueDate: todayIso,
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Teaching spark: Start with real-life question',
    content: 'For next week\'s Gauss law intro, bring a small balloon and ask students about lines of force penetrating the surface. Makes the concept crystal clear!',
    category: 'Ideas',
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
    category: 'Teaching',
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
    loveNotes: INITIAL_LOVE_NOTES,
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
    // Ensure all required top-level collections exist
    return {
      tasks: parsed.tasks ?? INITIAL_TASKS,
      subjects: parsed.subjects ?? INITIAL_SUBJECTS,
      timetable: parsed.timetable ?? INITIAL_TIMETABLE,
      notes: parsed.notes ?? INITIAL_NOTES,
      loveNotes: parsed.loveNotes && parsed.loveNotes.length ? parsed.loveNotes : INITIAL_LOVE_NOTES,
      attendanceLogs: parsed.attendanceLogs ?? [],
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
