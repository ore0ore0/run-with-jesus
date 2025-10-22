import React, { useEffect, useState } from 'react'
import Modal from '../components/Modal.jsx'

export default function Home() {
  const [items, setItems] = useState([])
  const [view, setView] = useState(null)

  function loadItems(){
    try {
      const raw = localStorage.getItem('runItems')
      if (raw) {
        const arr = JSON.parse(raw)
        arr.sort((a,b)=>{
          const ca = (a.caption || '').toLowerCase()
          const cb = (b.caption || '').toLowerCase()
          if (ca && cb) return ca.localeCompare(cb)
          if (ca && !cb) return -1
          if (!ca && cb) return 1
          return 0
        })
        return arr
      }
    } catch {}
    return []
  }

  useEffect(()=>{ setItems(loadItems()) }, [])
  useEffect(()=>{
    const onStorage = (e) => { if (e.key === 'runItems') setItems(loadItems()) }
    const onVis = () => { if (document.visibilityState === 'visible') setItems(loadItems()) }
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVis)
    return () => { window.removeEventListener('storage', onStorage); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  return (
    <div className="pt-16 mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_minmax(0,2fr)] gap-0">
        {/* RUN 60% */}
        <section className="run-bg min-h-[60vh] p-6 font-run" style={{minHeight:'calc(100vh - 4rem)'}}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">RUN</h1>
          <p className="mt-3">Routes, moments, and energy.</p>

          {/* Gallery from uploaded items, sorted by caption */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map(it => (
              <figure key={it.id} className="rounded-lg overflow-hidden shadow cursor-pointer bg-white/10" onClick={()=>setView(it)}>
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
        <section className="read-bg separator min-h-[60vh] p-6 font-read" style={{minHeight:'calc(100vh - 4rem)'}}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">READ</h1>
          <p className="mt-3">Books, reflections, and calm.</p>
        </section>
      </div>

      {/* Full-size image modal with download */}
      <Modal open={!!view} onClose={()=>setView(null)} labelledBy="full-run-image">
        {view && (
          <div className="rounded-lg overflow-hidden shadow-lounge bg-white/10">
            <div className="p-4 flex items-center justify-between">
              <h2 id="full-run-image" className="text-lg font-semibold">{view.caption || 'Run Moment'}</h2>
              <a
                href={view.url}
                download={(view.caption || 'run-moment').replace(/\s+/g,'-') + '.jpg'}
                className="px-3 py-1 rounded-md font-semibold bg-white/20"
              >
                Download
              </a>
            </div>
            <div className="bg-black/50">
              <img src={view.url} alt={view.caption || 'Run moment'} className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
