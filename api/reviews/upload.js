export const config = { runtime: 'edge' };

import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const form = await req.formData();
  const file = form.get('file');
  const bookId = form.get('bookId') || '';

  if (!file || typeof file === 'string')
    return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });

  const filename = `reviews/${bookId}-${crypto.randomUUID()}-${file.name || 'review.pdf'}`;
  const { url } = await put(filename, file, { access: 'public' });

  await sql`create extension if not exists pgcrypto`;
  await sql`
    create table if not exists reviews (
      id uuid primary key default gen_random_uuid(),
      book_id text not null,
      url text not null,
      created_at timestamptz not null default now()
    )
  `;
  await sql`insert into reviews (book_id, url) values (${bookId}, ${url})`;

  return new Response(JSON.stringify({ ok: true, url }), {
    headers: { 'content-type': 'application/json' }
  });
}

