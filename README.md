# Run with Jesus (예수님과 함께 뛰어요)

Vite + React app with whitelist-only access using Neon (Postgres) and session cookies; images & files on Vercel Blob.

## Deploy
1. Push to GitHub
2. Import into Vercel (Framework: Vite, Output: dist)
3. In Vercel:
   - Storage → Blob → Create (adds BLOB_READ_WRITE_TOKEN)
   - Marketplace → Neon (Postgres) → Add to project (adds DATABASE_URL)
4. Redeploy

## Dev
```bash
npm i
npm run dev
```

## API
- Auth (Node runtime): `/api/auth/join`, `/api/auth/login`, `/api/auth/check`, `/api/auth/logout`
- Protected (Edge): `/api/run-moments/upload`, `/api/run-moments/list`, `/api/library/suggest`, `/api/reviews/upload`
