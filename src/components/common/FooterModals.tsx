import React, { useState } from 'react'

export function AboutUsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Connect · Collaborate · Grow
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
              About Campus Clans
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            <strong>Campus Clans</strong> is a student-first ecosystem built to empower passionate builders, designers, and innovators. We break academic silos by bringing cross-functional peers together to build real-world software, design systems, and hardware projects.
          </p>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                🤝
              </div>
              <strong className="text-xs font-black text-slate-900 block">Connect</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Find peers across CSE, Design, ECE, and Business who share your drive.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                ⚡
              </div>
              <strong className="text-xs font-black text-slate-900 block">Collaborate</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Form clans, build prototypes, and compete together in national hackathons.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                🚀
              </div>
              <strong className="text-xs font-black text-slate-900 block">Grow</strong>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Win trophies, rise on leaderboards, and build a portfolio recruiters love.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-around text-center">
            <div>
              <strong className="text-lg font-black text-slate-900 block">48+</strong>
              <small className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Clans</small>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <strong className="text-lg font-black text-slate-900 block">2,486</strong>
              <small className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Students</small>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <strong className="text-lg font-black text-slate-900 block">120+</strong>
              <small className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Projects</small>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-amber-600 uppercase text-[10px] tracking-wider">
            Connect · Collaborate · Grow
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export function ContactUsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setEmail('')
      setMessage('')
      onClose()
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Connect · Collaborate · Grow
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
              Contact Campus Clans
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-base font-black text-slate-900">Message Dispatched!</h3>
            <p className="text-xs text-slate-500">
              Thank you for reaching out. The Campus Clans community team will reply to your campus email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quick Contact Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Support</span>
                <strong className="text-slate-800 text-[11px] truncate block">support@campus.edu</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Campus Hub</span>
                <strong className="text-slate-800 text-[11px] block">Block C, Room 302</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Khanna"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav.k@campus.edu"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message or Clan Inquiry</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist your clan or event participation?"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
