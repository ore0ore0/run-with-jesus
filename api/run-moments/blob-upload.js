// api/run-moments/blob-upload.js
export const config = { runtime: "nodejs" };

import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const file = files.file;

    if (!file) {
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    // Read buffer synchronously from temp file
    const data = fs.readFileSync(file.filepath);

    // Upload to Vercel Blob
    const blob = await put(file.originalFilename, data, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error("Blob upload failed:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}

