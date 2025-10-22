export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
import { requireSessionNode } from '../requireSessionNode.js';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const auth = await requireSessionNode(req);
  if (!auth.ok) return res.status(401).json({ ok: false });

  await sql`create extension if not exists pgcrypto`;
  await sql`create table if not exists run_moments (id uuid primary key default gen_random_uuid(), url text not null, caption text, created_at timestamptz default now())`;
  const rows = await sql`select id, url, caption from run_moments order by coalesce(lower(caption), '') asc, created_at desc`;
  return res.json({ items: rows });
}
