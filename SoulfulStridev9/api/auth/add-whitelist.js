export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET)
    return res.status(403).json({ ok: false, error: 'forbidden' });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ ok: false, error: 'missing-email' });

  await sql`create table if not exists whitelist (id uuid primary key default gen_random_uuid(), email text unique not null, created_at timestamptz default now())`;
  await sql`insert into whitelist (email) values (${email.toLowerCase()}) on conflict do nothing`;
  return res.json({ ok: true });
}
