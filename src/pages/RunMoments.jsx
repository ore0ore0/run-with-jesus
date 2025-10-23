
// src/pages/RunMoments.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../components/Modal.jsx";
import { listRunMoments } from "../mockServer.js";

export default function RunMoments() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { refresh(); }, []);
  async function refresh() {
    try {
      const rows = await listRunMoments();
      setItems(rows);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
  }

  const preview = useMemo(() => file ? URL.createObjectURL(file) : null, [file]);

  async function onDrop(e){
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  }

  function onPick(){
    inputRef.current?.click();
  }

  async function onUpload(){
    if (!file) return;
    try{
      setBusy(true);
      // 1) upload to blob
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/run-moments/blob-upload", { method: "POST", body: fd, credentials: "include" });
      if(!up.ok) throw new Error("blob-upload failed");
      const { url } = await up.json();

      // 2) save record
      const sv = await fetch("/api/run-moments/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url, caption }),
      });
      if(!sv.ok) throw new Error("save failed");

      // 3) optimistic add
      setItems(prev => [{ id: Date.now().toString(), url, caption }, ...prev]);
      setOpen(false);
      setFile(null);
      setCaption("");
    }catch(err){
      console.error(err);
      alert("Upload failed. Check auth and env vars.");
    }finally{
      setBusy(false);
    }
  }

  async function onDelete(id, url){
    if(!confirm("Delete this run moment?")) return;
    try{
      const res = await fetch("/api/run-moments/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, url }),
      });
      if(!res.ok) throw new Error("delete failed");
      setItems(prev => prev.filter(x => x.id !== id));
    }catch(err){
      console.error(err);
      alert("Delete failed.");
    }
  }

  return (
    <div className="pt-16 mx-auto max-w-6xl px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Run Moments</h1>
        <button
          onClick={()=>setOpen(true)}
          className="px-4 py-2 rounded-xl bg-black text-white font-semibold shadow"
          aria-label="Add Run Moment"
        >
          + Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-black/10 p-8 text-center text-sm text-black/70">
          No moments yet. Click <span className="font-semibold">Add</span> to upload your first one.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(it => (
            <figure key={it.id} className="group border border-black/10 rounded-xl overflow-hidden bg-white shadow">
              <img src={it.url} alt={it.caption || "Run Moment"} className="w-full h-48 object-cover" />
              <figcaption className="p-3 flex items-center justify-between gap-2">
                <span className="text-sm truncate">{it.caption || "Run Moment"}</span>
                <button
                  onClick={()=>onDelete(it.id, it.url)}
                  className="text-xs px-2 py-1 rounded-md border hover:bg-black hover:text-white transition"
                >
                  Delete
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Modal open={open} onClose={()=>setOpen(false)} labelledBy="upload-run-moment">
        <div className="form-shell">
          <h2 id="upload-run-moment" className="form-title">Upload Run Moment</h2>
          <div
            onDragOver={(e)=>{e.preventDefault(); e.dataTransfer.dropEffect='copy';}}
            onDrop={onDrop}
            className="mt-4 rounded-2xl border-2 border-dashed border-black/15 bg-white p-6 flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={onPick}
            role="button"
            aria-label="Choose an image to upload"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
            ) : (
              <>
                <div className="text-6xl leading-none">📷</div>
                <p className="mt-2 text-sm">Drag & drop an image here, or click to browse</p>
                <p className="text-xs text-black/60 mt-1">PNG, JPG up to ~10 MB</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e)=> setFile(e.target.files?.[0] || null)}
            />
          </div>

          <label className="mt-4 block text-sm font-medium">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e)=>setCaption(e.target.value)}
            placeholder="Where was this run?"
            className="mt-1 w-full rounded-md border p-3"
          />

          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
            <button
              onClick={onUpload}
              disabled={busy || !file}
              className="px-4 py-2 rounded-md bg-black text-white font-semibold disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
