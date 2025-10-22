import React, { useEffect, useState } from 'react'
import Modal from '../components/Modal.jsx'
import { listRunMoments } from '../mockServer.js'

export default function Home() {
  const [items, setItems] = useState([])
  const [view, setView] = useState(null)

  useEffect(()=>{ listRunMoments().then(setItems).catch(()=>setItems([])) }, [])

  return (
    <div className="pt-16 mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_minmax(0,2fr)] gap-0">
        {/* RUN 60% */}
        <section className="min-h-[60vh] p-6 font-run" style={{minHeight:'calc(100vh - 4rem)'}}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">RUN</h1>
          <p className="mt-3">Routes, moments, and energy.</p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map(it => (
              <figure key={it.id} className="rounded-lg overflow-hidden shadow cursor-pointer bg-white" onClick={()=>setView(it)}>
                <img src={it.url} alt={it.caption || 'Run moment'} className="w-full h-40 object-cover" />
                <figcaption className="p-2 text-sm">{it.caption || '—'}</figcaption>
              </figure>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-sm">No run moments yet. Add one in “Run Moments”.</div>
            )}
          </div>
        </section>

        {/* READ 40% */}
        <section className="separator min-h-[60vh] p-6 font-read" style={{minHeight:'calc(100vh - 4rem)'}}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">READ</h1>
          <p className="mt-3">Books, reflections, and calm.</p>
        </section>
      </div>

      {/* Full-size image modal with download */}
      <Modal open={!!view} onClose={()=>setView(null)} labelledBy="full-run-image">
        {view && (
          <div className="rounded-lg overflow-hidden shadow-lounge bg-white">
            <div className="p-4 flex items-center justify-between">
              <h2 id="full-run-image" className="text-lg font-semibold">{view.caption || 'Run Moment'}</h2>
              <a
                href={view.url}
                download={(view.caption || 'run-moment').replace(/\s+/g,'-') + '.jpg'}
                className="px-3 py-1 rounded-md font-semibold bg-black/5"
              >
                Download
              </a>
            </div>
            <div>
              <img src={view.url} alt={view.caption || 'Run moment'} className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
