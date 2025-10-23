// api/run-moments/blob-upload.js
export const config = { runtime: "nodejs" };

import { put } from "@vercel/blob";

// Read the raw multipart body manually into a Buffer
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Extract filename from header if present
    const contentDisposition = req.headers["content-disposition"] || "";
    const match = /filename="([^"]+)"/.exec(contentDisposition);
    const fileName = match ? match[1] : `upload-${Date.now()}.bin`;

    // Upload directly from memory buffer
    const blob = await put(fileName, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error("Blob upload failed:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}

