export const config = { runtime: 'nodejs' };
import { put } from '@vercel/blob';

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });
  const filename = `reviews/${crypto.randomUUID()}-${file.name || 'review.pdf'}`;
  const { url } = await put(filename, file, { access: 'public' });
  return new Response(JSON.stringify({ url }), { headers: { 'content-type': 'application/json' } });
}
