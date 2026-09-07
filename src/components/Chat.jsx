import { useState, useEffect, useRef } from 'react'
import Message from './Message'
import { addMessage, listenToMessages } from '../firebase'
import { askAI } from '../ai'
import { Send, ImagePlus, Loader2, Sparkles } from 'lucide-react'

export default function Chat({ chatId, user, userData }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const bottomRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!chatId) return
    const unsub = listenToMessages(chatId, setMessages)
    return unsub
  }, [chatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function uploadToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (!data.secure_url) throw new Error('Cloudinary upload failed')
    return data.secure_url
  }

  async function handleSend(e) {
    e?.preventDefault()
    if ((!input.trim() && !imageFile) || loading || !chatId) return

    if (userData?.plan === 'free' && (userData?.messageCount || 0) >= 20) {
      alert('Free plan limit reached (20 messages/day). Upgrade to continue.')
      return
    }

    setLoading(true)
    let imageUrl = null

    try {
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile)
      }

      const userContent = input.trim() || (imageUrl ? '[Image uploaded]' : '')
      await addMessage(chatId, 'user', userContent, imageUrl)

      const history = [...messages, { role: 'user', content: userContent, imageUrl }]
        .slice(-20)
        .map(m => ({ role: m.role, content: m.content, imageUrl: m.imageUrl }))

      const reply = await askAI(history, imageUrl)
      await addMessage(chatId, 'assistant', reply)

      setInput('')
      setImageFile(null)
      setImagePreview(null)
    } catch (err) {
      console.error(err)
      await addMessage(chatId, 'assistant', `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold-500/20 to-beige-600/10 border border-gold-500/20 flex items-center justify-center">
            <Sparkles size={28} className="text-gold-400" />
          </div>
          <p className="text-beige-400/70">Select a conversation or start a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-500/20 to-beige-600/10 border border-gold-500/25 flex items-center justify-center mb-6 shadow-glow">
              <Sparkles size={36} className="text-gold-400" />
            </div>
            <h2 className="text-2xl font-semibold text-beige-100 mb-2 tracking-tight">
              What would you like to explore?
            </h2>
            <p className="text-beige-400/70 text-sm leading-relaxed">
              Ask anything. No restrictions. Deep reasoning for complex problems.
              Upload images for analysis. Your history is saved securely.
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {messages.map(m => (
            <Message key={m.id} message={m} />
          ))}
          {loading && (
            <div className="flex gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500/20 to-beige-600/20 border border-gold-500/30 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-gold-400" />
              </div>
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2.5 text-beige-300/80">
                <Loader2 size={16} className="animate-spin text-gold-400" />
                <span className="text-sm">Thinking deeply...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-beige-500/10 bg-navy-900/50 backdrop-blur-xl p-4 md:p-5">
        <div className="max-w-3xl mx-auto">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img src={imagePreview} alt="preview" className="h-20 rounded-xl border border-beige-500/20" />
              <button
                onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600/90 text-white text-xs flex items-center justify-center hover:bg-red-500"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-3 text-beige-400/60 hover:text-gold-400 hover:bg-navy-700/60 rounded-xl transition"
              title="Upload image"
            >
              <ImagePlus size={20} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask any question or describe a difficult problem..."
                rows={1}
                className="w-full bg-navy-800/80 border border-beige-500/15 rounded-2xl px-4 py-3.5 pr-12
                  text-beige-100 placeholder-beige-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40
                  focus:border-gold-500/30 resize-none max-h-40 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!input.trim() && !imageFile)}
              className="p-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-beige-500 text-navy-950
                hover:from-gold-400 hover:to-beige-400 disabled:opacity-30 disabled:cursor-not-allowed
                transition btn-glow"
            >
              <Send size={18} strokeWidth={2.5} />
            </button>
          </form>

          <p className="text-center text-[11px] text-beige-500/40 mt-3 tracking-wide">
            Unrestricted mode · History saved · <span className="text-gold-500/60 capitalize">{userData?.plan || 'free'}</span> plan
          </p>
        </div>
      </div>
    </div>
  )
}
