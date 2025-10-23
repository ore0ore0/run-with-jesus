// src/mockServer.jsx

// Small fetch helper that always returns JSON or throws with status
export async function apiJSON(url, opts = {}) {
  const res = await fetch(url, { credentials: "include", ...opts });
  if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
  return res.json();
}

/* ===================== Auth ===================== */
export function joinClub({ name, email, password }) {
  return apiJSON("/api/auth/join", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export function login({ name, password }) {
  return apiJSON("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, password }),
  });
}

export function checkSession() {
  return apiJSON("/api/auth/check");
}

export function logout() {
  return apiJSON("/api/auth/logout", { method: "POST" });
}

/* =============== Run Moments: upload + list =============== */
// Upload to Blob, then save record (caption optional)
export async function uploadPhoto({ file, caption }) {
  const fd = new FormData();
  fd.append("file", file);

  const up = await fetch("/api/run-moments/blob-upload", {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!up.ok) throw new Error("Blob upload failed");

  const upJson = await up.json();
  const url = upJson.url || upJson.blobUrl || upJson.publicUrl;
  if (!url) throw new Error("Blob upload returned no URL");

  await apiJSON("/api/run-moments/save", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, caption: caption || "" }),
  });

  return { ok: true, url };
}

// List moments; tolerate either { moments: [...] } or { items: [...] } shapes
export async function listRunMoments() {
  const res = await fetch("/api/run-moments/list", { credentials: "include" });
  if (!res.ok) throw new Error("List failed");

  const data = await res.json();
  const arr = Array.isArray(data?.moments)
    ? data.moments
    : Array.isArray(data?.items)
    ? data.items
    : [];

  // Normalize keys for the UI
  return arr.map((x) => ({
    id: x.id ?? x.uuid ?? x._id ?? crypto.randomUUID(),
    url: x.url ?? x.image_url ?? x.blobUrl ?? x.publicUrl ?? "",
    caption: x.caption ?? "",
    created_at: x.created_at ?? x.createdAt ?? null,
  }));
}

/* ===================== Library ===================== */
// Accept either the old shape ({title, author, why}) or the newer
// one ({title, url, note, email}) without breaking callers.
export function submitSuggestion(input) {
  const {
    title = "",
    author, // old
    why,    // old
    url,    // new
    note,   // new
    email,  // new
  } = input || {};

  const payload =
    url !== undefined || note !== undefined || email !== undefined
      ? { title, url: url || "", note: note || "", email: email || "" }
      : { title, author: author || "", why: why || "" };

  return apiJSON("/api/library/suggest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/* ===================== Reviews ===================== */
// Upload a file for a review, then save review record with bookId
export async function uploadReviewFile({ file, bookId }) {
  const fd = new FormData();
  fd.append("file", file);

  const up = await fetch("/api/reviews/blob-upload", {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!up.ok) throw new Error("Blob upload failed");

  const upJson = await up.json();
  const url = upJson.url || upJson.blobUrl || upJson.publicUrl;
  if (!url) throw new Error("Blob upload returned no URL");

  await apiJSON("/api/reviews/save", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, bookId: bookId || "" }),
  });

  return { ok: true, url };
}

/* =============== Optional default export =============== */
// Some parts of your app may import a default; keep it for safety.
const mockServer = {
  apiJSON,
  joinClub,
  login,
  checkSession,
  logout,
  uploadPhoto,
  listRunMoments,
  submitSuggestion,
  uploadReviewFile,
};

export default mockServer;

