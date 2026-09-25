import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import Badge from '../components/ui/Badge.jsx'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'bd_officer', label: 'BD Officer' },
  { value: 'programme_manager', label: 'Programme Manager' },
  { value: 'executive', label: 'Executive' },
  { value: 'finance', label: 'Finance' },
]

const EMPTY_FORM = {
  full_name: '',
  email: '',
  password: '',
  role: 'bd_officer',
  is_active: true,
}

function roleLabel(role) {
  return role?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function Users() {
  const { user: currentUser } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  async function loadUsers() {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/users/')
      setUsers(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to load users.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function openCreateForm() {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setSuccess('')
    setShowForm(true)
  }

  function openEditForm(user) {
    setEditingUser(user)
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: '',
      role: user.role,
      is_active: user.is_active,
    })
    setFormError('')
    setSuccess('')
    setShowForm(true)
  }

  function closeForm() {
    if (submitting) return

    setShowForm(false)
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setFormError('')
    setSuccess('')

    if (!form.full_name.trim()) {
      setFormError('Full name is required.')
      return
    }

    if (!form.email.trim()) {
      setFormError('Email is required.')
      return
    }

    if (!editingUser && form.password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          full_name: form.full_name,
          email: form.email,
          role: form.role,
          is_active: form.is_active,
        })

        setSuccess('User updated successfully.')
      } else {
        await api.post('/users/', {
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: form.role,
          is_active: form.is_active,
        })

        setSuccess('User created successfully.')
      }

      await loadUsers()

      setForm(EMPTY_FORM)
      setEditingUser(null)

      setTimeout(() => {
        setShowForm(false)
        setSuccess('')
      }, 800)
    } catch (err) {
      setFormError(
        err.response?.data?.detail ||
        'Could not save the user.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleUserStatus(targetUser) {
    setError('')
    setSuccess('')

    if (targetUser.id === currentUser?.id) {
      setError('You cannot deactivate your own account.')
      return
    }

    try {
      await api.patch(
        `/users/${targetUser.id}/status`,
        null,
        {
          params: {
            is_active: !targetUser.is_active,
          },
        }
      )

      setSuccess(
        targetUser.is_active
          ? 'User deactivated successfully.'
          : 'User activated successfully.'
      )

      await loadUsers()
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not update the user status.'
      )
    }
  }

  return (
    <AppLayout title="User Management">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-ink/60">
              Manage CRM users, roles and account status.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] px-4 py-2 text-sm font-medium text-white hover:brightness-90"
          >
            + Add User
          </button>
        </div>

        {error && (
          <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded border border-health-green/30 bg-health-green/5 px-3 py-2 text-sm text-health-green">
            {success}
          </p>
        )}

        {showForm && (
          <section className="rounded-xl border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg">
                  {editingUser ? 'Edit User' : 'Add User'}
                </h3>
                <p className="text-sm text-ink/60">
                  {editingUser
                    ? 'Update this user’s account details.'
                    : 'Create a new CRM user account.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-ink/50 hover:text-ink"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-ink/70">
                  Full name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink/70">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Temporary password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />

                  <p className="mt-1 text-xs text-ink/40">
                    At least 8 characters.
                  </p>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-ink/70">
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {editingUser && (
                <label className="flex items-center gap-2 text-sm text-ink/70">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                  />
                  Account active
                </label>
              )}

              {formError && (
                <div className="md:col-span-2">
                  <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">
                    {formError}
                  </p>
                </div>
              )}

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] px-4 py-2 text-sm font-medium text-white hover:brightness-90 disabled:opacity-60"
                >
                  {submitting
                    ? 'Saving...'
                    : editingUser
                      ? 'Update User'
                      : 'Create User'}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="rounded-lg border border-line px-4 py-2 text-sm text-ink/70 hover:bg-ink/5 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <p className="text-sm text-ink/60">Loading users...</p>
        ) : null}

        {!loading && !error && users.length === 0 ? (
          <div className="rounded-lg border border-line bg-white p-6 text-sm text-ink/60">
            No users found.
          </div>
        ) : null}

        {!loading && users.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {users.map((targetUser) => (
                    <tr key={targetUser.id}>
                      <td className="px-5 py-3 font-medium">
                        {targetUser.full_name}
                        {targetUser.id === currentUser?.id && (
                          <span className="ml-2 text-xs text-ink/40">
                            (You)
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3 text-ink/70">
                        {targetUser.email}
                      </td>

                      <td className="px-5 py-3 text-ink/70">
                        {roleLabel(targetUser.role)}
                      </td>

                      <td className="px-5 py-3">
                        <Badge tone={targetUser.is_active ? 'green' : 'red'}>
                          {targetUser.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(targetUser)}
                            className="rounded border border-line px-3 py-1.5 text-xs text-ink/70 hover:bg-ink/5"
                          >
                            Edit
                          </button>

                          {targetUser.id !== currentUser?.id && (
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(targetUser)}
                              className="rounded border border-line px-3 py-1.5 text-xs text-ink/70 hover:bg-ink/5"
                            >
                              {targetUser.is_active
                                ? 'Deactivate'
                                : 'Activate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}