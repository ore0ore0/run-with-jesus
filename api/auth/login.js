export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
const sql = neon(process.env.DATABASE_URL);

const cookieOptions = 'HttpOnly; Secure; Path=/; Max-Age=604800; SameSite=Lax';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { name, password } = req.body || {};
  if (!name || !password) return res.status(400).json({ ok: false, error: 'missing-fields' });

  await sql`create table if not exists users (id uuid primary key default gen_random_uuid(), name text unique not null, email text unique not null, pw_hash text not null, created_at timestamptz default now())`;
  await sql`create table if not exists sessions (token text primary key, user_name text not null, created_at timestamptz default now())`;

  const rows = await sql`select name, pw_hash from users where name = ${name.toLowerCase()}`;
  if (rows.length === 0) return res.status(404).json({ ok: false, error: 'not-found' });

  const ok = await bcrypt.compare(password, rows[0].pw_hash);
  if (!ok) return res.status(401).json({ ok: false, error: 'bad-password' });

  const token = randomBytes(24).toString('hex');
  await sql`insert into sessions (token, user_name) values (${token}, ${name.toLowerCase()})`;

  res.setHeader('Set-Cookie', `session=${token}; ${cookieOptions}`);
  return res.json({ ok: true, user: { name: name.toLowerCase() } });
}
