// api/run-moments/blob-upload.js
export const config = { runtime: "nodejs" };

import { put } from "@vercel/blob";
import { Buffer } from "buffer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    // --- parse multipart boundary ---
    const contentType = req.headers["content-type"];
    const boundaryMatch = contentType && contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      return res.status(400).json({ ok: false, error: "Missing boundary" });
    }
    const boundary = `--${boundaryMatch[1]}`;

    // Find where headers end and binary starts
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      return res.status(400).json({ ok: false, error: "Malformed multipart data" });
    }

    // Grab header section as text
    const headerPart = buffer.slice(0, headerEnd).toString();
    const filenameMatch = /filename="([^"]+)"/.exec(headerPart);
    const typeMatch = /Content-Type:\s*([^\r\n]+)/.exec(headerPart);

    const filename = filenameMatch ? filenameMatch[1] : `upload-${Date.now()}.bin`;
    const mimeType = typeMatch ? typeMatch[1] : "application/octet-stream";

    // Binary file body starts right after the header end
    // and ends right before the boundary at the end
    const fileStart = headerEnd + 4;
    const boundaryBuf = Buffer.from(`\r\n${boundary}`);
    const fileEnd = buffer.indexOf(boundaryBuf, fileStart);
    const fileBuffer = buffer.slice(fileStart, fileEnd);

    // Upload directly to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: "public",
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error("Blob upload failed:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

