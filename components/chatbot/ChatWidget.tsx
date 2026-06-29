'use client'

import { useRef, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your NovaSense advisor. Ask me anything about our smart hub." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = (await res.json()) as { content?: string; error?: string }
      const reply = data.content ?? 'Sorry, I encountered an error. Please try again.'
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 flex h-[480px] w-[340px] flex-col overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg-card) shadow-lg sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-(--color-border) bg-(--color-accent) px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">NovaSense Advisor</p>
              <p className="text-xs text-white/70">Online</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} content={m.content} />
            ))}
            {loading && <ChatMessage role="assistant" content="" loading />}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-(--color-border) px-4 py-3">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about NovaSense..."
                aria-label="Chat message"
                className="flex-1 rounded-md border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex items-center justify-center rounded-md bg-(--color-accent) px-3 py-2 text-white transition-colors hover:bg-(--color-accent-hover) disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open product advisor chat"
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105',
          open ? 'bg-(--color-bg-card) border border-(--color-border) text-(--color-text-primary)' : 'bg-(--color-accent) text-white',
        )}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  )
}
