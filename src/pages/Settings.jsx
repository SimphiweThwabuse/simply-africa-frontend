import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { user, changePassword } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message }
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'New password must be at least 8 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' })
      return
    }

    setSubmitting(true)
    try {
      await changePassword(currentPassword, newPassword)
      setStatus({ type: 'success', message: 'Password updated successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.detail || 'Could not update password. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout title="Settings">
      <div className="grid max-w-2xl gap-6">
        <section className="rounded-xl border border-line bg-white p-5">
          <h3 className="mb-3 font-serif text-lg">Account</h3>
          <dl className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
            <dt className="text-ink/50">Name</dt>
            <dd>{user?.full_name}</dd>
            <dt className="text-ink/50">Email</dt>
            <dd>{user?.email}</dd>
            <dt className="text-ink/50">Role</dt>
            <dd className="capitalize">{user?.role?.replace('_', ' ')}</dd>
          </dl>
        </section>

        <section className="rounded-xl border border-line bg-white p-5">
          <h3 className="mb-1 font-serif text-lg">Change password</h3>
          <p className="mb-4 text-sm text-ink/60">
            You'll need your current password to set a new one.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Current password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">New password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
              <p className="mt-1 text-xs text-ink/40">At least 8 characters.</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Confirm new password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            {status && (
              <p
                className={`rounded px-3 py-2 text-sm ${
                  status.type === 'success'
                    ? 'border border-health-green/30 bg-health-green/5 text-health-green'
                    : 'border border-health-red/30 bg-health-red/5 text-health-red'
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] px-4 py-2 text-sm font-medium text-white hover:brightness-90 disabled:opacity-60"
            >
              {submitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </section>
      </div>
    </AppLayout>
  )
}
