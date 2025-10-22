export const config = { runtime: 'edge' };
import { neon } from '@neondatabase/serverless';
import { requireSession } from '../requireSession.js';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req) {
  const auth = await requireSession(req);
  if (!auth.ok) return new Response('Unauthorized', { status: 401 });

  await sql`create extension if not exists pgcrypto`;
  await sql`create table if not exists run_moments (id uuid primary key default gen_random_uuid(), url text not null, caption text, created_at timestamptz default now())`;
  const rows = await sql`select id, url, caption from run_moments order by coalesce(lower(caption), '') asc, created_at desc`;
  return new Response(JSON.stringify({ items: rows }), { headers: { 'content-type': 'application/json' } });
}
