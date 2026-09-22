import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const partners = [
  'Diaspora Ventures',
  'AfriGrowth Fund',
  'Ubuntu Capital',
  'PanAfrica Trade Council',
  'Baobab Partners',
  'Continental Impact Group',
  'Kente Advisory',
  'Sankofa Collective',
]

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel - matches the sidebar identity */}
      <div className="branding-panel hidden w-1/2 flex-col justify-between bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] p-12 text-white md:flex">
        <div className="branding-logo">
          <div className="flex items-center gap-3">
            <img
              src="/New_Logo.jpg"
              alt="Simply Complex Africa logo"
              className="h-24 w-24 rounded-lg object-contain"
            />
            <span className="font-serif text-lg leading-tight text-white">
              Simply Complex
              <br />
              Africa
            </span>
          </div>
          <p className="mt-3 max-w-xs font-serif text-base italic text-[#D4AF37]">
            African Diaspora women transforming business together
          </p>
        </div>

        <div className="branding-content">
          <h1 className="font-serif text-3xl leading-tight">
            Stronger Partnerships.
            <br />
            Greater Impact.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            One place to track every partner and sponsor relationship,
            from first meeting to renewed commitment.
          </p>
        </div>

        <div className="branding-partners">
          <p className="mb-2 text-xs text-white/50">
            Trusted by partners and sponsors across the continent
          </p>
          <div
            aria-hidden="true"
            className="partner-marquee-mask overflow-hidden"
          >
            <div className="partner-marquee flex w-max gap-3">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner}-${index}`}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-amber-400/25 bg-white/5 px-3 py-1.5"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-[9px] font-semibold text-ink">
                    {partner
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <span className="text-xs text-white/70">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40">Simply Complex Africa 2026</p>
      </div>

      {/* Sign in form */}
      <div className="flex w-full items-center justify-center bg-[#F7F7E7] px-6 md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="font-serif text-2xl font-semibold">Welcome back</h2>
          <p className="mt-1 text-sm text-ink/60">
            Sign in to your Partner &amp; Sponsor CRM account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@simplycomplex.africa"
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm
                           focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm
                           focus:border-accent focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] py-2.5 text-sm font-medium text-white
                         hover:brightness-90 disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink/40">
            <Link
              to="/forgot-password"
              className="transition-colors hover:text-[#8C8A3E]"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .branding-logo,
        .branding-partners,
        .branding-content {
          opacity: 0;
          transform: translateY(8px);
          animation: branding-fade-up 0.6s ease-out forwards;
        }

        .branding-logo {
          animation-delay: 0ms;
        }

        .branding-partners {
          animation-delay: 110ms;
        }

        .branding-content {
          animation-delay: 220ms;
        }

        .branding-panel {
          background-size: 100% 180%;
          animation: branding-background-shift 9s ease-in-out infinite alternate;
        }

        .partner-marquee {
          animation: partner-scroll 28s linear infinite;
        }

        .partner-marquee-mask {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
        }

        @keyframes branding-fade-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes partner-scroll {
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes branding-background-shift {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .branding-logo,
          .branding-partners,
          .branding-content {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .partner-marquee {
            animation: none;
          }

          .branding-panel {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
