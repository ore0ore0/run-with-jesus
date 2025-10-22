import React, { useRef, useState } from 'react'
import Modal from './Modal.jsx'
import { STR } from '../i18n.js'
import { uploadPhoto } from '../mockServer.js'

export default function UploadModal({ open, onClose, lang='en', onUploaded }) {
  const t = STR[lang]
  const [tab, setTab] = useState('en')
  const fileRef = useRef(null)
  const [captionEN, setCaptionEN] = useState('')
  const [captionKR, setCaptionKR] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    const f = fileRef.current?.files?.[0]
    if (!f) return
    setLoading(true)
    const caption = tab === 'en' ? captionEN : captionKR
    await uploadPhoto({ file: f, caption })
    setLoading(false)
    onUploaded?.()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="upload-title">
      <div className="form-shell">
        <div className="form-title mb-4">
          <span className="lock-icon" aria-hidden="true"></span>
          <h2 id="upload-title">{t.uploadRunMoment}</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed border-borderNeutral rounded-lg p-6 text-center">
            <div className="text-sm mb-2">{t.dragDrop}</div>
            <input ref={fileRef} type="file" accept="image/*" className="block mx-auto" />
          </div>
          <div>
            <div className="flex gap-2 mb-2">
              <button onClick={()=>setTab('en')} className={`px-3 py-1 rounded-full border ${tab==='en'?'bg-black/5':'bg-transparent'}`}>{t.english}</button>
              <button onClick={()=>setTab('kr')} className={`px-3 py-1 rounded-full border ${tab==='kr'?'bg-black/5':'bg-transparent'}`}>{t.korean}</button>
            </div>
            <textarea
              placeholder={t.caption}
              className="w-full h-24 rounded-md border p-3 bg-white"
              value={tab==='en'?captionEN:captionKR}
              onChange={(e)=> tab==='en'?setCaptionEN(e.target.value):setCaptionKR(e.target.value)}
            />
          </div>
          <button onClick={handleUpload} disabled={loading} className="w-full py-3 rounded-md font-semibold bg-[#FF4500] text-white">
            {loading ? 'Uploading…' : t.upload}
          </button>
        </div>
      </div>
    </Modal>
  )
}
