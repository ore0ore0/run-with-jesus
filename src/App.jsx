import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import RunMoments from './pages/RunMoments.jsx'
import Library from './pages/Library.jsx'
import BookDetail from './pages/BookDetail.jsx'
import LoginModal from './components/LoginModal.jsx'
import JoinModal from './components/JoinModal.jsx'
import { STR } from './i18n.js'
import { checkSession, logout } from './mockServer.js'

export default function App() {
  const [lang, setLang] = useState('en')
  const [authed, setAuthed] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const t = STR[lang]
  const navigate = useNavigate()

  useEffect(()=>{ checkSession().then((r)=>{ if(r.ok){ setUser(r.user); setAuthed(true) } }).catch(()=>{}); },[])

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
          <button onClick={()=>setShowLogin(true)} className="px-6 py-3 rounded-full bg-black/5 shadow-lounge">Member Login</button>
          <button onClick={()=>setShowJoin(true)} className="px-6 py-3 rounded-full bg-black/5 shadow-lounge">Join Club</button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <NavBar lang={lang} setLang={setLang} authed={authed} user={user}
        onLoginClick={()=>setShowLogin(true)} onJoinClick={()=>setShowJoin(true)}
        onLogout={async ()=>{ try{ await logout() }catch{} setAuthed(false); setUser(null); navigate('/'); }} />
      {content}
      <LoginModal open={showLogin} onClose={()=>setShowLogin(false)} lang={lang}
        onAuthed={(u)=>{ setUser(u); setAuthed(true); navigate('/'); }} onReset={()=>{}} />
      <JoinModal open={showJoin} onClose={()=>setShowJoin(false)} lang={lang}
        onJoined={(u)=>{ setUser(u); setAuthed(true); navigate('/'); }} />
    </div>
  )
}
