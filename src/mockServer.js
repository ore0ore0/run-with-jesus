// Demo-only mock server. Replace with real secure backend per checklist.
const whitelist = new Set([ "member@example.com", "admin@soulfulstride.la" ])
// Demo users keyed by username (lowercase)
const users = new Map()
users.set('member', { name: 'member', email: 'member@example.com', password: 'test1234' })

export function addToWhitelist(email){ if(!email) return false; whitelist.add(email.toLowerCase()); return true }
export async function whitelistCheck(email) { await new Promise(r => setTimeout(r, 200)); return whitelist.has((email||'').toLowerCase()) }

export async function registerUser({ name, email, password }) {
  await new Promise(r => setTimeout(r, 200))
  const u = (name||'').toLowerCase().trim()
  if (!u) return { ok:false, error:'invalid-username' }
  users.set(u, { name: u, email, password })
  if (email) whitelist.add(email.toLowerCase())
  return { ok:true, user: { name: u, email } }
}
export async function loginUser({ name, password }) {
  await new Promise(r => setTimeout(r, 200))
  const u = (name||'').toLowerCase().trim()
  const rec = users.get(u)
  if (!rec) return { ok:false, error:'not-found' }
  if (rec.password !== password) return { ok:false, error:'bad-password' }
  return { ok:true, user: { name: rec.name, email: rec.email } }
}
export async function resetPassword({ name, newPassword }) {
  await new Promise(r => setTimeout(r, 200))
  const u = (name||'').toLowerCase().trim()
  const rec = users.get(u)
  if (!rec) return { ok:false, error:'not-found' }
  rec.password = newPassword
  users.set(u, rec)
  return { ok:true }
}

// Upload with client-side resize to conserve storage
export async function uploadPhoto({ file, caption }) {
  await new Promise(r => setTimeout(r, 150))
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const resizedUrl = await new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const maxSide = 1600
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const out = canvas.toDataURL('image/jpeg', 0.82)
      resolve(out)
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
  return { id: crypto.randomUUID(), url: resizedUrl, caption }
}

export async function submitSuggestion({ title, author, why }) { await new Promise(r => setTimeout(r, 150)); return { ok:true } }
export async function uploadReviewFile({ file }) { await new Promise(r => setTimeout(r, 200)); return { ok:true, name: file.name } }
