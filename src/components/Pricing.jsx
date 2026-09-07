import { useState } from 'react'
import { PLANS, redirectToCheckout, openCustomerPortal } from '../stripe'
import { Check, Zap, Crown, X, Sparkles } from 'lucide-react'

export default function Pricing({ user, userData, onClose }) {
  const [loading, setLoading] = useState(null)

  async function handleSubscribe(plan) {
    if (!user || plan.id === 'free') return
    setLoading(plan.id)
    try {
      await redirectToCheckout(plan.priceId, user.uid, user.email)
    } catch (err) {
      alert('Checkout failed: ' + err.message)
    } finally {
      setLoading(null)
    }
  }

  async function handleManage() {
    setLoading('portal')
    try {
      await openCustomerPortal(user.uid)
    } catch (err) {
      alert('Could not open portal: ' + err.message)
    } finally {
      setLoading(null)
    }
  }

  const currentPlan = userData?.plan || 'free'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 rounded-3xl overflow-hidden shadow-card border border-beige-500/15 bg-navy-900">
        
        {/* Header */}
        <div className="relative px-8 pt-10 pb-8 text-center border-b border-beige-500/10 bg-gradient-to-b from-navy-800/80 to-navy-900">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-beige-400/50 hover:text-beige-200 transition"
          >
            <X size={22} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium mb-4">
            <Sparkles size={12} />
            Flexible plans
          </div>
          <h2 className="text-3xl font-semibold text-beige-50 tracking-tight">
            Choose your experience
          </h2>
          <p className="text-beige-400/70 mt-2 max-w-md mx-auto text-sm">
            Unlock unlimited deep reasoning and solve the hardest problems without limits.
          </p>
        </div>

        {/* Plans */}
        <div className="p-8 grid md:grid-cols-3 gap-6">
          {Object.values(PLANS).map(plan => {
            const isCurrent = currentPlan === plan.id
            const isPro = plan.id === 'pro'
            const isUnlimited = plan.id === 'unlimited'

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all
                  ${isPro
                    ? 'bg-gradient-to-b from-navy-700/80 to-navy-800 border-2 border-gold-500/40 shadow-glow'
                    : 'bg-navy-800/50 border border-beige-500/10'
                  }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full
                    bg-gradient-to-r from-gold-500 to-beige-500 text-navy-950 text-xs font-bold tracking-wide">
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  {isUnlimited && <Crown size={18} className="text-gold-400" />}
                  {isPro && <Zap size={18} className="text-gold-400" />}
                  <h3 className="text-lg font-semibold text-beige-100">{plan.name}</h3>
                </div>

                <div className="mb-5">
                  <span className="text-4xl font-bold text-beige-50">${plan.price}</span>
                  {plan.price > 0 && <span className="text-beige-400/60 text-sm">/month</span>}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-beige-200/80">
                      <Check size={16} className="text-gold-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-navy-700 text-beige-400/70 font-medium cursor-default border border-beige-500/10"
                  >
                    Current plan
                  </button>
                ) : plan.id === 'free' ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl border border-beige-500/15 text-beige-400/50"
                  >
                    Free forever
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!loading}
                    className={`w-full py-2.5 rounded-xl font-semibold transition disabled:opacity-50
                      ${isPro
                        ? 'bg-gradient-to-r from-gold-500 to-beige-500 text-navy-950 hover:from-gold-400 hover:to-beige-400 btn-glow'
                        : 'bg-beige-100 text-navy-900 hover:bg-beige-50'
                      }`}
                  >
                    {loading === plan.id ? 'Redirecting...' : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {userData?.subscriptionStatus === 'active' && (
          <div className="px-8 pb-8 text-center">
            <button
              onClick={handleManage}
              disabled={loading === 'portal'}
              className="text-sm text-gold-400/80 hover:text-gold-300 transition"
            >
              {loading === 'portal' ? 'Opening...' : 'Manage subscription & billing →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
