import React, { useState } from 'react'
import Modal from './Modal.jsx'
import { STR } from '../i18n.js'
import { login } from '../mockServer.jsx'

export default function LoginModal({ open, onClose, lang='en', onAuthed, onReset }) {
  const t = STR[lang]
  const [name, setName] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login({ name, password: pw })
      onAuthed?.(res.user)
      onClose()
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="login-title">
      <form onSubmit={onSubmit} className="form-shell">
        <div className="form-title mb-4">
          <span className="lock-icon" aria-hidden="true"></span>
          <h2 id="login-title">{t.memberLogin}</h2>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium">{t.username}</label>
          <input className="border rounded-md p-3 mb-4 bg-white" required value={name} onChange={(e)=>setName(e.target.value)} />
          <label className="mt-2 mb-2 text-sm font-medium">{t.password}</label>
          <input type="password" className="border rounded-md p-3 mb-4 bg-white" required value={pw} onChange={(e)=>setPw(e.target.value)} />
          {error && <div className="text-errorRed text-sm mb-2">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-md font-semibold bg-black/5">
            {loading ? 'Checking…' : t.continue}
          </button>
          <button type="button" onClick={onReset} className="mt-3 underline text-sm self-start">{t.forgotPassword}</button>
        </div>
      </form>
    </Modal>
  )
}
