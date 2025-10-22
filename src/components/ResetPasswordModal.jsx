import React, { useState } from 'react'
import Modal from './Modal.jsx'
import { STR } from '../i18n.js'
import { resetPassword } from '../mockServer.js'

export default function ResetPasswordModal({ open, onClose, lang='en' }) {
  const t = STR[lang]
  const [name, setName] = useState('')
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await resetPassword({ name, newPassword: pw })
    setMsg(res.ok ? 'Password updated. You can now log in.' : 'User not found.')
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="reset-title">
      <form onSubmit={onSubmit} className="form-shell">
        <div className="form-title mb-4">
          <span className="lock-icon" aria-hidden="true"></span>
          <h2 id="reset-title">{t.resetPassword}</h2>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium">{t.username}</label>
          <input className="border rounded-md p-3 mb-4 bg-white/10" required value={name} onChange={(e)=>setName(e.target.value)} />
          <label className="mb-2 text-sm font-medium">{t.newPassword}</label>
          <input type="password" className="border rounded-md p-3 mb-4 bg-white/10" required value={pw} onChange={(e)=>setPw(e.target.value)} />
          <button type="submit" className="w-full py-3 rounded-md font-semibold bg-white/20">{t.resetPassword}</button>
          {msg && <div className="mt-3 text-sm">{msg}</div>}
        </div>
      </form>
    </Modal>
  )
}
