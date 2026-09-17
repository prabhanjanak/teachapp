import 'dotenv/config';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from './db/index.js';
import { notes, routineItems, sessions, subjects, syllabusTopics, syllabusUnits, tasks, timetableEntries, users } from './db/schema.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const secret = process.env.SESSION_SECRET ?? 'development-only-secret';
const localMode = process.env.LOCAL_DEV_MODE === 'true' || !process.env.DATABASE_URL;
const localSessions = new Map<string, number>();
const localPasswordHash = process.env.INITIAL_PASSWORD_HASH ?? '$2a$12$x79762b.wvGAFkfKYlNAbOQr7H6zaE9CyDrLGQ2dx1jIkaxm711Pa';
const allowedOrigins = new Set([process.env.CLIENT_URL ?? 'http://localhost:5173', 'http://localhost:5173', 'http://127.0.0.1:5173']);
app.use(helmet()); app.use(cors({ origin: (origin, callback) => { if (!origin || allowedOrigins.has(origin)) return callback(null, true); return callback(new Error('Origin is not allowed')); }, credentials: true })); app.use(express.json({ limit: '1mb' })); app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 120 }));

type AuthRequest = Request & { userId?: number };
const auth = async (req: AuthRequest, res: Response, next: NextFunction) => { try { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ message: 'Your session has expired. Please login again.' }); if (localMode && localSessions.has(token)) { req.userId = localSessions.get(token); return next(); } const payload = jwt.verify(token, secret) as { sessionId: string; userId: number }; const session = await db.query.sessions.findFirst({ where: and(eq(sessions.id, payload.sessionId), eq(sessions.userId, payload.userId)) }); if (!session || session.expiresAt < new Date()) return res.status(401).json({ message: 'Your session has expired. Please login again.' }); req.userId = payload.userId; next(); } catch { res.status(401).json({ message: 'Your session has expired. Please login again.' }); } };
const resource = (table: any, orderColumn: any = table.id) => ({ get: async (req: AuthRequest, res: Response) => res.json(await db.select().from(table).where(eq(table.userId, req.userId!)).orderBy(desc(orderColumn))), post: async (req: AuthRequest, res: Response) => { const created = await db.insert(table).values({ ...req.body, userId: req.userId! }).returning() as any[]; return res.status(201).json(created[0]); }, patch: async (req: AuthRequest, res: Response) => { const updated = await db.update(table).set({ ...req.body, updatedAt: new Date() }).where(and(eq(table.id, Number(req.params.id)), eq(table.userId, req.userId!))).returning() as any[]; return res.json(updated[0]); }, delete: async (req: AuthRequest, res: Response) => { await db.delete(table).where(and(eq(table.id, Number(req.params.id)), eq(table.userId, req.userId!))); res.status(204).end(); } });
const wrap = (handler: (req: AuthRequest, res: Response) => Promise<unknown>) => (req: AuthRequest, res: Response, next: NextFunction) => Promise.resolve(handler(req, res)).catch(next);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/auth/login', wrap(async (req, res) => { const username = String(req.body.username ?? '').trim().toLowerCase(); const password = String(req.body.password ?? ''); if (localMode) { const localUsername = (process.env.INITIAL_USERNAME ?? 'preethi').toLowerCase(); if (username !== localUsername || !(await bcrypt.compare(password, localPasswordHash))) return res.status(401).json({ message: 'Incorrect username or password.' }); const token = `local.${crypto.randomUUID()}`; localSessions.set(token, 1); return res.json({ token, user: { id: 1, username: localUsername, displayName: 'Preethi' } }); } const user = await db.query.users.findFirst({ where: eq(users.username, username) }); if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Incorrect username or password.' }); const sessionId = crypto.randomUUID(); await db.insert(sessions).values({ id: sessionId, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) }); return res.json({ token: jwt.sign({ sessionId, userId: user.id }, secret, { expiresIn: '14d' }), user: { id: user.id, username: user.username, displayName: user.displayName } }); }));
app.post('/api/auth/logout', auth, wrap(async (req, res) => { const token = req.headers.authorization?.replace('Bearer ', '')!; if (localMode && localSessions.delete(token)) return res.status(204).end(); const payload = jwt.verify(token, secret) as { sessionId: string }; await db.delete(sessions).where(eq(sessions.id, payload.sessionId)); res.status(204).end(); }));
app.get('/api/auth/me', auth, wrap(async (req, res) => res.json(await db.query.users.findFirst({ columns: { id: true, username: true, displayName: true }, where: eq(users.id, req.userId!) }))));
for (const [path, table] of [['tasks', tasks], ['notes', notes], ['routine', routineItems], ['timetable', timetableEntries]] as const) { const handlers = resource(table); app.get(`/api/${path}`, auth, wrap(handlers.get)); app.post(`/api/${path}`, auth, wrap(handlers.post)); app.patch(`/api/${path}/:id`, auth, wrap(handlers.patch)); app.delete(`/api/${path}/:id`, auth, wrap(handlers.delete)); }
app.get('/api/subjects', auth, wrap(async (req, res) => res.json(await db.query.subjects.findMany({ where: eq(subjects.userId, req.userId!), with: { units: { with: { topics: true } } } }))));
app.post('/api/subjects', auth, wrap(async (req, res) => res.status(201).json((await db.insert(subjects).values({ userId: req.userId!, name: String(req.body.name), color: String(req.body.color ?? '#E85D82') }).returning())[0])));
app.patch('/api/subjects/:id', auth, wrap(async (req, res) => res.json((await db.update(subjects).set({ name: String(req.body.name), color: String(req.body.color ?? '#E85D82') }).where(and(eq(subjects.id, Number(req.params.id)), eq(subjects.userId, req.userId!))).returning())[0])));
app.delete('/api/subjects/:id', auth, wrap(async (req, res) => { await db.delete(subjects).where(and(eq(subjects.id, Number(req.params.id)), eq(subjects.userId, req.userId!))); res.status(204).end(); }));
app.post('/api/syllabus/units', auth, wrap(async (req, res) => { const subject = await db.query.subjects.findFirst({ where: and(eq(subjects.id, Number(req.body.subjectId)), eq(subjects.userId, req.userId!)) }); if (!subject) return res.status(404).json({ message: 'Subject not found.' }); return res.status(201).json((await db.insert(syllabusUnits).values({ subjectId: subject.id, name: String(req.body.name) }).returning())[0]); }));
app.get('/api/syllabus', auth, wrap(async (req, res) => res.json(await db.select({ topic: syllabusTopics, unit: syllabusUnits, subject: subjects }).from(syllabusTopics).innerJoin(syllabusUnits, eq(syllabusTopics.unitId, syllabusUnits.id)).innerJoin(subjects, eq(syllabusUnits.subjectId, subjects.id)).where(eq(subjects.userId, req.userId!)))));
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => { console.error(error); res.status(500).json({ message: 'Something went wrong. Please try again.' }); });
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
