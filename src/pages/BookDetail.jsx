import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { STR } from '../i18n.js'
import ReviewEditor from '../components/ReviewEditor.jsx'
import Modal from '../components/Modal.jsx'
import { uploadReviewFile } from '../mockServer.js'

const byId = {
  '1': { title: 'Norwegian Wood', author: 'Haruki Murakami' },
  '2': { title: 'Pachinko', author: 'Min Jin Lee' },
  '3': { title: 'The Wind-Up Bird Chronicle', author: 'Haruki Murakami' },
  '4': { title: 'The Stranger', author: 'Albert Camus' },
}

export default function BookDetail({ lang='en' }) {
  const t = STR[lang]
  const { id } = useParams()
  const book = byId[id]
  const [showEditor, setShowEditor] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [msg, setMsg] = useState('')

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await uploadReviewFile({ file })
    setMsg(`Uploaded: ${res.name}`)
    setShowUpload(false)
  }

  return (
    <div className="pt-16 mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_minmax(0,3fr)] gap-0">
        <section className="run-bg p-6 font-run">
          <h2 className="text-2xl font-bold">Run Notes</h2>
          <p>Left column: consistent run identity.</p>
        </section>
        <section className="read-bg separator p-6 font-read">
          <h1 className="text-3xl font-bold">{book?.title}</h1>
          <p className="mb-4">{book?.author}</p>

          <div className="flex gap-3 mb-6">
            <button onClick={()=>setShowEditor(v=>!v)} className="px-4 py-2 rounded-md font-semibold bg-white/20">{t.writeReview}</button>
            <button onClick={()=>setShowUpload(true)} className="px-4 py-2 rounded-md font-semibold bg-white/20">{t.uploadReview}</button>
          </div>

          {showEditor && <ReviewEditor lang={lang} onSave={(txt)=>{ setMsg('Saved review (local)'); setShowEditor(false)}} />}

          {msg && <div className="mt-4 p-3 bg-white/10 rounded text-sm">{msg}</div>}
        </section>
      </div>

      <Modal open={showUpload} onClose={()=>setShowUpload(false)} labelledBy="upload-review-title">
        <div className="form-shell">
          <div className="form-title mb-4">
            <span className="lock-icon" aria-hidden="true"></span>
            <h2 id="upload-review-title">{t.uploadReview}</h2>
          </div>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="border rounded-md p-3 w-full bg-white/10"/>
        </div>
      </Modal>
    </div>
  )
}
