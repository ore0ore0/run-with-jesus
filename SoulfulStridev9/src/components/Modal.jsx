import React from 'react'
export default function Modal({ open, onClose, children, labelledBy }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="relative z-10 max-w-4xl w-[94%]">
        {children}
      </div>
    </div>
  )
}
