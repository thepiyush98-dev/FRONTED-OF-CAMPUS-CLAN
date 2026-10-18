import React, { useState } from "react"
import { CampusMessage, Student, Clan } from "@/types"
import GlassCard from "@/components/common/GlassCard"
import Icon from "@/components/common/Icon"
import api from "@/services/api"

interface MessagesViewProps {
  students: Student[]
  clans: Clan[]
  messages: CampusMessage[]
  onSendMessage: (msg: Omit<CampusMessage, "id" | "sentAt" | "deliveryStatus">) => void
}

/**
 * MessagesView: Campus Messages & Announcements
 * Strictly implements Section 7 (Compose-message screen, sending workflow, and message history).
 */
export default function MessagesView({
  students,
  clans,
  messages,
  onSendMessage,
}: MessagesViewProps) {
  // Section 7 Compose-message state
  const [audienceType, setAudienceType] = useState<"individual" | "clan">("clan")
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(clans[0]?.id || "")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Message history filter
  const [historySearch, setHistorySearch] = useState("")

  // Recipient resolution
  const recipientName =
    audienceType === "clan"
      ? clans.find((c) => c.id === selectedRecipientId)?.name || "Selected Clan"
      : students.find((s) => s.id === selectedRecipientId)?.name || "Selected Student"

  // Section 7 Sending Workflow via AJAX
  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return

    setIsSending(true)
    setFeedback(null)

    try {
      // Real asynchronous AJAX POST request to backend API
      const sentMessage = await api.messages.send({
        audienceType,
        recipientId: selectedRecipientId,
        recipientName,
        subject,
        body,
      })

      onSendMessage(sentMessage)

      setFeedback({
        type: "success",
        text: `Message successfully dispatched to ${recipientName}. Visible to all target members.`,
      })

      // Reset form
      setSubject("")
      setBody("")
    } catch (err: unknown) {
      const error = err as Error
      setFeedback({
        type: "error",
        text: error.message || "AJAX request failed. Please check network and retry.",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Filter history
  const filteredMessages = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
      m.recipientName.toLowerCase().includes(historySearch.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-fade pb-10">
      {/* Compose & Live Preview Grid (Section 7 Recommended Components) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block mb-0.5">
                Communication Hub
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Compose Administrative Message
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Official Campus Broadcast
            </span>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            {/* Step 1: Audience Selector (Section 7) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                1. Target Audience Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAudienceType("clan")
                    setSelectedRecipientId(clans[0]?.id || "")
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    audienceType === "clan"
                      ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon name="clans" size={16} />
                  <span>Entire Clan (All Team Members)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAudienceType("individual")
                    setSelectedRecipientId(students[0]?.id || "")
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    audienceType === "individual"
                      ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon name="users" size={16} />
                  <span>Individual Student Direct Message</span>
                </button>
              </div>
            </div>

            {/* Step 2: Searchable Recipient Selector (Section 7) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                2. Select Recipient {audienceType === "clan" ? "Clan" : "Student"}
              </label>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              >
                {audienceType === "clan"
                  ? clans.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.memberCount} members · {c.speciality})
                      </option>
                    ))
                  : students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (@{s.username} · {s.branch})
                      </option>
                    ))}
              </select>
            </div>

            {/* Step 3: Subject Line (Section 7) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                3. Subject or Announcement Title
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Schedule update for upcoming hackathon finals..."
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Step 4: Message Body (Section 7) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                4. Message Content
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write the administrative announcement or direct feedback here..."
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400 leading-relaxed"
                required
              />
            </div>

            {/* Feedback message banner */}
            {feedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                <Icon name={feedback.type === "success" ? "check" : "alert"} size={16} />
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Send Button with AJAX Loading Feedback */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium">
                {audienceType === "clan"
                  ? "Broadcast will be immediately sent to all clan members' feeds."
                  : "Message will appear in the student's direct notification inbox."}
              </span>

              <button
                type="submit"
                disabled={isSending || !subject.trim() || !body.trim()}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <Icon name="refresh" size={14} className="animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Icon name="send" size={14} />
                    <span>Send Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Section 7 Live Preview Card */}
        <div className="space-y-4">
          <GlassCard className="p-6">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Live Recipient Preview
            </span>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">
                    {recipientName}
                  </strong>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Target: {audienceType === "clan" ? "Clan Channel" : "Direct Student"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Preview</span>
              </div>

              <div>
                <strong className="text-xs font-bold text-slate-800 block">
                  {subject || "Untitled Subject"}
                </strong>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed italic">
                  {body || "Message body will appear here..."}
                </p>
              </div>

              <div className="pt-2 border-t text-[10px] text-slate-400 flex justify-between">
                <span>From: Campus Administrator</span>
                <span>Campus Portal</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Message History Section (Section 7 Requirement) */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Dispatched Message History
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of previously sent campus messages, timestamps, and delivery confirmations
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Icon name="search" size={14} />
            </span>
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Filter by subject or recipient..."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredMessages.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No message records found.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {msg.audienceType === "clan" ? "Clan Broadcast" : "Direct Message"}
                    </span>
                    <strong className="text-xs font-bold text-slate-900">
                      {msg.subject}
                    </strong>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    To: <span className="font-semibold text-slate-700">{msg.recipientName}</span> — {msg.body}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <span className="text-[11px] text-slate-400">
                    {msg.sentAt}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Icon name="check" size={12} />
                    {msg.deliveryStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  )
}
