import streamlit as st
import sqlite3
import random
import hashlib
from datetime import date, datetime

# -----------------------------
# Preethi Teacher Companion
# -----------------------------
st.set_page_config(
    page_title="Preethi's Teacher Companion",
    page_icon="💗",
    layout="wide",
    initial_sidebar_state="expanded",
)

DB = "preethi_teacher.db"

# -----------------------------
# Styling - responsive/mobile friendly
# -----------------------------
st.markdown("""
<style>
:root { --coral:#e85d75; --coral-dark:#b93f59; --cream:#fffaf5; --ink:#29262d; --muted:#776d73; --line:#eadfe0; --mint:#e8f4ef; }
.stApp { background: radial-gradient(circle at 90% 0%,#fff0e5 0,transparent 26rem), linear-gradient(180deg,#fffaf5 0%,#ffffff 58%); color:var(--ink); }
.block-container { padding-top: 2rem; max-width: 1180px; }
h1,h2,h3 { letter-spacing:-0.03em; font-family:Georgia,serif; color:var(--ink); }
h1 { font-size:2.55rem; line-height:1.08; }
h2 { font-size:1.65rem; }
.eyebrow { color:var(--coral-dark); font-size:.76rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; margin-bottom:.45rem; }
.page-intro { color:var(--muted); font-size:1rem; margin-top:-.7rem; margin-bottom:1.5rem; }
.love-card {
    background: linear-gradient(135deg,#fff0e8,#fffaf6);
    border:1px solid #f1c9c3; border-radius:14px; padding:24px;
    box-shadow:0 12px 30px rgba(126,69,50,.08); margin-bottom:18px;
}
.quote { font-size:1.12rem; line-height:1.65; }
.small-muted { color:var(--muted); font-size:.88rem; }
.metric-card {
    border:1px solid var(--line); border-radius:10px; padding:18px;
    background:rgba(255,255,255,.82); min-height:108px;
    box-shadow:0 5px 16px rgba(58,39,40,.04);
}
.metric-card h2 { margin:.35rem 0 0; font-family:Georgia,serif; }
.task-done { text-decoration:line-through; opacity:.55; }
.badge { display:inline-block; padding:4px 9px; border-radius:999px;
    background:#fff0e8; color:var(--coral-dark); font-size:.76rem; margin-right:4px; }
div[data-testid="stSidebar"] { background:#2d2930; }
div[data-testid="stSidebar"] * { color:#fffaf5; }
div[data-testid="stSidebar"] .stCaption { color:#cfc1c5; }
div[data-testid="stSidebar"] hr { border-color:#51484d; }
div[data-testid="stSidebar"] button { border-color:#6f5d63; background:transparent; }
div[data-testid="stSidebar"] button:hover { border-color:#f5b1a2; color:#fff; }
div[data-testid="stSidebar"] [data-testid="stRadio"] label { border-radius:8px; padding:.28rem .4rem; }
div[data-testid="stSidebar"] [data-testid="stRadio"] label:hover { background:#443b41; }
div[data-testid="stForm"] { border-color:var(--line); border-radius:10px; }
button[kind="primary"] { background:var(--coral); border-color:var(--coral); }
button[kind="primary"]:hover { background:var(--coral-dark); border-color:var(--coral-dark); }
@media (max-width: 768px) {
    .block-container { padding: .7rem .8rem 2rem .8rem; }
    h1 { font-size:1.95rem; }
    h2 { font-size:1.35rem; }
    .love-card { padding:16px; border-radius:12px; }
    button { min-height:42px; }
}
</style>
""", unsafe_allow_html=True)

# -----------------------------
# Database
# -----------------------------
def db():
    return sqlite3.connect(DB, check_same_thread=False)

def init_db():
    con=db(); cur=con.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, category TEXT, due_date TEXT,
        priority TEXT, done INTEGER DEFAULT 0, created_at TEXT)""")
    cur.execute("""CREATE TABLE IF NOT EXISTS syllabus(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL, unit TEXT, topic TEXT,
        status TEXT DEFAULT 'Not Started', notes TEXT, updated_at TEXT)""")
    cur.execute("""CREATE TABLE IF NOT EXISTS notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, content TEXT, created_at TEXT)""")
    cur.execute("""CREATE TABLE IF NOT EXISTS streak(
        key TEXT PRIMARY KEY, value TEXT)""")
    con.commit(); con.close()

init_db()

# -----------------------------
# Login
# -----------------------------
USERNAME = "preethi"
PASSWORD = "1226"

def login_screen():
    st.markdown("<div style='height:5vh'></div>", unsafe_allow_html=True)
    c1,c2,c3=st.columns([1,1.4,1])
    with c2:
        st.markdown("""
        <div class="love-card" style="text-align:center">
        <div style="font-size:3.2rem">💗</div>
        <h1>Preethi's Teacher Companion</h1>
        <p class="small-muted">A little space to organise teaching, syllabus, and your day.</p>
        </div>""", unsafe_allow_html=True)
        with st.form("login"):
            u=st.text_input("Username")
            p=st.text_input("Password", type="password")
            ok=st.form_submit_button("💗 Login", use_container_width=True)
            if ok:
                if u.strip().lower()==USERNAME and p==PASSWORD:
                    st.session_state.auth=True
                    st.session_state.just_logged=True
                    st.rerun()
                else:
                    st.error("Incorrect username or password.")
        st.caption("Private teacher dashboard • Mobile friendly")

if "auth" not in st.session_state: st.session_state.auth=False
if not st.session_state.auth:
    login_screen()
    st.stop()

# -----------------------------
# Love notes
# -----------------------------
LOVE_NOTES=[
("Prabhanjan","Good morning, Baby 💗 Whatever today brings, take it one class at a time. You are doing better than you think. Love you always."),
("Dummu","Hey Baby 🌸 Drink some water, smile a little, and don't forget that someone is always cheering for you. Have a beautiful day. ❤️"),
("Baby","Hi Preethi 💕 Your only job today is to do your best, not to be perfect. I'm proud of you. Love you, Baby."),
("Prabhanjan","A tiny reminder from your Dummu: you are loved, appreciated, and never alone. Go make your students' day brighter. 💗"),
("Dummu","Good day, Preethi 🌷 Finish what matters, ignore the little chaos, and save a little smile for me. Love you."),
]
if st.session_state.get("just_logged"):
    st.session_state.love=random.choice(LOVE_NOTES)
    st.session_state.just_logged=False

# -----------------------------
# Timetable from uploaded image
# -----------------------------
DAYS=["MON","TUES","WED","THUR","FRI","SAT"]
SLOTS=["9:00–10:00","10:00–11:00","11:00–12:00","12:00–1:00",
       "1:40–2:40","2:40–3:40","3:40–4:40"]
TT={
"MON":["LAB","LAB","","ID1","","","ID2"],
"TUES":["ID1","","LAB","LAB","ID2","",""],
"WED":["ID1","ID2","","","LAB","LAB","ID2"],
"THUR":["","ID2","ID1","","ID1","",""],
"FRI":["LAB","LAB","","","LAB","LAB","ID2"],
"SAT":["ID2","","","ID1","","ID2","ID1"],
}

# -----------------------------
# Sidebar
# -----------------------------
st.sidebar.markdown("## 💗 Preethi")
st.sidebar.caption("Teacher Companion")
page=st.sidebar.radio("Go to",[
    "🏠 Dashboard","📅 Timetable","✅ To‑Do","📚 Syllabus & Portions",
    "📝 Quick Notes","🎮 Bored? Play","💌 Love Note"
])
st.sidebar.divider()
if st.sidebar.button("🔄 New Love Note", use_container_width=True):
    st.session_state.love=random.choice(LOVE_NOTES); st.rerun()
if st.sidebar.button("🚪 Logout", use_container_width=True):
    st.session_state.auth=False; st.rerun()

st.markdown(f"<div class='eyebrow'>Preethi's teacher companion</div><div class='page-intro'>A calm place for classes, portions, and the little things that keep the day moving.</div>", unsafe_allow_html=True)

# -----------------------------
# Helpers
# -----------------------------
def rows(sql,args=()):
    con=db(); data=con.execute(sql,args).fetchall(); con.close(); return data
def exec_sql(sql,args=()):
    con=db(); con.execute(sql,args); con.commit(); con.close()

def progress_stats():
    total=rows("SELECT COUNT(*) FROM tasks")[0][0]
    done=rows("SELECT COUNT(*) FROM tasks WHERE done=1")[0][0]
    return total,done

# -----------------------------
# Dashboard
# -----------------------------
if page=="🏠 Dashboard":
    st.title("Good day, Preethi 💗")
    who,msg=random.choice([st.session_state.love]) if "love" in st.session_state else LOVE_NOTES[0]
    st.markdown(f"""
    <div class="love-card">
      <div class="small-muted">A little note from <b>{who}</b></div>
      <div class="quote">“{msg}”</div>
    </div>""", unsafe_allow_html=True)

    total,done=progress_stats()
    today=str(date.today())
    today_tasks=rows("SELECT id,title,priority,done FROM tasks WHERE due_date=? ORDER BY done, id",(today,))
    syllabus_total=rows("SELECT COUNT(*) FROM syllabus")[0][0]
    syllabus_done=rows("SELECT COUNT(*) FROM syllabus WHERE status='Completed'")[0][0]

    a,b,c,d=st.columns(4)
    for col,label,value in [(a,"Tasks",f"{done}/{total}"),(b,"Due today",str(len(today_tasks))),
                            (c,"Syllabus topics",str(syllabus_total)),(d,"Completed topics",str(syllabus_done))]:
        with col: st.markdown(f'<div class="metric-card"><div class="small-muted">{label}</div><h2>{value}</h2></div>',unsafe_allow_html=True)
    st.write("")
    st.subheader("📌 Today's focus")
    if today_tasks:
        for tid,title,priority,is_done in today_tasks:
            c1,c2=st.columns([5,1])
            with c1:
                st.markdown(f"<span class='{'task-done' if is_done else ''}'>{'☑️' if is_done else '⬜'} {title}</span> <span class='badge'>{priority or 'Normal'}</span>",unsafe_allow_html=True)
            with c2:
                if st.button("Undo" if is_done else "Done",key=f"dash{tid}"):
                    exec_sql("UPDATE tasks SET done=? WHERE id=?",(0 if is_done else 1,tid)); st.rerun()
    else: st.info("No tasks due today. Enjoy the breathing space 🌷")
    st.subheader("✨ Quick actions")
    q1,q2,q3=st.columns(3)
    with q1:
        if st.button("➕ Add a task",use_container_width=True): st.session_state.goto="todo"
    with q2:
        if st.button("📚 Update syllabus",use_container_width=True): st.session_state.goto="syllabus"
    with q3:
        if st.button("🎮 I'm bored",use_container_width=True): st.session_state.goto="game"

# -----------------------------
# Timetable
# -----------------------------
elif page=="📅 Timetable":
    st.title("📅 Weekly Timetable")
    st.caption("Recreated from the timetable image you provided. Lunch break: 1:00–1:40 PM.")
    selected=st.selectbox("View day",DAYS,index=min(date.today().weekday(),5))
    st.markdown(f"### {selected}")
    dayrow=TT[selected]
    for slot,val in zip(SLOTS,dayrow):
        c1,c2=st.columns([1.5,4])
        with c1: st.markdown(f"**{slot}**")
        with c2:
            if val=="": st.markdown("— Free / preparation")
            elif val=="LAB": st.success("🧪 LAB")
            elif val=="ID1": st.info("📘 ID1")
            elif val=="ID2": st.warning("📙 ID2")
    st.divider()
    st.subheader("Full week")
    header=st.columns([1.3]+[1]*7)
    header[0].markdown("**DAY**")
    for i,s in enumerate(SLOTS): header[i+1].markdown(f"**{s}**")
    for day in DAYS:
        cs=st.columns([1.3]+[1]*7)
        cs[0].markdown(f"**{day}**")
        for i,v in enumerate(TT[day]):
            cs[i+1].markdown(v or "—")

# -----------------------------
# To-do
# -----------------------------
elif page=="✅ To‑Do":
    st.title("✅ To‑Do Manager")
    with st.expander("➕ Add new task",expanded=True):
        with st.form("newtask"):
            title=st.text_input("Task",placeholder="Prepare notes for tomorrow's class...")
            c1,c2,c3=st.columns(3)
            with c1: cat=st.selectbox("Category",["Teaching","Correction","Admin","Personal","Exam","Other"])
            with c2: due=st.date_input("Due date",value=date.today())
            with c3: pri=st.selectbox("Priority",["Low","Normal","High","Urgent"])
            if st.form_submit_button("Add task",use_container_width=True):
                if title.strip():
                    exec_sql("INSERT INTO tasks(title,category,due_date,priority,created_at) VALUES(?,?,?,?,?)",
                             (title.strip(),cat,str(due),pri,datetime.now().isoformat()))
                    st.success("Task added."); st.rerun()
    filt=st.selectbox("Filter",["All","Pending","Completed"])
    q="SELECT id,title,category,due_date,priority,done FROM tasks"
    if filt=="Pending": q+=" WHERE done=0"
    if filt=="Completed": q+=" WHERE done=1"
    q+=" ORDER BY done, due_date IS NULL, due_date, id DESC"
    data=rows(q)
    if not data: st.info("No tasks here yet.")
    for tid,title,cat,due,pri,is_done in data:
        with st.container(border=True):
            c1,c2,c3=st.columns([5,.9,.9])
            with c1:
                st.markdown(f"<div class='{'task-done' if is_done else ''}'><b>{title}</b><br><span class='small-muted'>{cat} • Due: {due or 'No date'} • {pri}</span></div>",unsafe_allow_html=True)
            with c2:
                if st.button("↩️" if is_done else "☑️",key=f"task{tid}",help="Toggle complete"):
                    exec_sql("UPDATE tasks SET done=? WHERE id=?",(0 if is_done else 1,tid)); st.rerun()
            with c3:
                if st.button("🗑️",key=f"del{tid}"):
                    exec_sql("DELETE FROM tasks WHERE id=?",(tid,)); st.rerun()

# -----------------------------
# Syllabus
# -----------------------------
elif page=="📚 Syllabus & Portions":
    st.title("📚 Syllabus & Portions")
    st.caption("Track units/topics, completion, and notes. Add your real subject names to replace ID1/ID2/LAB.")
    with st.expander("➕ Add syllabus topic",expanded=True):
        with st.form("syllabus"):
            c1,c2=st.columns(2)
            with c1: subject=st.text_input("Subject",placeholder="ID1 / ID2 / Physics / etc.")
            with c2: unit=st.text_input("Unit / Chapter",placeholder="Unit 1")
            topic=st.text_input("Portion / Topic",placeholder="Topic to complete")
            notes=st.text_area("Notes",placeholder="Important points, exercises, pending work...")
            status=st.selectbox("Status",["Not Started","In Progress","Completed"])
            if st.form_submit_button("Save topic",use_container_width=True):
                if subject.strip() and topic.strip():
                    exec_sql("""INSERT INTO syllabus(subject,unit,topic,status,notes,updated_at)
                    VALUES(?,?,?,?,?,?)""",(subject,unit,topic,status,notes,datetime.now().isoformat()))
                    st.success("Syllabus updated."); st.rerun()
    data=rows("SELECT id,subject,unit,topic,status,notes FROM syllabus ORDER BY subject,id")
    if data:
        for sid,subject,unit,topic,status,notes in data:
            with st.container(border=True):
                c1,c2,c3=st.columns([5,2,1])
                with c1:
                    st.markdown(f"**{subject}** — {unit or 'No unit'}")
                    st.write(topic)
                    if notes: st.caption(notes)
                with c2:
                    new=st.selectbox("Status",["Not Started","In Progress","Completed"],
                                     index=["Not Started","In Progress","Completed"].index(status),
                                     key=f"ss{sid}",label_visibility="collapsed")
                    if new!=status:
                        exec_sql("UPDATE syllabus SET status=?,updated_at=? WHERE id=?",(new,datetime.now().isoformat(),sid)); st.rerun()
                with c3:
                    if st.button("🗑️",key=f"sd{sid}"):
                        exec_sql("DELETE FROM syllabus WHERE id=?",(sid,)); st.rerun()
        st.divider()
        total=len(data); completed=sum(1 for x in data if x[4]=="Completed")
        st.progress(completed/total if total else 0, text=f"{completed}/{total} syllabus topics completed")
    else: st.info("Add your first portion above.")

# -----------------------------
# Notes
# -----------------------------
elif page=="📝 Quick Notes":
    st.title("📝 Quick Notes")
    with st.form("note"):
        title=st.text_input("Title",placeholder="Meeting / class idea / reminder")
        content=st.text_area("Note",height=160)
        if st.form_submit_button("Save note",use_container_width=True):
            if content.strip():
                exec_sql("INSERT INTO notes(title,content,created_at) VALUES(?,?,?)",
                         (title.strip(),content.strip(),datetime.now().isoformat()))
                st.success("Saved."); st.rerun()
    data=rows("SELECT id,title,content,created_at FROM notes ORDER BY id DESC")
    for nid,title,content,created in data:
        with st.expander(f"{title or 'Untitled'} • {created[:10]}"):
            st.write(content)
            if st.button("Delete",key=f"nd{nid}"):
                exec_sql("DELETE FROM notes WHERE id=?",(nid,)); st.rerun()

# -----------------------------
# Games
# -----------------------------
elif page=="🎮 Bored? Play":
    st.title("🎮 Bored? Take 2 minutes 💗")
    game=st.radio("Choose a tiny game",["🔢 Guess the Number","✊ Rock Paper Scissors","🔤 Word Scramble"],horizontal=True)
    if game.startswith("🔢"):
        if "secret" not in st.session_state: st.session_state.secret=random.randint(1,50)
        guess=st.number_input("Guess a number from 1–50",1,50,25)
        if st.button("Guess!",use_container_width=True):
            if guess==st.session_state.secret:
                st.success("🎉 You got it!"); st.session_state.secret=random.randint(1,50)
            elif guess<st.session_state.secret: st.info("Too low 😄")
            else: st.info("Too high 😄")
        if st.button("New number"): st.session_state.secret=random.randint(1,50); st.rerun()
    elif game.startswith("✊"):
        choice=st.selectbox("Your move",["Rock","Paper","Scissors"])
        if st.button("Play 💗",use_container_width=True):
            cpu=random.choice(["Rock","Paper","Scissors"])
            if choice==cpu: result="It's a draw! 🤝"
            elif (choice,cpu) in [("Rock","Scissors"),("Paper","Rock"),("Scissors","Paper")]: result="You win! 🌸"
            else: result="Computer wins this round 😄"
            st.info(f"You: **{choice}**  |  Computer: **{cpu}**\n\n{result}")
    else:
        words=["teacher","sunshine","coffee","physics","garden","smile","dream","rainbow","butterfly","friendship"]
        if "scramble" not in st.session_state: st.session_state.scramble=random.choice(words)
        word=st.session_state.scramble
        scrambled="".join(random.sample(word,len(word)))
        st.markdown(f"### Unscramble: **{scrambled.upper()}**")
        ans=st.text_input("Your answer")
        if st.button("Check",use_container_width=True):
            if ans.lower().strip()==word: st.success("Correct! 🌷"); st.session_state.scramble=random.choice(words)
            else: st.error("Not this one 😄 Try again!")
        if st.button("New word"): st.session_state.scramble=random.choice(words); st.rerun()

# -----------------------------
# Love note
# -----------------------------
elif page=="💌 Love Note":
    st.title("💌 Just for you")
    who,msg=st.session_state.love
    st.markdown(f"""
    <div class="love-card" style="text-align:center;padding:36px 24px">
      <div style="font-size:4rem">💗</div>
      <div class="small-muted">From <b>{who}</b></div>
      <div class="quote" style="font-size:1.3rem;margin-top:12px">“{msg}”</div>
      <div style="margin-top:20px">🌷 ☕ 📚 ✨</div>
    </div>""",unsafe_allow_html=True)
    if st.button("💗 Another one",use_container_width=True):
        st.session_state.love=random.choice(LOVE_NOTES); st.rerun()

st.sidebar.caption("Made with 💗 for Preethi")
