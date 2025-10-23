// api/run-moments/list.js
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // Fetch all uploaded Run Moments
    const moments = await sql`
      SELECT id, url, caption, uploaded_by
      FROM run_moments
      ORDER BY created_at DESC
    `;

    // Return results in a consistent structure
    res.status(200).json({
  ok: true,
  moments: moments.map((m) => ({
        id: m.id,
        url: m.url,
        caption: m.caption,
        uploaded_by: m.uploaded_by,
      })),,
  items: moments.map((m) => ({
        id: m.id,
        url: m.url,
        caption: m.caption,
        uploaded_by: m.uploaded_by,
      })),,
});
  } catch (err) {
    console.error("❌ Error fetching run moments:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}

