// api/run-moments/delete.js
export const config = { runtime: "nodejs" };

import { del } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { requireSession } from "../requireSessionNode.js"; // adjust path if needed

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // 1️⃣ Check authentication
    const session = await requireSessionNode(req, res);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    // 2️⃣ Validate request body
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ ok: false, error: "Missing file URL" });
    }

    // 3️⃣ Delete from Vercel Blob
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });

    // 4️⃣ Remove DB record
    await sql`DELETE FROM run_moments WHERE url = ${url}`;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}

