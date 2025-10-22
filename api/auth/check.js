export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

function parseCookie(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach(p => {
    const [k,v] = p.trim().split('=');
    if (!out[k]) out[k] = v;
  });
  return out;
}

export default async function handler(req, res) {
  await sql`create table if not exists sessions (token text primary key, user_name text not null, created_at timestamptz default now())`;
  const cookies = parseCookie(req.headers.cookie || '');
  const token = cookies.session;
  if (!token) return res.status(401).json({ ok: false });

  const rows = await sql`select user_name from sessions where token = ${token}`;
  if (rows.length === 0) return res.status(401).json({ ok: false });
  return res.json({ ok: true, user: { name: rows[0].user_name } });
}
