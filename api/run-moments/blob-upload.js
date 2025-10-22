// api/run-moments/blob-upload.js
export const config = { runtime: "nodejs" };

import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // The frontend must send FormData with a single "file" field.
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return res.status(400).json({ ok: false, error: "No file received" });
    }

    // Upload directly from the incoming file stream.
    const blob = await put(file.name, file.stream(), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("Blob upload error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

