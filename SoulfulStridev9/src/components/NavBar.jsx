import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { STR } from '../i18n.js'

export default function NavBar({ lang, setLang, authed, user, onLoginClick, onJoinClick, onLogout }) {
  const t = STR[lang]
  const loc = useLocation()
  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-glass border-b border-black/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="font-run text-xl tracking-wide">{t.brand}</div>
          {authed && (
            <nav className="hidden md:flex items-center gap-4 font-read">
              <Link to="/" className={`hover:underline ${loc.pathname==='/' && 'font-semibold'}`}>{t.home}</Link>
              <Link to="/gallery" className={`hover:underline ${loc.pathname.startsWith('/gallery') && 'font-semibold'}`}>{t.gallery}</Link>
              <Link to="/library" className={`hover:underline ${loc.pathname.startsWith('/library') && 'font-semibold'}`}>{t.library}</Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          {authed && <div className="text-sm mr-1">{user?.name}</div>}
          {authed && <button onClick={onLogout} className="text-sm underline">Logout</button>}
          <div className="flex items-center">
            <div className="rounded-full border px-2 py-1 text-sm">
              <button onClick={()=>setLang('en')} className={`px-2 ${lang==='en'?'font-bold':''}`}>EN</button>
              <span>/</span>
              <button onClick={()=>setLang('kr')} className={`px-2 ${lang==='kr'?'font-bold':''}`}>한</button>
            </div>
          </div>
          {!authed && (
            <div className="ml-2 flex items-center gap-2">
              <button onClick={onLoginClick} className="px-3 py-1 rounded-full bg-black/5">Member Login</button>
              <button onClick={onJoinClick} className="px-3 py-1 rounded-full bg-black/5">Join Club</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
