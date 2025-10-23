export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
import { requireSessionNode } from '../requireSessionNode.js';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const auth = await requireSessionNode(req);
  if (!auth.ok) return res.status(401).json({ ok: false });

  const { url, caption } = req.body || {};
  if (!url) return res.status(400).json({ ok: false, error: 'missing-url' });

  await sql`create extension if not exists pgcrypto`;
  await sql`create table if not exists run_moments (id uuid primary key default gen_random_uuid(), url text not null, caption text, created_at timestamptz default now())`;
  await sql`insert into run_moments (url, caption) values (${url}, ${caption || ''})`;
  return res.json({ ok: true });
}
