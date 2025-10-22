export const config = { runtime: 'edge' };

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const form = await req.formData();
  const file = form.get('file');             // <input name="file" type="file">
  const caption = form.get('caption') || '';

  if (!file || typeof file === 'string')
    return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });

  // Upload to Blob (public URL)
  const filename = `run-moments/${crypto.randomUUID()}-${file.name || 'photo.jpg'}`;
  const { url } = await put(filename, file, { access: 'public' });

  // Ensure table + extension exist, insert row
  await sql`create extension if not exists pgcrypto`;
  await sql`
    create table if not exists run_moments (
      id uuid primary key default gen_random_uuid(),
      url text not null,
      caption text,
      created_at timestamptz not null default now()
    )
  `;
  await sql`insert into run_moments (url, caption) values (${url}, ${caption})`;

  return new Response(JSON.stringify({ ok: true, url }), {
    headers: { 'content-type': 'application/json' }
  });
}

