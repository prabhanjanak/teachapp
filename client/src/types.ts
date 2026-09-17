export type View =
  | 'dashboard'
  | 'timetable'
  | 'tasks'
  | 'syllabus'
  | 'desk'
  | 'notes'
  | 'break'
  | 'lovenotes'
  | 'analytics';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskCategory =
  | 'Teaching'
  | 'Correction'
  | 'Lab Work'
  | 'Admin'
  | 'Exam'
  | 'Personal';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}

export type TopicStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface SyllabusTopic {
  id: string;
  unitId: string;
  title: string;
  status: TopicStatus;
  notes?: string;
  completedAt?: string;
}

export interface SyllabusUnit {
  id: string;
  subjectId: string;
  unitNumber: number;
  name: string;
  topics: SyllabusTopic[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  room?: string;
  units: SyllabusUnit[];
}

export type PeriodType = 'class' | 'lab' | 'free' | 'lunch';

export interface TimetableSlot {
  time: string; // e.g. "9:00–10:00"
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
  subject: string; // e.g. "ID1", "LAB", "ID2", ""
  room?: string;
  type: PeriodType;
  notes?: string;
}

export type DayOfWeek = 'MON' | 'TUES' | 'WED' | 'THUR' | 'FRI' | 'SAT';

export type WeeklyTimetable = Record<DayOfWeek, TimetableSlot[]>;

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Teaching' | 'Lab Prep' | 'Ideas' | 'Personal' | 'Reminders';
  pinned: boolean;
  createdAt: string;
}

export interface LoveNote {
  id: string;
  from: 'Prabhanjan' | 'Dummu' | 'Baby';
  message: string;
  date?: string;
  favorited?: boolean;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  periodTime: string;
  className: string;
  totalPresent?: number;
  absentRolls: string;
  topicTaught?: string;
  notes?: string;
  createdAt: string;
}

export interface AppData {
  tasks: Task[];
  subjects: Subject[];
  timetable: WeeklyTimetable;
  notes: Note[];
  loveNotes: LoveNote[];
  attendanceLogs: AttendanceRecord[];
  lastActiveDate: string;
}
