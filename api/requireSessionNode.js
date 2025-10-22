import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function requireSessionNode(req) {
  const raw = req.headers.cookie || '';
  const m = raw.match(/(?:^|;\s*)session=([^;]+)/);
  const token = m ? m[1] : null;
  if (!token) return { ok: false };
  await sql`create table if not exists sessions (token text primary key, user_name text not null, created_at timestamptz default now())`;
  const rows = await sql`select user_name from sessions where token=${token}`;
  if (rows.length === 0) return { ok: false };
  return { ok: true, user: rows[0].user_name };
}
