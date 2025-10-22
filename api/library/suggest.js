export const config = { runtime: 'nodejs' };
import { neon } from '@neondatabase/serverless';
import { requireSession } from '../requireSession.js';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req) {
  const auth = await requireSession(req);
  if (!auth.ok) return new Response('Unauthorized', { status: 401 });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const { title, author, why } = await req.json();

  await sql`create extension if not exists pgcrypto`;
  await sql`create table if not exists book_suggestions (id uuid primary key default gen_random_uuid(), title text not null, author text not null, why text not null, created_at timestamptz default now())`;
  await sql`insert into book_suggestions (title, author, why) values (${title}, ${author}, ${why})`;
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
}
