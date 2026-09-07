import { formatDate } from '../lib/utils'
import { Sparkles } from 'lucide-react'

export default function Message({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 msg-enter ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500/20 to-beige-600/20 border border-gold-500/30 flex items-center justify-center shrink-0 mt-1">
          <Sparkles size={14} className="text-gold-400" />
        </div>
      )}

      <div className={`max-w-[80%] md:max-w-[70%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-navy-600 to-navy-700 text-beige-100 rounded-br-md border border-beige-500/10'
              : 'glass text-beige-100 rounded-bl-md'
          }`}
        >
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="max-w-full rounded-xl mb-3 max-h-64 object-contain border border-beige-500/10"
            />
          )}
          <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {message.content}
          </div>
        </div>
        {message.createdAt && (
          <div className={`text-[11px] mt-1.5 px-1 ${isUser ? 'text-right text-beige-500/50' : 'text-beige-500/50'}`}>
            {formatDate(message.createdAt.toDate ? message.createdAt.toDate() : new Date(message.createdAt))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-navy-600 border border-beige-500/20 flex items-center justify-center shrink-0 mt-1 text-beige-300 text-xs font-semibold">
          You
        </div>
      )}
    </div>
  )
}
