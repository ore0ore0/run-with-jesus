# Run with Jesus — Deploy-Ready

- Vite + React
- White background, black text
- Bilingual (EN/KR)
- Whitelist + Session cookies (Node runtime)
- Vercel Blob (images/files) + Neon (Postgres) metadata
- Edge uploads split from Node DB writes
- Admin-protected whitelist route (x-admin-secret)

## Env
Copy `.env.example` to Vercel env:
- `DATABASE_URL` (Neon)
- `BLOB_READ_WRITE_TOKEN` (Blob)
- `ADMIN_SECRET` (from .env.example or your own)

## Deploy
Push to your existing GitHub repo (connected to Vercel).
Vercel builds with:
- Build: `npm run build`
- Output: `dist`

## Whitelist
```bash
curl -X POST "https://run-with-jesus.vercel.app/api/auth/add-whitelist"   -H "content-type: application/json"   -H "x-admin-secret: $ADMIN_SECRET"   -d '{"email":"member@example.com"}'
```
