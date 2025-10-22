export const config = { runtime: 'edge' };
import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { requireSession } from '../requireSession.js';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req) {
  const auth = await requireSession(req);
  if (!auth.ok) return new Response('Unauthorized', { status: 401 });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const form = await req.formData();
  const file = form.get('file');
  const caption = form.get('caption') || '';
  if (!file || typeof file === 'string') return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });

  const filename = `run-moments/${crypto.randomUUID()}-${file.name || 'photo.jpg'}`;
  const { url } = await put(filename, file, { access: 'public' });

  await sql`create extension if not exists pgcrypto`;
  await sql`create table if not exists run_moments (id uuid primary key default gen_random_uuid(), url text not null, caption text, created_at timestamptz default now())`;
  await sql`insert into run_moments (url, caption) values (${url}, ${caption})`;
  return new Response(JSON.stringify({ ok: true, url }), { headers: { 'content-type': 'application/json' } });
}
