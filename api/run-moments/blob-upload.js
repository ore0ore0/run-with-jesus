// api/run-moments/blob-upload.js
export const config = { runtime: "nodejs" };

import { put } from "@vercel/blob";
import { Buffer } from "buffer";

// Helper: extract filename and content-type from multipart header
function parseMultipart(req, buffer) {
  const boundary = req.headers["content-type"].split("boundary=")[1];
  const parts = buffer.toString().split(`--${boundary}`);
  const filePart = parts.find(p => p.includes("filename="));
  if (!filePart) return null;

  // Extract headers
  const nameMatch = /name="([^"]+)"/.exec(filePart);
  const filenameMatch = /filename="([^"]+)"/.exec(filePart);
  const typeMatch = /Content-Type:\s*([^\r\n]+)/.exec(filePart);

  const fileName = filenameMatch ? filenameMatch[1] : `upload-${Date.now()}`;
  const contentType = typeMatch ? typeMatch[1] : "application/octet-stream";

  // File body starts after the blank line following headers
  const fileBody = filePart.split("\r\n\r\n")[1];
  const fileContent = fileBody
    ? Buffer.from(fileBody.trim().split("\r\n--")[0], "binary")
    : buffer;

  return { fileName, contentType, fileContent };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const fileInfo = parseMultipart(req, buffer);
    if (!fileInfo) {
      return res.status(400).json({ ok: false, error: "No file data found" });
    }

    const { fileName, contentType, fileContent } = fileInfo;

    // Upload to Vercel Blob with correct metadata
    const blob = await put(fileName, fileContent, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("Blob upload error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}

