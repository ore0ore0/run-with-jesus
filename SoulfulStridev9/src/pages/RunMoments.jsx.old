import React, { useState, useEffect } from 'react'
import UploadModal from '../components/UploadModal.jsx'
import { STR } from '../i18n.js'
import { listRunMoments } from '../mockServer.js'

export default function RunMoments({ lang='en' }) {
  const t = STR[lang]
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  useEffect(()=>{ listRunMoments().then(setItems).catch(()=>setItems([])) },[])
  const onUploaded = () => listRunMoments().then(setItems)

  return (
    <div className="pt-16 mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_minmax(0,3fr)] gap-0">
        <section className="p-6 font-run" style={{minHeight:'calc(100vh - 4rem)'}}>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t.gallery}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map(it => (
              <figure key={it.id} className="rounded-lg overflow-hidden shadow bg-white">
                <img src={it.url} alt={it.caption || 'Run moment'} className="w-full h-40 object-cover" />
                {it.caption && <figcaption className="p-2 text-sm">{it.caption}</figcaption>}
              </figure>
            ))}
            <button onClick={()=>setOpen(true)} className="h-40 rounded-lg border-2 border-dashed border-borderNeutral/80 flex items-center justify-center text-3xl" aria-label="Add" title="Add">+</button>
          </div>
        </section>
        <section className="separator p-6 font-read">
          <h2 className="text-xl font-bold mb-2">Club Notes</h2>
          <p>Right column reserved for reading features.</p>
        </section>
      </div>
      <UploadModal open={open} onClose={()=>setOpen(false)} onUploaded={onUploaded} lang={lang} />
    </div>
  )
}
