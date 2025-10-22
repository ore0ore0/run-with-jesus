export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
import { requireSessionNode } from '../requireSessionNode.js';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const auth = await requireSessionNode(req);
  if (!auth.ok) return res.status(401).json({ ok: false });

  const { url, bookId } = req.body || {};
  if (!url || !bookId) return res.status(400).json({ ok: false, error: 'missing-fields' });

  await sql`create extension if not exists pgcrypto`;
  await sql`create table if not exists reviews (id uuid primary key default gen_random_uuid(), book_id text not null, url text not null, created_at timestamptz default now())`;
  await sql`insert into reviews (book_id, url) values (${bookId}, ${url})`;
  return res.json({ ok: true });
}
