import { Plus, MessageSquare, LogOut, CreditCard, User, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onOpenPricing,
  onLogout,
  user,
  userData,
  collapsed,
  onToggle
}) {
  return (
    <aside className={`relative flex flex-col transition-all duration-300 ease-out border-r border-beige-500/10
      ${collapsed ? 'w-[72px]' : 'w-72'} 
      bg-navy-900/90 backdrop-blur-xl`}>
      
      {/* Logo / Brand */}
      <div className="px-4 py-5 border-b border-beige-500/10">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-beige-600 flex items-center justify-center shadow-glow">
            <Sparkles size={18} className="text-navy-950" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-semibold text-beige-100 tracking-tight">Aether</div>
              <div className="text-[11px] text-beige-400/70">Unrestricted AI</div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-2.5 rounded-xl font-medium text-sm transition-all
            bg-gradient-to-r from-gold-500 to-beige-500 text-navy-950
            hover:from-gold-400 hover:to-beige-400 btn-glow
            ${collapsed ? 'justify-center p-3' : 'px-4 py-2.5'}`}
        >
          <Plus size={18} strokeWidth={2.5} />
          {!collapsed && <span>New conversation</span>}
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
        {!collapsed && (
          <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-beige-500/50 font-medium">
            Recent
          </div>
        )}
        {chats.map(chat => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left flex items-center gap-2.5 rounded-xl text-sm transition-all group
              ${currentChatId === chat.id
                ? 'bg-beige-500/10 text-beige-100 border border-beige-500/20'
                : 'text-beige-300/70 hover:bg-navy-700/60 hover:text-beige-100 border border-transparent'
              }
              ${collapsed ? 'justify-center p-3' : 'px-3 py-2.5'}`}
          >
            <MessageSquare size={16} className={`shrink-0 ${currentChatId === chat.id ? 'text-gold-400' : 'text-beige-500/50 group-hover:text-beige-300'}`} />
            {!collapsed && (
              <span className="truncate">{chat.title || 'New conversation'}</span>
            )}
          </button>
        ))}
      </div>

      {/* User section */}
      <div className="p-3 border-t border-beige-500/10 space-y-1">
        {user && (
          <>
            <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-600 to-navy-700 border border-beige-500/20 flex items-center justify-center text-beige-300 text-xs font-semibold">
                {(userData?.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-medium text-beige-100 truncate">
                    {userData?.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[11px] text-gold-400/80 capitalize">
                    {userData?.plan || 'free'} plan
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onOpenPricing}
              className={`w-full flex items-center gap-2.5 rounded-xl text-sm text-beige-300/80 hover:text-beige-100 hover:bg-navy-700/50 transition
                ${collapsed ? 'justify-center p-3' : 'px-3 py-2'}`}
            >
              <CreditCard size={16} />
              {!collapsed && <span>Billing & Plans</span>}
            </button>

            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-2.5 rounded-xl text-sm text-beige-400/60 hover:text-red-300 hover:bg-red-950/30 transition
                ${collapsed ? 'justify-center p-3' : 'px-3 py-2'}`}
            >
              <LogOut size={16} />
              {!collapsed && <span>Sign out</span>}
            </button>
          </>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 mt-1 text-beige-500/40 hover:text-beige-300 transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
