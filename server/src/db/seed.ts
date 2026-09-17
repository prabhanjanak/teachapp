import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, pool } from './index.js';
import { timetableEntries, users } from './schema.js';

const slots = [['09:00', '10:00'], ['10:00', '11:00'], ['11:00', '12:00'], ['12:00', '13:00'], ['13:40', '14:40'], ['14:40', '15:40'], ['15:40', '16:40']];
const timetable: Record<string, string[]> = { MON: ['LAB', 'LAB', '', 'ID1', '', '', 'ID2'], TUES: ['ID1', '', 'LAB', 'LAB', 'ID2', '', ''], WED: ['ID1', 'ID2', '', '', 'LAB', 'LAB', 'ID2'], THUR: ['', 'ID2', 'ID1', '', 'ID1', '', ''], FRI: ['LAB', 'LAB', '', '', 'LAB', 'LAB', 'ID2'], SAT: ['ID2', '', '', 'ID1', '', 'ID2', 'ID1'] };

const [user] = await db.insert(users).values({ username: process.env.INITIAL_USERNAME ?? 'preethi', passwordHash: await bcrypt.hash(process.env.INITIAL_PASSWORD ?? '1226', 12), displayName: 'Preethi' }).onConflictDoNothing().returning();
if (user) {
  for (const [dayOfWeek, values] of Object.entries(timetable)) {
    await db.insert(timetableEntries).values(values.map((subject, index) => ({ userId: user.id, dayOfWeek: dayOfWeek as 'MON' | 'TUES' | 'WED' | 'THUR' | 'FRI' | 'SAT', startTime: slots[index][0], endTime: slots[index][1], subject: subject || null, type: subject === 'LAB' ? 'lab' : 'class' })));
  }
}
await pool.end();
console.log('Seed complete.');
