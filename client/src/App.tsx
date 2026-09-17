import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  Archive,
  ArrowRight,
  Atom,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  Clock3,
  Copy,
  Download,
  FileText,
  FlaskConical,
  Gamepad2,
  Heart,
  Home,
  LogOut,
  Menu,
  NotebookPen,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Target,
  Trash2,
  Upload,
  UserCheck,
  X
} from 'lucide-react';
import {
  clearAuthSession,
  exportDataAsJson,
  getAuthSession,
  importDataFromJson,
  loadAppData,
  saveAppData,
  setAuthSession,
  SLOTS_METADATA
} from './storage';
import type {
  AppData,
  AttendanceRecord,
  DayOfWeek,
  Note,
  Priority,
  Subject,
  SyllabusTopic,
  SyllabusUnit,
  Task,
  TaskCategory,
  TimetableSlot,
  TopicStatus,
  View
} from './types';
import {
  formatTimeRemaining,
  getCurrentAndNextClass,
  getTodayDayCode,
  playGentleChime,
  triggerConfetti,
  triggerHearts,
  triggerScreenHeartsExplosion
} from './utils';
import { getRandomPreethiQuote } from './quotes';

export default function App() {
  const [token, setToken] = useState<string | null>(() => getAuthSession());
  const [view, setView] = useState<View>('dashboard');
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [mobileNav, setMobileNav] = useState(false);
  const [pushQuote, setPushQuote] = useState<string>(() => getRandomPreethiQuote());
  const [showHeartsCelebration, setShowHeartsCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  const updateData = (updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const handleLogin = (newToken: string) => {
    setAuthSession(newToken);
    setToken(newToken);
    const freshQuote = getRandomPreethiQuote(pushQuote);
    setPushQuote(freshQuote);
    setShowHeartsCelebration(true);
    triggerScreenHeartsExplosion();
    playGentleChime('success');
    showToast('Welcome back, Preethi 💗');
  };

  const handleLogout = () => {
    clearAuthSession();
    setToken(null);
  };

  // Push quote picker (cycles through 100 curated quotes with full screen hearts explosion)
  const pickNewPushQuote = () => {
    const next = getRandomPreethiQuote(pushQuote);
    setPushQuote(next);
    triggerScreenHeartsExplosion();
    showToast('New love quote for you, Preethi 💗');
  };

  if (!token) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        view={view}
        setView={(v) => {
          setView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
        onExport={() => exportDataAsJson(data)}
        onImport={(json) => {
          const res = importDataFromJson(json);
          if (res) {
            setData(res);
            showToast('Backup restored successfully! ✨');
          } else {
            showToast('Could not parse backup file.');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Mobile Header */}
        <header className="mobile-header">
          <button
            className="icon-button"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="mobile-brand">Preethi's Companion</span>
          <button
            className="icon-button"
            onClick={pickNewPushQuote}
            title="Surprise love quote"
          >
            <Heart size={18} fill="var(--rose)" color="var(--rose)" />
          </button>
        </header>

        {mobileNav && (
          <div className="mobile-nav-panel">
            <Sidebar
              view={view}
              setView={(v) => {
                setView(v);
                setMobileNav(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={handleLogout}
              onExport={() => exportDataAsJson(data)}
              onImport={(json) => {
                const res = importDataFromJson(json);
                if (res) {
                  setData(res);
                  setMobileNav(false);
                  showToast('Backup restored! ✨');
                }
              }}
            />
          </div>
        )}

        {/* View Switcher */}
        {view === 'dashboard' && (
          <DashboardView
            data={data}
            pushQuote={pushQuote}
            onPickPushQuote={pickNewPushQuote}
            setView={setView}
            updateData={updateData}
            showToast={showToast}
          />
        )}

        {view === 'timetable' && (
          <TimetableView
            timetable={data.timetable}
            onUpdateTimetable={(newTt) => updateData((prev) => ({ ...prev, timetable: newTt }))}
            showToast={showToast}
          />
        )}

        {view === 'syllabus' && (
          <SyllabusView
            subjects={data.subjects}
            onUpdateSubjects={(newSubs) => updateData((prev) => ({ ...prev, subjects: newSubs }))}
            showToast={showToast}
          />
        )}

        {view === 'tasks' && (
          <TasksView
            tasks={data.tasks}
            onUpdateTasks={(newTasks) => updateData((prev) => ({ ...prev, tasks: newTasks }))}
            showToast={showToast}
          />
        )}

        {view === 'notes' && (
          <QuickNotesView
            notes={data.notes}
            onUpdateNotes={(newNotes) => updateData((prev) => ({ ...prev, notes: newNotes }))}
            showToast={showToast}
          />
        )}

        {view === 'break' && <BreakView showToast={showToast} />}

        {view === 'analytics' && <AnalyticsView data={data} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        {[
          ['dashboard', Home, 'Home'],
          ['timetable', CalendarDays, 'Timetable'],
          ['tasks', ClipboardList, 'Tasks'],
          ['syllabus', BookOpen, 'Portions'],
          ['desk', Bell, 'Desk'],
          ['notes', NotebookPen, 'Notes'],
        ].map(([key, Icon, label]) => (
          <button
            key={key as string}
            className={view === key ? 'active' : ''}
            onClick={() => {
              setView(key as View);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Icon size={18} />
            <span>{label as string}</span>
          </button>
        ))}
      </nav>

      {/* Hearts Celebration & One-line Push Quote Fullscreen Overlay */}
      {showHeartsCelebration && (
        <HeartsCelebrationOverlay
          quote={pushQuote}
          onNextQuote={pickNewPushQuote}
          onClose={() => setShowHeartsCelebration(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            background: 'var(--sidebar-bg)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 100,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <span>✨</span> {toastMessage}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Sidebar Component
   ========================================================================== */

function Sidebar({
  view,
  setView,
  onLogout,
  onExport,
  onImport,
}: {
  view: View;
  setView: (view: View) => void;
  onLogout: () => void;
  onExport: () => void;
  onImport: (json: string) => void;
}) {
  const items: [View, typeof Home, string, string?][] = [
    ['dashboard', Home, 'Dashboard'],
    ['timetable', CalendarDays, 'Timetable', 'Mon–Sat'],
    ['tasks', ClipboardList, 'Tasks & Planner'],
    ['syllabus', BookOpen, 'Syllabus & Portions'],
    ['notes', NotebookPen, 'Quick Notes'],
    ['break', Gamepad2, 'Take a Break', 'Relax'],
    ['analytics', BarChart3, 'Weekly Pulse'],
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onImport(content);
    };
    reader.readAsText(file);
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Atom size={20} />
        </div>
        <div className="brand-text">
          <strong>Preethi's Lab</strong>
          <span>Teacher Companion</span>
        </div>
      </div>

      <div className="sidebar-label">Teaching Desk</div>
      <div className="nav-list">
        {items.map(([key, Icon, label, badge]) => (
          <button
            key={key}
            className={view === key ? 'active' : ''}
            onClick={() => setView(key)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
            {view === key && <ChevronRight size={14} className="nav-arrow" />}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="mini-note">
          <FlaskConical size={16} />
          <span>Teach, inspire, and smile. Dummu is always proud of you. 🌸</span>
        </div>

        <div className="sidebar-actions">
          <button className="backup-button" onClick={onExport} title="Download data backup">
            <Download size={13} /> Backup
          </button>
          <label className="backup-button" style={{ cursor: 'pointer' }} title="Import backup file">
            <Upload size={13} /> Restore
            <input type="file" accept=".json" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <button className="logout-button" onClick={onLogout} title="Sign out">
            <LogOut size={13} /> Exit
          </button>
        </div>

        <small>Made with all my heart for Preethi 💗</small>
      </div>
    </aside>
  );
}

/* ==========================================================================
   Dashboard View
   ========================================================================== */

function DashboardView({
  data,
  pushQuote,
  onPickPushQuote,
  setView,
  updateData,
  showToast,
}: {
  data: AppData;
  pushQuote: string;
  onPickPushQuote: () => void;
  setView: (v: View) => void;
  updateData: (updater: (prev: AppData) => AppData) => void;
  showToast: (msg: string) => void;
}) {
  const [quickTitle, setQuickTitle] = useState('');

  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12
      ? 'Good morning, Preethi 🌸'
      : hours < 17
      ? 'Good afternoon, Preethi ☀️'
      : 'Good evening, Preethi 🌙';

  const dateString = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const pendingTasks = data.tasks.filter((t) => !t.completed);
  const completedTasks = data.tasks.filter((t) => t.completed);

  // Overall syllabus stats
  let totalTopics = 0;
  let completedTopics = 0;
  data.subjects.forEach((s) => {
    s.units.forEach((u) => {
      u.topics.forEach((t) => {
        totalTopics++;
        if (t.status === 'Completed') completedTopics++;
      });
    });
  });
  const syllabusPct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Today's classes count
  const todayCode = getTodayDayCode();
  const todaySlots = data.timetable[todayCode] || [];
  const teachingSlots = todaySlots.filter((s) => s.type === 'class' || s.type === 'lab');

  // Live class status
  const pulse = getCurrentAndNextClass(data.timetable);

  const toggleTask = (taskId: string) => {
    updateData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            triggerConfetti();
            playGentleChime('success');
            showToast('Task completed! Great job! 🎉');
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      }),
    }));
  };

  const addQuickTask = (e: FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: quickTitle.trim(),
      category: 'Teaching',
      priority: 'Medium',
      dueDate: new Date().toISOString().slice(0, 10),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    updateData((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    setQuickTitle('');
    showToast('Task added to your list! 📝');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <Sparkles size={13} /> {dateString}
          </div>
          <h2>{greeting}</h2>
          <p>A calm space for your lessons, students, and peaceful momentum.</p>
        </div>
        <div className="header-actions">
          <button className="round-action" onClick={() => setView('tasks')}>
            <Plus size={16} /> <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Hero Section: Push Quote + Stats */}
      <div className="dashboard-hero">
        <section className="love-card-hero">
          <div className="love-top">
            <span className="love-tag">
              <Heart size={12} fill="currentColor" /> Daily Push Quote
            </span>
            <button
              className="surprise-button"
              onClick={onPickPushQuote}
              title="Get another quote from the 100 quotes"
            >
              <RefreshCw size={12} /> Another quote 💗
            </button>
          </div>
          <div className="love-quote">“{pushQuote}”</div>
          <div className="love-bottom">
            <small>Cheering for you today & always</small>
            <strong>With endless love, Dummu 💕</strong>
          </div>
        </section>

        <div className="stat-grid">
          <div className="stat-card rose">
            <div className="stat-icon">
              <Target size={18} />
            </div>
            <span>To Focus</span>
            <strong>{pendingTasks.length}</strong>
            <small>pending tasks today</small>
          </div>
          <div className="stat-card mint">
            <div className="stat-icon">
              <CheckCircle2 size={18} />
            </div>
            <span>Finished</span>
            <strong>{completedTasks.length}</strong>
            <small>tasks checked off</small>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">
              <BookOpen size={18} />
            </div>
            <span>Syllabus</span>
            <strong>{syllabusPct}%</strong>
            <small>{completedTopics} of {totalTopics} topics done</small>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon">
              <Clock3 size={18} />
            </div>
            <span>Today's Classes</span>
            <strong>{teachingSlots.length}</strong>
            <small>periods scheduled</small>
          </div>
        </div>
      </div>

      {/* Live Class Pulse Banner */}
      <section className="pulse-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span className={`pulse-badge ${pulse.currentSlot ? 'active' : 'break'}`}>
            <span className="pulse-dot" />
            {pulse.currentSlot ? 'Active Period' : 'Schedule Pulse'}
          </span>
          <div className="pulse-info">
            <strong>{pulse.statusText}</strong>
            <span>
              Today is {todayCode} · {teachingSlots.length} teaching sessions planned
            </span>
          </div>
        </div>
        <div className="quick-tools-row">
          <button className="quick-tool-btn" onClick={() => setView('notes')}>
            <NotebookPen size={14} /> Quick Notes
          </button>
          <button className="quick-tool-btn" onClick={() => setView('timetable')}>
            <Calendar size={14} /> Timetable
          </button>
          <button className="quick-tool-btn" onClick={() => setView('break')}>
            <Gamepad2 size={14} /> 2m Break
          </button>
        </div>
      </section>

      {/* Two Column Layout: Today's Tasks & Today's Schedule */}
      <div className="columns-two">
        {/* Today's Tasks */}
        <section className="panel">
          <div className="section-heading">
            <h3>Today's Focus Tasks</h3>
            <button className="text-button" onClick={() => setView('tasks')}>
              All Tasks <ChevronRight size={14} />
            </button>
          </div>

          <form onSubmit={addQuickTask} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              className="styled-input"
              placeholder="Add a quick task for today..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
            />
            <button className="primary-button" type="submit">
              Add
            </button>
          </form>

          <div style={{ display: 'grid', gap: '4px' }}>
            {data.tasks.slice(0, 4).map((task) => (
              <div className="task-row" key={task.id}>
                <button
                  className={`task-check-btn ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  aria-label="Toggle task completion"
                >
                  <Check size={14} />
                </button>
                <div className="task-details">
                  <div className={`task-title ${task.completed ? 'done' : ''}`}>{task.title}</div>
                  <div className="task-meta">
                    <span className="badge-tag cat">{task.category}</span>
                    <span className={`badge-tag ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {data.tasks.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: '13px', padding: '12px 0' }}>
                No tasks yet. Take a gentle breath! 🌷
              </p>
            )}
          </div>
        </section>

        {/* Today's Period Schedule */}
        <section className="panel">
          <div className="section-heading">
            <h3>Today's Schedule ({todayCode})</h3>
            <button className="text-button" onClick={() => setView('timetable')}>
              Full Week <ChevronRight size={14} />
            </button>
          </div>

          <div className="schedule-preview">
            {todaySlots.map((slot, i) => {
              const isCurrent =
                pulse.currentSlot?.time === slot.time && pulse.currentSlot?.subject === slot.subject;
              return (
                <div
                  key={i}
                  className={`schedule-row-item ${isCurrent ? 'current-slot' : ''}`}
                >
                  <span className="slot-time">{slot.time}</span>
                  <strong>{slot.subject || 'Free / Prep period'}</strong>
                  <span
                    className={`slot-badge ${
                      slot.type === 'lab'
                        ? 'lab'
                        : slot.subject === 'ID1'
                        ? 'class-id1'
                        : slot.subject === 'ID2'
                        ? 'class-id2'
                        : slot.type === 'lunch'
                        ? 'lunch'
                        : 'free'
                    }`}
                  >
                    {slot.type === 'lab'
                      ? '🧪 LAB'
                      : slot.subject === 'ID1'
                      ? '📘 ID1'
                      : slot.subject === 'ID2'
                      ? '📙 ID2'
                      : slot.type === 'lunch'
                      ? '☕ Lunch'
                      : '— Free'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Syllabus Pulse */}
      <section className="panel syllabus-overview-panel">
        <div className="section-heading">
          <div>
            <h3>Syllabus Progress Tracker</h3>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Keep tabs on what has been taught and what comes next
            </span>
          </div>
          <button className="text-button" onClick={() => setView('syllabus')}>
            Manage Portions <ChevronRight size={14} />
          </button>
        </div>

        <div className="subjects-row">
          {data.subjects.map((sub) => {
            let subTotal = 0;
            let subDone = 0;
            sub.units.forEach((u) => {
              u.topics.forEach((t) => {
                subTotal++;
                if (t.status === 'Completed') subDone++;
              });
            });
            const pct = subTotal ? Math.round((subDone / subTotal) * 100) : 0;
            return (
              <div className="subject-item" key={sub.id}>
                <div className="subject-item-header">
                  <div className="subject-name">
                    <span className="subject-dot" style={{ background: sub.color }} />
                    {sub.name}
                  </div>
                  <strong style={{ fontSize: '14px' }}>{pct}%</strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: sub.color }}
                  />
                </div>
                <div className="subject-stats-text">
                  <span>{subDone} of {subTotal} topics covered</span>
                  <span>{sub.units.length} units</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   Timetable View (Monday – Saturday Recreated from Image)
   ========================================================================== */

function TimetableView({
  timetable,
  onUpdateTimetable,
  showToast,
}: {
  timetable: Record<DayOfWeek, TimetableSlot[]>;
  onUpdateTimetable: (tt: Record<DayOfWeek, TimetableSlot[]>) => void;
  showToast: (msg: string) => void;
}) {
  const days: DayOfWeek[] = ['MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];
  const todayCode = getTodayDayCode();
  const [activeDay, setActiveDay] = useState<DayOfWeek>(todayCode);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const slots = timetable[activeDay] || [];
  const pulse = getCurrentAndNextClass(timetable);

  return (
    <div className="timetable-container">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <CalendarDays size={14} /> Official Weekly Schedule
          </div>
          <h2>Teaching Timetable</h2>
          <p>Recreated accurately from your schedule. Lunch is 1:00 PM – 1:40 PM.</p>
        </div>
        <div className="view-toggle-btns">
          <button
            className={viewMode === 'day' ? 'active' : ''}
            onClick={() => setViewMode('day')}
          >
            Day View
          </button>
          <button
            className={viewMode === 'week' ? 'active' : ''}
            onClick={() => setViewMode('week')}
          >
            Full Week Grid
          </button>
        </div>
      </div>

      {viewMode === 'day' ? (
        <>
          {/* Day selection tabs */}
          <div className="day-tabs-bar">
            {days.map((day) => (
              <button
                key={day}
                className={`day-tab-btn ${activeDay === day ? 'active' : ''}`}
                onClick={() => setActiveDay(day)}
              >
                {day === todayCode ? `📍 ${day} (Today)` : day}
              </button>
            ))}
          </div>

          <div className="timetable-day-card">
            <div className="section-heading" style={{ marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '22px' }}>{activeDay} Classes</h3>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {slots.filter((s) => s.type === 'class' || s.type === 'lab').length} teaching
                  periods on this day
                </span>
              </div>
              {activeDay === todayCode && (
                <span className="badge-tag" style={{ background: 'var(--rose-soft)', color: 'var(--rose-dark)' }}>
                  Today's Schedule
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gap: '6px' }}>
              {slots.map((slot, idx) => {
                const isCurrent =
                  activeDay === todayCode &&
                  pulse.currentSlot?.time === slot.time &&
                  pulse.currentSlot?.subject === slot.subject;
                return (
                  <div
                    key={idx}
                    className={`timetable-slot-row ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="slot-time-col">
                      <strong>{slot.time}</strong>
                      <small>{idx === 4 ? '40 min break' : '60 min slot'}</small>
                    </div>

                    <div className="slot-info-col">
                      <span
                        className={`class-pill ${
                          slot.type === 'lab'
                            ? 'lab'
                            : slot.subject === 'ID1'
                            ? 'id1'
                            : slot.subject === 'ID2'
                            ? 'id2'
                            : slot.type === 'lunch'
                            ? 'lunch'
                            : 'free'
                        }`}
                      >
                        {slot.type === 'lab'
                          ? '🧪 LAB Practical'
                          : slot.subject === 'ID1'
                          ? '📘 Section ID1'
                          : slot.subject === 'ID2'
                          ? '📙 Section ID2'
                          : slot.type === 'lunch'
                          ? '☕ Lunch Break'
                          : '○ Free / Prep Period'}
                      </span>
                      {slot.notes && (
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          · {slot.notes}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Full Week Matrix View */
        <div style={{ overflowX: 'auto' }}>
          <table className="timetable-grid-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>DAY</th>
                {SLOTS_METADATA.map((s, i) => (
                  <th key={i}>{s.time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const daySlots = timetable[day] || [];
                const isToday = day === todayCode;
                return (
                  <tr key={day} className={isToday ? 'today-row' : ''}>
                    <td style={{ fontWeight: 700, color: isToday ? 'var(--rose-dark)' : 'inherit' }}>
                      {day} {isToday && '⭐'}
                    </td>
                    {daySlots.map((slot, i) => (
                      <td
                        key={i}
                        style={{
                          background:
                            slot.type === 'lab'
                              ? '#f0f9f3'
                              : slot.subject === 'ID1'
                              ? '#fff0f4'
                              : slot.subject === 'ID2'
                              ? '#f0f6fc'
                              : slot.type === 'lunch'
                              ? '#fff9ee'
                              : '#ffffff',
                        }}
                      >
                        <strong
                          style={{
                            color:
                              slot.type === 'lab'
                                ? '#2e7d54'
                                : slot.subject === 'ID1'
                                ? '#b8365c'
                                : slot.subject === 'ID2'
                                ? '#2f6596'
                                : slot.type === 'lunch'
                                ? '#9c6a1e'
                                : '#a69ba0',
                          }}
                        >
                          {slot.subject || '—'}
                        </strong>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Syllabus & Portions View
   ========================================================================== */

function SyllabusView({
  subjects,
  onUpdateSubjects,
  showToast,
}: {
  subjects: Subject[];
  onUpdateSubjects: (subs: Subject[]) => void;
  showToast: (msg: string) => void;
}) {
  const [activeSubjectId, setActiveSubjectId] = useState<string>('all');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');

  // Overall calculations
  let totalTopics = 0;
  let completedTopics = 0;
  subjects.forEach((s) => {
    s.units.forEach((u) => {
      u.topics.forEach((t) => {
        totalTopics++;
        if (t.status === 'Completed') completedTopics++;
      });
    });
  });
  const overallPct = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const cycleStatus = (subjectId: string, unitId: string, topicId: string) => {
    const statuses: TopicStatus[] = ['Not Started', 'In Progress', 'Completed'];
    onUpdateSubjects(
      subjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          units: sub.units.map((unit) => {
            if (unit.id !== unitId) return unit;
            return {
              ...unit,
              topics: unit.topics.map((topic) => {
                if (topic.id !== topicId) return topic;
                const nextIndex = (statuses.indexOf(topic.status) + 1) % statuses.length;
                const nextStatus = statuses[nextIndex];
                if (nextStatus === 'Completed') {
                  triggerConfetti();
                  playGentleChime('success');
                  showToast(`Portion completed: ${topic.title} 🌸`);
                }
                return { ...topic, status: nextStatus };
              }),
            };
          }),
        };
      })
    );
  };

  const handleAddTopic = (subjectId: string, unitId: string) => {
    if (!newTopicTitle.trim()) return;
    const newTopic: SyllabusTopic = {
      id: `topic-${Date.now()}`,
      unitId,
      title: newTopicTitle.trim(),
      status: 'Not Started',
    };
    onUpdateSubjects(
      subjects.map((s) => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          units: s.units.map((u) => (u.id === unitId ? { ...u, topics: [...u.topics, newTopic] } : u)),
        };
      })
    );
    setNewTopicTitle('');
    setSelectedUnitId('');
    showToast('New syllabus topic added! 📚');
  };

  const handleAddUnit = (subjectId: string) => {
    const sub = subjects.find((s) => s.id === subjectId);
    if (!sub) return;
    const nextNum = sub.units.length + 1;
    const unitName = prompt(`Enter chapter/unit title:`, `Unit ${nextNum}: New Topic`);
    if (!unitName || !unitName.trim()) return;
    const newUnit: SyllabusUnit = {
      id: `unit-${Date.now()}`,
      subjectId,
      unitNumber: nextNum,
      name: unitName.trim(),
      topics: [],
    };
    onUpdateSubjects(
      subjects.map((s) => (s.id === subjectId ? { ...s, units: [...s.units, newUnit] } : s))
    );
    showToast(`Unit ${nextNum} added to ${sub.name}! 📚`);
  };

  const filteredSubjects =
    activeSubjectId === 'all'
      ? subjects
      : subjects.filter((s) => s.id === activeSubjectId);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <BookOpen size={14} /> Curriculum Progress
          </div>
          <h2>Syllabus & Portions</h2>
          <p>Track your chapters, experiments, and portions covered across all classes.</p>
        </div>
      </div>

      {/* Progress hero */}
      <section className="syllabus-hero">
        <div className="syllabus-hero-left">
          <h3>{overallPct}% Overall Completed</h3>
          <p>
            {completedTopics} out of {totalTopics} topics finished across all subjects
          </p>
        </div>
        <div className="syllabus-hero-bar">
          <div className="progress-track" style={{ height: '10px' }}>
            <div
              className="progress-fill"
              style={{ width: `${overallPct}%`, background: 'var(--rose)' }}
            />
          </div>
        </div>
      </section>

      {/* Subject Filter Tabs */}
      <div className="day-tabs-bar" style={{ marginBottom: '20px' }}>
        <button
          className={`day-tab-btn ${activeSubjectId === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSubjectId('all')}
        >
          All Portions
        </button>
        {subjects.map((sub) => (
          <button
            key={sub.id}
            className={`day-tab-btn ${activeSubjectId === sub.id ? 'active' : ''}`}
            onClick={() => setActiveSubjectId(sub.id)}
          >
            {sub.name} ({sub.code})
          </button>
        ))}
      </div>

      {/* Units & Topics List */}
      <div>
        {filteredSubjects.map((subject) => (
          <div key={subject.id} style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: subject.color,
                  }}
                />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>
                  {subject.name}
                </h3>
              </div>
              <button
                className="secondary-button"
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={() => handleAddUnit(subject.id)}
              >
                <Plus size={13} /> Add Unit
              </button>
            </div>

            {subject.units.length === 0 && (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px dashed var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px 20px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '10px' }}>
                  No portions or units added for {subject.name} yet.
                </p>
                <button
                  className="primary-button"
                  style={{ fontSize: '12.5px', margin: '0 auto', padding: '8px 16px' }}
                  onClick={() => handleAddUnit(subject.id)}
                >
                  <Plus size={14} /> Add First Unit / Chapter
                </button>
              </div>
            )}

            {subject.units.map((unit) => {
              const unitTotal = unit.topics.length;
              const unitDone = unit.topics.filter((t) => t.status === 'Completed').length;
              const unitPct = unitTotal ? Math.round((unitDone / unitTotal) * 100) : 0;
              return (
                <div className="unit-card" key={unit.id}>
                  <div className="unit-header">
                    <h4>
                      <span>Unit {unit.unitNumber}:</span> {unit.name}
                    </h4>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>
                      {unitDone}/{unitTotal} covered ({unitPct}%)
                    </span>
                  </div>

                  <div className="topics-table">
                    {unit.topics.map((topic) => (
                      <div className="topic-row" key={topic.id}>
                        <div className="topic-title-area">
                          <strong>{topic.title}</strong>
                          {topic.notes && <small>Note: {topic.notes}</small>}
                        </div>
                        <button
                          className={`status-select-btn ${
                            topic.status === 'Completed'
                              ? 'completed'
                              : topic.status === 'In Progress'
                              ? 'inprogress'
                              : 'notstarted'
                          }`}
                          onClick={() => cycleStatus(subject.id, unit.id, topic.id)}
                          title="Click to cycle status"
                        >
                          {topic.status === 'Completed' && <Check size={13} />}
                          <span>{topic.status}</span>
                        </button>
                      </div>
                    ))}

                    {/* Quick Add Topic Inside Unit */}
                    {selectedUnitId === unit.id ? (
                      <div style={{ padding: '12px 20px', background: '#fdfbfa', display: 'flex', gap: '8px' }}>
                        <input
                          className="styled-input"
                          placeholder="New topic title (e.g. Simple Harmonic Motion numericals)..."
                          value={newTopicTitle}
                          onChange={(e) => setNewTopicTitle(e.target.value)}
                        />
                        <button
                          className="primary-button"
                          onClick={() => handleAddTopic(subject.id, unit.id)}
                        >
                          Save
                        </button>
                        <button
                          className="secondary-button"
                          onClick={() => setSelectedUnitId('')}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: '10px 20px' }}>
                        <button
                          className="text-button"
                          onClick={() => setSelectedUnitId(unit.id)}
                        >
                          <Plus size={14} /> Add topic to Unit {unit.unitNumber}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   Tasks & Planner View
   ========================================================================== */

function TasksView({
  tasks,
  onUpdateTasks,
  showToast,
}: {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  showToast: (msg: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');

  // New task form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Teaching');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const toggleTask = (id: string) => {
    onUpdateTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) {
            triggerConfetti();
            playGentleChime('success');
            showToast('Task finished! 🌷');
          }
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
    showToast('Task removed.');
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    onUpdateTasks([newTask, ...tasks]);
    setTitle('');
    showToast('Task scheduled! ✍️');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'Pending' && t.completed) return false;
    if (filterStatus === 'Completed' && !t.completed) return false;
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <ClipboardList size={14} /> Daily Teacher Planner
          </div>
          <h2>To-Do & Tasks</h2>
          <p>
            {tasks.filter((t) => !t.completed).length} pending ·{' '}
            {tasks.filter((t) => t.completed).length} finished
          </p>
        </div>
      </div>

      {/* Add Task Box */}
      <section className="panel" style={{ marginBottom: '22px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '12px' }}>
          Schedule a New Task
        </h4>
        <form onSubmit={handleAddTask}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <input
              className="styled-input"
              placeholder="What needs care? (e.g. Set question paper for ID2, evaluate lab records...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  className="styled-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                >
                  <option value="Teaching">Teaching</option>
                  <option value="Correction">Correction</option>
                  <option value="Lab Work">Lab Work</option>
                  <option value="Admin">Admin</option>
                  <option value="Exam">Exam / Question Paper</option>
                  <option value="Personal">Personal / Self-care</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Priority
                </label>
                <select
                  className="styled-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  <option value="Urgent">Urgent 🔥</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                  Due Date
                </label>
                <input
                  type="date"
                  className="styled-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <button className="primary-button" type="submit" style={{ justifySelf: 'start', marginTop: '6px' }}>
              <Plus size={16} /> Add Task
            </button>
          </div>
        </form>
      </section>

      {/* Filter toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            className="styled-input"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="styled-select"
          style={{ width: '130px' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="styled-select"
          style={{ width: '140px' }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Teaching">Teaching</option>
          <option value="Correction">Correction</option>
          <option value="Lab Work">Lab Work</option>
          <option value="Admin">Admin</option>
          <option value="Exam">Exam</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="panel"
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <button
              className={`task-check-btn ${task.completed ? 'checked' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              <Check size={14} />
            </button>
            <div style={{ flex: 1 }}>
              <div className={`task-title ${task.completed ? 'done' : ''}`} style={{ fontSize: '14.5px' }}>
                {task.title}
              </div>
              <div className="task-meta">
                <span className="badge-tag cat">{task.category}</span>
                <span className={`badge-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                {task.dueDate && <span>Due: {task.dueDate}</span>}
              </div>
            </div>
            <button
              className="icon-button"
              onClick={() => deleteTask(task.id)}
              title="Delete task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
            <CheckCircle2 size={36} style={{ color: 'var(--sage)', marginBottom: '8px' }} />
            <p>No tasks found in this view. Enjoy the peaceful moment! 🌸</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Quick Notes View
   ========================================================================== */

function QuickNotesView({
  notes,
  onUpdateNotes,
  showToast,
}: {
  notes: Note[];
  onUpdateNotes: (notes: Note[]) => void;
  showToast: (msg: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Note['category']>('Teaching');
  const [query, setQuery] = useState('');

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title.trim() || 'Untitled thought',
      content: content.trim(),
      category,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    onUpdateNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    showToast('Note saved! 📌');
  };

  const togglePin = (id: string) => {
    onUpdateNotes(
      notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const deleteNote = (id: string) => {
    onUpdateNotes(notes.filter((n) => n.id !== id));
    showToast('Note deleted.');
  };

  const filtered = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <NotebookPen size={14} /> Lesson sparks & thoughts
          </div>
          <h2>Quick Notes</h2>
          <p>Capture teaching ideas, lab apparatus notes, or staff meeting reminders.</p>
        </div>
      </div>

      {/* Composer */}
      <section className="notes-composer-box">
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <input
                className="styled-input"
                placeholder="Note title (e.g. Good experiment demonstration for Unit 2)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select
                className="styled-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="Teaching">Teaching Ideas</option>
                <option value="Lab Prep">Lab Preparation</option>
                <option value="Reminders">Reminders</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <textarea
              className="styled-textarea"
              placeholder="Write your thoughts or reminders here..."
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button className="primary-button" type="submit" style={{ justifySelf: 'start' }}>
              Save Note
            </button>
          </div>
        </form>
      </section>

      {/* Search toolbar */}
      <div style={{ marginBottom: '18px' }}>
        <input
          className="styled-input"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Notes Masonry */}
      <div className="notes-masonry">
        {filtered.map((note) => (
          <article className={`note-card-box ${note.pinned ? 'pinned' : ''}`} key={note.id}>
            <div>
              <div className="note-card-top">
                <span className="note-category-tag">{note.category}</span>
                <button
                  className="icon-button"
                  onClick={() => togglePin(note.id)}
                  title={note.pinned ? 'Unpin' : 'Pin to top'}
                >
                  <Star
                    size={14}
                    fill={note.pinned ? 'var(--rose)' : 'none'}
                    color={note.pinned ? 'var(--rose)' : 'var(--muted)'}
                  />
                </button>
              </div>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
            </div>
            <div className="note-card-footer">
              <span>{note.createdAt.slice(0, 10)}</span>
              <button
                className="icon-button"
                onClick={() => deleteNote(note.id)}
                title="Delete note"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', gridColumn: '1 / -1' }}>
            <NotebookPen size={36} style={{ color: 'var(--rose)', marginBottom: '8px' }} />
            <p>No notes written yet. Jot down student reminders, lab prep, or ideas above! 🌸</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Break & Mindful Reset View (Games + Calming Breathing)
   ========================================================================== */

function BreakView({ showToast }: { showToast: (msg: string) => void }) {
  // Breathing state
  const [breathePhase, setBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    let timer: any;
    const runCycle = () => {
      setBreathePhase('Inhale');
      timer = setTimeout(() => {
        setBreathePhase('Hold');
        timer = setTimeout(() => {
          setBreathePhase('Exhale');
          timer = setTimeout(runCycle, 8000);
        }, 7000);
      }, 4000);
    };
    runCycle();
    return () => clearTimeout(timer);
  }, []);

  // Game 1: Guess the Number
  const [secretNumber, setSecretNumber] = useState(() => Math.floor(Math.random() * 50) + 1);
  const [guessInput, setGuessInput] = useState('');
  const [guessMsg, setGuessMsg] = useState('');
  const [guessTries, setGuessTries] = useState(0);

  const checkGuess = () => {
    const num = Number(guessInput);
    if (!num) return;
    setGuessTries((t) => t + 1);
    if (num === secretNumber) {
      triggerConfetti();
      playGentleChime('success');
      setGuessMsg(`🎉 You got it! It was ${secretNumber}! In ${guessTries + 1} guesses!`);
    } else if (num < secretNumber) {
      setGuessMsg('A little too low 😄 Try higher!');
    } else {
      setGuessMsg('A little too high 😄 Try lower!');
    }
  };

  const resetGuessGame = () => {
    setSecretNumber(Math.floor(Math.random() * 50) + 1);
    setGuessInput('');
    setGuessMsg('');
    setGuessTries(0);
  };

  // Game 2: Rock Paper Scissors
  const [rpsResult, setRpsResult] = useState<string | null>(null);
  const [rpsScores, setRpsScores] = useState({ preethi: 0, cpu: 0 });

  const playRps = (playerChoice: 'Rock' | 'Paper' | 'Scissors') => {
    const choices: ('Rock' | 'Paper' | 'Scissors')[] = ['Rock', 'Paper', 'Scissors'];
    const cpuChoice = choices[Math.floor(Math.random() * choices.length)];

    if (playerChoice === cpuChoice) {
      setRpsResult(`Both chose ${playerChoice}! It's a draw 🤝`);
    } else if (
      (playerChoice === 'Rock' && cpuChoice === 'Scissors') ||
      (playerChoice === 'Paper' && cpuChoice === 'Rock') ||
      (playerChoice === 'Scissors' && cpuChoice === 'Paper')
    ) {
      triggerHearts();
      playGentleChime('success');
      setRpsScores((s) => ({ ...s, preethi: s.preethi + 1 }));
      setRpsResult(`You played ${playerChoice}, CPU played ${cpuChoice}. You Win! 🌸`);
    } else {
      setRpsScores((s) => ({ ...s, cpu: s.cpu + 1 }));
      setRpsResult(`You played ${playerChoice}, CPU played ${cpuChoice}. CPU got this round 😄`);
    }
  };

  // Game 3: Word Scramble
  const wordsList = [
    { word: 'PHYSICS', hint: 'Your wonderful subject of matter and energy' },
    { word: 'SUNSHINE', hint: 'What you bring into every room' },
    { word: 'THERMODYNAMICS', hint: 'The study of heat and work' },
    { word: 'GRAVITATION', hint: 'The force pulling everything together' },
    { word: 'COFFEE', hint: 'Staff room energizer ☕' },
    { word: 'MOMENTUM', hint: 'Mass times velocity in motion' },
    { word: 'BUTTERFLY', hint: 'Gentle, colorful, and graceful' },
    { word: 'TEACHER', hint: 'The most admirable guide in the world' },
  ];
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleAnswer, setScrambleAnswer] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<string | null>(null);

  const currentWordObj = wordsList[scrambleIndex];
  const scrambled = useMemo(() => {
    return currentWordObj.word
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }, [scrambleIndex]);

  const checkWord = () => {
    if (scrambleAnswer.trim().toUpperCase() === currentWordObj.word) {
      triggerConfetti();
      playGentleChime('success');
      setScrambleFeedback('Correct! Wonderful job! 🌸');
    } else {
      setScrambleFeedback('Not quite, try once more! 😄');
    }
  };

  const nextWord = () => {
    setScrambleIndex((i) => (i + 1) % wordsList.length);
    setScrambleAnswer('');
    setScrambleFeedback(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <Gamepad2 size={14} /> Mindful Reset
          </div>
          <h2>Bored? Take 2 Minutes</h2>
          <p>A little break between classes. Zero pressure, zero stakes, completely for you.</p>
        </div>
      </div>

      <div className="break-header-hero">
        <div className="break-hero-icon">
          <Heart size={28} fill="currentColor" />
        </div>
        <div>
          <h3>You deserve a peaceful breather, Preethi 💗</h3>
          <p>
            Teaching takes huge emotional and physical energy. Let your mind wander for two minutes!
          </p>
        </div>
      </div>

      {/* 4-7-8 Breathing Bubble */}
      <section className="breathing-section">
        <span className="eyebrow">4-7-8 Calming Rhythm</span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '6px 0 4px' }}>
          Calming Breathing Bubble
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
          Follow the bubble to release tension from your neck and shoulders.
        </p>

        <div className="breathing-bubble-container">
          <div
            className={`breathing-bubble ${
              breathePhase === 'Inhale'
                ? 'inhale'
                : breathePhase === 'Hold'
                ? 'hold'
                : 'exhale'
            }`}
          />
          <div className="breathing-text">
            {breathePhase === 'Inhale' && 'Breathe In (4s)'}
            {breathePhase === 'Hold' && 'Hold gently (7s)'}
            {breathePhase === 'Exhale' && 'Breathe Out (8s)'}
          </div>
        </div>
      </section>

      {/* Interactive Games */}
      <div className="games-grid">
        {/* Guess the number */}
        <div className="game-box">
          <div>
            <span className="eyebrow">01 · Quick Game</span>
            <h4>Guess the Number</h4>
            <p>I'm thinking of a number from 1 to 50. Can you guess it?</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="number"
                min={1}
                max={50}
                className="styled-input"
                style={{ width: '80px', textAlign: 'center' }}
                placeholder="?"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
              />
              <button className="primary-button" onClick={checkGuess}>
                Guess!
              </button>
            </div>
            {guessMsg && (
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--rose-dark)' }}>
                {guessMsg}
              </div>
            )}
          </div>
          <button className="secondary-button" onClick={resetGuessGame} style={{ marginTop: '12px' }}>
            <RefreshCw size={13} /> New Number
          </button>
        </div>

        {/* Rock Paper Scissors */}
        <div className="game-box">
          <div>
            <span className="eyebrow">02 · Classic Fun</span>
            <h4>Rock Paper Scissors</h4>
            <p>Pick your move against Dummu’s computer algorithm!</p>
            <div className="rps-buttons">
              <button className="rps-btn" onClick={() => playRps('Rock')} title="Rock">
                ✊
              </button>
              <button className="rps-btn" onClick={() => playRps('Paper')} title="Paper">
                ✋
              </button>
              <button className="rps-btn" onClick={() => playRps('Scissors')} title="Scissors">
                ✌️
              </button>
            </div>
            {rpsResult && (
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                {rpsResult}
              </div>
            )}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
            Score: Preethi <strong>{rpsScores.preethi}</strong> · CPU{' '}
            <strong>{rpsScores.cpu}</strong>
          </div>
        </div>

        {/* Word Scramble */}
        <div className="game-box">
          <div>
            <span className="eyebrow">03 · Brain Unwind</span>
            <h4>Word Scramble</h4>
            <p>Unscramble: <strong style={{ fontSize: '15px', color: 'var(--rose-dark)' }}>{scrambled}</strong></p>
            <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '10px' }}>
              💡 Hint: {currentWordObj.hint}
            </small>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                className="styled-input"
                placeholder="Your answer..."
                value={scrambleAnswer}
                onChange={(e) => setScrambleAnswer(e.target.value)}
              />
              <button className="primary-button" onClick={checkWord}>
                Check
              </button>
            </div>
            {scrambleFeedback && (
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--rose-dark)' }}>
                {scrambleFeedback}
              </div>
            )}
          </div>
          <button className="secondary-button" onClick={nextWord} style={{ marginTop: '12px' }}>
            Next Word <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   💌 Love Notes & Dummu's Jar View
   ========================================================================== */

/* ==========================================================================
   💖 Hearts Screen Celebration & Push Quote Overlay
   ========================================================================== */

function HeartsCelebrationOverlay({
  quote,
  onNextQuote,
  onClose,
}: {
  quote: string;
  onNextQuote: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    triggerScreenHeartsExplosion();
  }, []);

  return (
    <div className="hearts-screen-overlay" onClick={onClose}>
      {/* Floating Animated Hearts Filling the Screen */}
      <div className="floating-hearts-container">
        {Array.from({ length: 45 }).map((_, i) => (
          <svg
            key={i}
            className="floating-heart-particle"
            style={{
              left: `${(i * 2.22 + (i % 7) * 2.8) % 96}%`,
              width: `${16 + (i % 5) * 8}px`,
              height: `${16 + (i % 5) * 8}px`,
              animationDelay: `${(i * 0.08).toFixed(2)}s`,
              animationDuration: `${3.2 + (i % 5) * 0.75}s`,
              color: [
                '#ff4d79',
                '#e85d82',
                '#ff8fae',
                '#ffb3c6',
                '#ff6584',
                '#ffd1dc',
                '#ff1744',
              ][i % 7],
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>

      <div className="quote-celebration-card" onClick={(e) => e.stopPropagation()}>
        <div className="quote-celebration-icon">
          <Heart size={36} fill="currentColor" />
        </div>
        <div className="quote-tag-badge">
          <Sparkles size={13} /> Daily Push Quote For Preethi
        </div>
        <div className="quote-celebration-text">“{quote}”</div>
        <div className="quote-celebration-sub">
          With endless love &amp; pride, <strong>your Dummu 💕</strong>
        </div>

        <div className="quote-celebration-actions">
          <button
            className="quote-btn-next"
            onClick={(e) => {
              e.stopPropagation();
              onNextQuote();
            }}
          >
            <RefreshCw size={15} /> Another Quote ✨
          </button>
          <button
            className="quote-btn-close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Start My Day 🌸 <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Analytics View
   ========================================================================== */

function AnalyticsView({ data }: { data: AppData }) {
  const completedTasks = data.tasks.filter((t) => t.completed).length;
  const pendingTasks = data.tasks.length - completedTasks;

  let totalTopics = 0;
  let doneTopics = 0;
  data.subjects.forEach((s) =>
    s.units.forEach((u) =>
      u.topics.forEach((t) => {
        totalTopics++;
        if (t.status === 'Completed') doneTopics++;
      })
    )
  );
  const syllabusPct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            <BarChart3 size={14} /> Progress Overview
          </div>
          <h2>Weekly Pulse & Reflection</h2>
          <p>Celebrate the small steps you make every single school day.</p>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card rose">
          <div className="stat-icon">
            <CheckCircle2 size={18} />
          </div>
          <span>Tasks Checked</span>
          <strong>{completedTasks}</strong>
          <small>{pendingTasks} remaining on plan</small>
        </div>
        <div className="stat-card mint">
          <div className="stat-icon">
            <BookOpen size={18} />
          </div>
          <span>Portions Finished</span>
          <strong>{doneTopics}</strong>
          <small>topics completely covered</small>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">
            <Award size={18} />
          </div>
          <span>Curriculum Pace</span>
          <strong>{syllabusPct}%</strong>
          <small>overall syllabus coverage</small>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon">
            <Calendar size={18} />
          </div>
          <span>Active Days</span>
          <strong>6</strong>
          <small>Monday through Saturday</small>
        </div>
      </div>

      <div className="panel">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '12px' }}>
          Weekly Teaching Breakdown
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '20px' }}>
          Your rhythm is balanced with practical physics lab sessions, classroom teaching, and preparation periods.
        </p>

        <div style={{ display: 'grid', gap: '14px' }}>
          {data.subjects.map((s) => {
            let subT = 0;
            let subD = 0;
            s.units.forEach((u) =>
              u.topics.forEach((t) => {
                subT++;
                if (t.status === 'Completed') subD++;
              })
            );
            const p = subT ? Math.round((subD / subT) * 100) : 0;
            return (
              <div key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <strong>{s.name} ({s.code})</strong>
                  <span>{subD}/{subT} topics ({p}%)</span>
                </div>
                <div className="progress-track" style={{ height: '8px' }}>
                  <div className="progress-fill" style={{ width: `${p}%`, background: s.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Login View
   ========================================================================== */

function LoginView({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('preethi');
  const [password, setPassword] = useState('1226');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (username.trim().toLowerCase() === 'preethi' && password === '1226') {
      onLogin('preethi-auth-active');
    } else {
      setError('Incorrect username or password. Please check and try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-art-panel">
        <div className="orbit-circle-wrapper">
          <div className="orbit-ring one" />
          <div className="orbit-ring two" />
          <div className="orbit-center-icon">
            <Atom size={38} />
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>
          A quiet lab for your teaching day
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '300px', marginTop: '6px' }}>
          Lessons, portions, schedules, and sweet love notes from Dummu.
        </p>
      </div>

      <div className="login-card">
        <div className="eyebrow">
          <Heart size={12} fill="currentColor" /> Welcome back, Baby
        </div>
        <h1>
          Preethi’s<br />
          <em>Teacher Companion</em>
        </h1>
        <p>Organize lessons, syllabus portions, and keep your heart light.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={submit} className="login-form">
          <label>
            Username
            <input
              className="styled-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              className="styled-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="primary-button" type="submit" style={{ width: '100%', marginTop: '6px' }}>
            Open Companion <ArrowRight size={16} />
          </button>
        </form>

        <button
          className="demo-unlock-btn"
          onClick={() => onLogin('preethi-auth-active')}
        >
          <Sparkles size={14} /> Quick One-Click Unlock (Preethi 💗)
        </button>
      </div>
    </div>
  );
}
