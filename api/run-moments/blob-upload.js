// api/run-moments/blob-upload.js
export const config = { runtime: "nodejs" };

import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // Parse multipart form data
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(400).json({ ok: false, error: err.message });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ ok: false, error: "No file uploaded" });
      }

      // Read file buffer
      const data = fs.readFileSync(file.filepath);

      // Upload to Vercel Blob
      const blob = await put(file.originalFilename, data, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      res.status(200).json({ ok: true, url: blob.url });
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
}

