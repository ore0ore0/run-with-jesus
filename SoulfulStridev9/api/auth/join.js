export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ ok: false, error: 'missing-fields' });

  await sql`create extension if not exists pgcrypto`;
  await sql`create table if not exists whitelist (id uuid primary key default gen_random_uuid(), email text unique not null, created_at timestamptz default now())`;
  await sql`create table if not exists users (id uuid primary key default gen_random_uuid(), name text unique not null, email text unique not null, pw_hash text not null, created_at timestamptz default now())`;

  const wl = await sql`select 1 from whitelist where lower(email)=lower(${email})`;
  if (wl.length === 0) return res.status(403).json({ ok: false, error: 'not-whitelisted' });

  const hash = await bcrypt.hash(password, 10);
  try {
    await sql`insert into users (name, email, pw_hash) values (${name.toLowerCase()}, ${email.toLowerCase()}, ${hash})`;
  } catch (e) {
    return res.status(409).json({ ok: false, error: 'user-exists' });
  }
  return res.json({ ok: true });
}
