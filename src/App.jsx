import { useState, useEffect } from 'react'
import { onAuthChange, logout, getUserData, createChat, listenToUserChats } from './firebase'
import AuthModal from './components/AuthModal'
import Pricing from './components/Pricing'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import { Menu, Sparkles } from 'lucide-react'

export default function App() {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u)
      if (u) {
        const data = await getUserData(u.uid)
        setUserData(data)
      } else {
        setUserData(null)
        setChats([])
        setCurrentChatId(null)
      }
      setLoadingAuth(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return
    const unsub = listenToUserChats(user.uid, (list) => {
      setChats(list)
      if (!currentChatId && list.length > 0) {
        setCurrentChatId(list[0].id)
      }
    })
    return unsub
  }, [user])

  async function handleNewChat() {
    if (!user) {
      setShowAuth(true)
      return
    }
    const id = await createChat(user.uid)
    setCurrentChatId(id)
  }

  async function handleLogout() {
    await logout()
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-beige-500 flex items-center justify-center animate-pulse">
            <Sparkles size={24} className="text-navy-950" />
          </div>
          <p className="text-beige-400/60 text-sm">Loading Aether...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-navy-950 text-beige-100 overflow-hidden">
      {/* Sidebar */}
      {user && (
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={setCurrentChatId}
          onNewChat={handleNewChat}
          onOpenPricing={() => setShowPricing(true)}
          onLogout={handleLogout}
          user={user}
          userData={userData}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-beige-500/10 bg-navy-900/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg text-beige-400/60 hover:text-beige-200 hover:bg-navy-700/50 lg:hidden transition"
              >
                <Menu size={20} />
              </button>
            )}
            {!user && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-beige-500 flex items-center justify-center">
                  <Sparkles size={16} className="text-navy-950" />
                </div>
                <span className="font-semibold tracking-tight text-beige-100">Aether</span>
              </div>
            )}
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-beige-300/70">Dashboard</span>
                <span className="text-beige-500/30">/</span>
                <span className="text-sm text-beige-200">Conversation</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
              bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/90 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Unrestricted
            </span>

            {!user ? (
              <button
                onClick={() => setShowAuth(true)}
                className="px-5 py-1.5 rounded-xl text-sm font-semibold text-navy-950
                  bg-gradient-to-r from-gold-500 to-beige-500 hover:from-gold-400 hover:to-beige-400
                  transition btn-glow"
              >
                Sign in
              </button>
            ) : (
              <button
                onClick={() => setShowPricing(true)}
                className="px-4 py-1.5 rounded-xl text-sm font-medium text-beige-200
                  border border-beige-500/20 hover:border-gold-500/40 hover:text-gold-300
                  transition"
              >
                {userData?.plan === 'pro' || userData?.plan === 'unlimited' ? 'Manage plan' : 'Upgrade'}
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        {user ? (
          <Chat chatId={currentChatId} user={user} userData={userData} />
        ) : (
          /* Landing */
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Soft ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium mb-8">
                <Sparkles size={12} />
                Deep reasoning · Zero restrictions
              </div>

              <h1 className="text-5xl md:text-6xl font-semibold text-beige-50 tracking-tight leading-[1.1] mb-6">
                Think deeper.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-beige-300">
                  Ask anything.
                </span>
              </h1>

              <p className="text-beige-300/70 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                An AI that answers without filters, solves hard problems with real depth,
                and keeps your full conversation history. Built for people who want the truth.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-8 py-3.5 rounded-2xl text-base font-semibold text-navy-950
                    bg-gradient-to-r from-gold-500 to-beige-500
                    hover:from-gold-400 hover:to-beige-400 transition btn-glow"
                >
                  Get started — free
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-8 py-3.5 rounded-2xl text-base font-medium text-beige-200
                    border border-beige-500/20 hover:border-beige-400/40 hover:bg-navy-800/50 transition"
                >
                  Sign in
                </button>
              </div>

              <div className="mt-16 flex items-center justify-center gap-8 text-beige-500/50 text-sm">
                <span>No content filters</span>
                <span className="w-1 h-1 rounded-full bg-beige-500/30" />
                <span>Full history</span>
                <span className="w-1 h-1 rounded-full bg-beige-500/30" />
                <span>Image analysis</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => {}} />
      )}

      {showPricing && user && (
        <Pricing user={user} userData={userData} onClose={() => setShowPricing(false)} />
      )}
    </div>
  )
}
