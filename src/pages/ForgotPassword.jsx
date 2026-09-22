import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7E7] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/New_Logo.jpg"
            alt="Simply Complex Africa logo"
            className="h-14 w-14 rounded-lg object-contain"
          />
          <span className="font-serif text-lg leading-tight text-ink">
            Simply Complex
            <br />
            Africa
          </span>
        </div>

        <h1 className="font-serif text-2xl font-semibold text-ink">Reset your password</h1>
        <p className="mt-1 text-sm text-ink/60">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>

        {submitted ? (
          <p className="mt-8 rounded border border-health-green/30 bg-health-green/5 px-3 py-2 text-sm text-health-green">
            If an account exists for that email, reset instructions are on their way.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@simplycomplex.africa"
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] py-2.5 text-sm font-medium text-white hover:brightness-90"
            >
              Send reset instructions
            </button>
          </form>
        )}

        <Link
          to="/signin"
          className="mt-6 block text-center text-xs text-ink/40 transition-colors hover:text-[#8C8A3E]"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
