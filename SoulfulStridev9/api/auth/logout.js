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
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  await sql`create table if not exists sessions (token text primary key, user_name text not null, created_at timestamptz default now())`;
  const cookies = parseCookie(req.headers.cookie || '');
  const token = cookies.session;
  if (token) await sql`delete from sessions where token=${token}`;
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax');
  return res.json({ ok: true });
}
