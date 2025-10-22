import React, { useState } from 'react'
import Modal from './Modal.jsx'
import { STR } from '../i18n.js'
import { joinClub } from '../mockServer.js'

export default function JoinModal({ open, onClose, lang='en', onJoined }) {
  const t = STR[lang]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await joinClub({ name, email, password: pw })
      if (!res.ok) throw new Error('signup-failed')
      onJoined?.({ name })
      onClose()
    } catch (err) {
      setError('Not whitelisted or username/email exists.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="join-title">
      <form onSubmit={onSubmit} className="form-shell">
        <div className="form-title mb-4">
          <span className="lock-icon" aria-hidden="true"></span>
          <h2 id="join-title">{t.joinClub}</h2>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium">{t.username}</label>
          <input className="border rounded-md p-3 mb-4 bg-white" required value={name} onChange={(e)=>setName(e.target.value)} />
          <label className="mb-2 text-sm font-medium">{t.email}</label>
          <input type="email" className="border rounded-md p-3 mb-2 bg-white" required value={email} onChange={(e)=>setEmail(e.target.value)} />
          <p className="text-xs mb-2">{t.whitelistNoteEN}<br/>{t.whitelistNoteKR}</p>
          <label className="mt-2 mb-2 text-sm font-medium">{t.password}</label>
          <input type="password" className="border rounded-md p-3 mb-4 bg-white" required value={pw} onChange={(e)=>setPw(e.target.value)} />
          {error && <div className="text-errorRed text-sm mb-2">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-md font-semibold bg-black/5">{t.joinClub}</button>
        </div>
      </form>
    </Modal>
  )
}
