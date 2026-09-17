# Preethi's Teacher Companion 💗

A private, warm, and full-featured productivity workspace crafted specifically for Preethi's daily teaching routine. Built with React 19, TypeScript, and Vite, featuring physics-lab aesthetics, rose accents, local-first offline resilience, and zero-config deployment on **Vercel**.

---

## 🌟 Key Features

1. **Dashboard & Live Schedule Pulse**:
   - Time-based greeting (`Good morning / afternoon, Preethi 🌸`) and live date.
   - **Dummu's Daily Love Note**: Heartfelt quotes with a "Surprise note 💗" button.
   - **Real-Time Period Tracker**: Automatically detects current period, next class countdown, or lunch/free period based on the exact time.
   - Quick statistics (pending tasks, finished tasks, syllabus coverage %, today's classes).
   - Priority task checklist with celebratory confetti and chimes.

2. **Accurate Timetable (Monday – Saturday)**:
   - Faithfully recreated from Preethi's reference schedule with all slots (`9:00 AM` to `4:40 PM`).
   - Detailed periods: `LAB`, `ID1`, `ID2`, `Lunch Break (1:00–1:40 PM)`, and `Free periods`.
   - Day-by-day tabs + **Full Week Grid Matrix** toggle.

3. **Syllabus & Portions Tracker**:
   - Covers sections `ID1`, `ID2`, and `Physics Lab`.
   - Units and chapter breakdowns with interactive status tags (`Not Started`, `In Progress`, `Completed`).
   - Dynamic real-time percentage progress bar with confetti celebrations upon completion.
   - Add new topics or units with notes on what to cover.

4. **Daily Teacher Planner (To-Do)**:
   - Filter by status (`Pending`, `Completed`), category (`Teaching`, `Correction`, `Lab Work`, `Admin`, `Exam`, `Personal`), and priority (`Urgent`, `High`, `Medium`, `Low`).
   - Search by keyword and date.

5. **Teacher Desk Tools**:
   - **Lecture & Lab Timer**: 45m lecture, 50m lab, 15m recap presets with circular countdown and soothing Tibetan singing bowl bell chime.
   - **Quick Attendance Scratchpad**: Fast spot-entry for absent roll numbers and daily topics taught.

6. **Quick Notes**:
   - Categorized sticky notes with color tags, search bar, and pin-to-top feature.

7. **Bored? Take 2 Minutes (Mindful Reset & Games)**:
   - **4-7-8 Calming Breathing Bubble**: Animated stress-buster breathing circle for between-class relaxation.
   - **Guess the Number (1–50)** with hint tracking.
   - **Rock Paper Scissors** vs CPU with score tally.
   - **Word Scramble** with physics and heartwarming words.

8. **💌 Dummu's Love Jar**:
   - Collection of private notes from Prabhanjan ("Dummu").
   - "Pull a Surprise Love Note" button with floating heart animations.
   - Ability to add new personal notes to the jar, star favorites, and copy quotes.

9. **Data Safety & Backup**:
   - **One-click Export (JSON)** & **Restore**: Never lose any data across phones, tablets, or computers.

---

## 🚀 How to Deploy on Vercel

This repository is already configured with [`vercel.json`](./vercel.json) for **instant zero-config deployment**:

### Option 1: Vercel Dashboard / Git Import (Easiest)
1. Push this project to GitHub / GitLab / Bitbucket.
2. In Vercel, click **Add New Project** and select this repository.
3. Vercel will automatically read `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build -w client`
   - **Output Directory**: `client/dist`
4. Click **Deploy**. That's it! Preethi can now open the link on her phone, tablet, or laptop anytime.

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts and select the defaults.

---

## 💻 Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the client dev server:
```bash
npm run dev:client
```
Visit `http://localhost:5173`.

3. Default private login credentials:
   - **Username**: `preethi`
   - **Password**: `1226`
   *(There is also a convenient "Quick One-Click Unlock (Preethi 💗)" button on the login screen).*

---

## 📁 Project Structure

- `client/src/App.tsx`: Full application shell and feature views
- `client/src/storage.ts`: Local-first store, timetable seed, love notes, and export/import
- `client/src/types.ts`: TypeScript data models
- `client/src/utils.ts`: Audio chimes (Web Audio API), confetti, date & schedule math
- `client/src/styles.css`: Responsive design system and warm typography
- `vercel.json`: Vercel SPA build and rewrite configuration
