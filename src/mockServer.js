export async function apiJSON(url, opts={}){
  const res = await fetch(url, { credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
  return res.json();
}

// Auth
export function joinClub({ name, email, password }) {
  return apiJSON('/api/auth/join', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
}
export function login({ name, password }) {
  return apiJSON('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, password }),
  });
}
export function checkSession() {
  return apiJSON('/api/auth/check');
}
export function logout() {
  return apiJSON('/api/auth/logout', { method: 'POST' });
}

// Run Moments
export async function uploadPhoto({ file, caption }) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('caption', caption || '');
  const res = await fetch('/api/run-moments/upload', { method: 'POST', body: fd, credentials: 'include' });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
export async function listRunMoments() {
  const res = await fetch('/api/run-moments/list', { credentials: 'include' });
  if (!res.ok) throw new Error('List failed');
  const data = await res.json();
  return data.items.map(x => ({ id: x.id, url: x.url, caption: x.caption }));
}

// Library
export function submitSuggestion({ title, author, why }) {
  return apiJSON('/api/library/suggest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title, author, why }),
  });
}

// Reviews
export async function uploadReviewFile({ file, bookId }) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('bookId', bookId || '');
  const res = await fetch('/api/reviews/upload', { method: 'POST', body: fd, credentials: 'include' });
  if (!res.ok) throw new Error('Review upload failed');
  return res.json();
}
