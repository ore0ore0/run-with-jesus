import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import RunMoments from './pages/RunMoments.jsx'
import Library from './pages/Library.jsx'
import BookDetail from './pages/BookDetail.jsx'
import LoginModal from './components/LoginModal.jsx'
import JoinModal from './components/JoinModal.jsx'
import ResetPasswordModal from './components/ResetPasswordModal.jsx'
import { STR } from './i18n.js'

export default function App() {
  const [lang, setLang] = useState('en')
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const t = STR[lang]
  const navigate = useNavigate()

  const content = authed ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<RunMoments lang={lang} />} />
      <Route path="/library" element={<Library lang={lang} />} />
      <Route path="/library/:id" element={<BookDetail lang={lang} />} />
      <Route path="*" element={<Home />} />
    </Routes>
  ) : (
    <div className="min-h-[100dvh] flex items-center justify-center">
      <div className="text-center px-6">
        <div className="font-run text-4xl md:text-6xl mb-6">{t.brand} <span>/ {t.brandKR}</span></div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={()=>setShowLogin(true)} className="px-6 py-3 rounded-full bg-white/20 shadow-lounge">Member Login</button>
          <button onClick={()=>setShowJoin(true)} className="px-6 py-3 rounded-full bg-white/20 shadow-lounge">Join Club</button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <NavBar lang={lang} setLang={setLang} authed={authed} user={user} onLoginClick={()=>setShowLogin(true)} onJoinClick={()=>setShowJoin(true)} onLogout={()=>{ setAuthed(false); setUser(null); navigate('/'); }} />
      {content}
      <LoginModal open={showLogin} onClose={()=>setShowLogin(false)} lang={lang} onAuthed={(u)=>{ setUser(u); setAuthed(true); navigate('/'); }} onReset={()=>{ setShowLogin(false); setShowReset(true); }} />
      <JoinModal open={showJoin} onClose={()=>setShowJoin(false)} lang={lang} onJoined={(u)=>{ setUser(u); setAuthed(true); navigate('/'); }} />
      <ResetPasswordModal open={showReset} onClose={()=>setShowReset(false)} lang={lang} />
    </div>
  )
}
