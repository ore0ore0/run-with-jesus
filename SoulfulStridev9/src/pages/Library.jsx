import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { STR } from '../i18n.js'
import { submitSuggestion } from '../mockServer.js'

const demoShelf = [
  { id: '1', title: 'Norwegian Wood', author: 'Haruki Murakami' },
  { id: '2', title: 'Pachinko', author: 'Min Jin Lee' },
  { id: '3', title: 'The Wind-Up Bird Chronicle', author: 'Haruki Murakami' },
  { id: '4', title: 'The Stranger', author: 'Albert Camus' },
]

export default function Library({ lang='en' }) {
  const t = STR[lang]
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [why, setWhy] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await submitSuggestion({ title, author, why })
    if (res.ok) setSent(true)
  }

  return (
    <div className="pt-16 mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_minmax(0,3fr)] gap-0">
        <section className="p-6 font-run">
          <h2 className="text-2xl font-bold mb-4">Run Schedule</h2>
          <p>Left side remains active with run identity.</p>
        </section>
        <section className="separator p-6 font-read">
          <h1 className="text-3xl font-bold mb-6">{t.library}</h1>
          <div className="form-shell mb-6">
            <div className="form-title mb-4">
              <span className="lock-icon" aria-hidden="true"></span>
              <h2>{t.bookSuggestions}</h2>
            </div>
            {sent ? (
              <div>Thank you! Your suggestion has been recorded.</div>
            ) : (
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.title}</label>
                  <input className="border rounded-md p-3 w-full bg-white" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.author}</label>
                  <input className="border rounded-md p-3 w-full bg.white bg-white" value={author} onChange={(e)=>setAuthor(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.whyBook}</label>
                  <textarea className="border rounded-md p-3 w-full h-24 bg-white" value={why} onChange={(e)=>setWhy(e.target.value)} required/>
                </div>
                <button className="px-4 py-2 rounded-md font-semibold bg-black/5 self-start">{t.submitSuggestion}</button>
              </form>
            )}
          </div>
          <div className="form-shell">
            <div className="form-title mb-4">
              <span className="lock-icon" aria-hidden="true"></span>
              <h2>{t.bookReviews}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {demoShelf.map(b => (
                <Link key={b.id} to={`/library/${b.id}`} className="block rounded-md p-3 bg-black/5 hover:bg-black/10 transition">
                  <div className="aspect-[3/4] bg-black/5 rounded mb-2"></div>
                  <div className="text-sm font-semibold">{b.title}</div>
                  <div className="text-xs">{b.author}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
