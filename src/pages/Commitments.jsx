import { useEffect, useMemo, useState } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Badge from '../components/ui/Badge.jsx'
import { api } from '../api/client.js'

const EMPTY_FORM = {
  organisation_id: '',
  opportunity_id: '',
  responsible_id: '',
  description: '',
  committed_value: '',
  due_date: '',
  delivery_status: 'pending',
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

function statusTone(status) {
  if (status === 'delivered' || status === 'completed') return 'green'
  if (status === 'overdue' || status === 'cancelled') return 'red'
  return 'amber'
}

export default function Commitments() {
  const [commitments, setCommitments] = useState([])
  const [organisations, setOrganisations] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)

  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingCommitment, setEditingCommitment] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    loadCommitments()
  }, [])

  const loadCommitments = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/commitments/')
      setCommitments(response.data.items || [])
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to load commitments.'
      )
    } finally {
      setLoading(false)
    }
  }

  const loadFormData = async () => {
    setFormLoading(true)
    setFormError('')

    try {
      const [organisationResponse, opportunityResponse, usersResponse] =
        await Promise.all([
          api.get('/organisations/'),
          api.get('/opportunities/'),
          api.get('/users/'),
        ])

      setOrganisations(organisationResponse.data || [])
      setOpportunities(opportunityResponse.data.items || [])
      setUsers(
        (usersResponse.data || []).filter((user) => user.is_active)
      )
    } catch (err) {
      setFormError(
        err.response?.data?.detail ||
        'Unable to load the information needed for the commitment form.'
      )
    } finally {
      setFormLoading(false)
    }
  }

  const availableOpportunities = useMemo(() => {
    if (!form.organisation_id) return []

    return opportunities.filter(
      (opportunity) =>
        String(opportunity.organisation_id) === String(form.organisation_id)
    )
  }, [opportunities, form.organisation_id])

  const formatValue = (commitment) =>
    commitment.committed_value == null
      ? '-'
      : `ZAR ${Number(commitment.committed_value).toLocaleString('en-ZA')}`

  const openCreateForm = async () => {
    setEditingCommitment(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setError('')
    setSuccess('')
    setShowForm(true)

    await loadFormData()
  }

  const openEditForm = async (commitment) => {
    setEditingCommitment(commitment)
    setForm({
      organisation_id: commitment.organisation_id ?? '',
      opportunity_id: commitment.opportunity_id ?? '',
      responsible_id: commitment.responsible_id ?? '',
      description: commitment.description ?? '',
      committed_value: commitment.committed_value ?? '',
      due_date: commitment.due_date ?? '',
      delivery_status: commitment.delivery_status ?? 'pending',
    })

    setFormError('')
    setError('')
    setSuccess('')
    setShowForm(true)

    await loadFormData()
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCommitment(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => {
      const next = {
        ...current,
        [name]: value,
      }

      // Reset opportunity when organisation changes
      if (name === 'organisation_id') {
        next.opportunity_id = ''
      }

      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setFormError('')
    setError('')
    setSuccess('')

    if (!form.organisation_id) {
      setFormError('Please select an organisation.')
      return
    }

    if (!form.description.trim()) {
      setFormError('Please enter a commitment description.')
      return
    }

    setFormLoading(true)

    try {
      const payload = {
        organisation_id: Number(form.organisation_id),
        opportunity_id: form.opportunity_id
          ? Number(form.opportunity_id)
          : null,
        responsible_id: form.responsible_id
          ? Number(form.responsible_id)
          : null,
        description: form.description.trim(),
        committed_value:
          form.committed_value === ''
            ? null
            : Number(form.committed_value),
        due_date: form.due_date || null,
        delivery_status: form.delivery_status,
      }

      if (editingCommitment) {
        await api.put(
          `/commitments/${editingCommitment.id}`,
          payload
        )

        setSuccess('Commitment updated successfully.')
      } else {
        await api.post('/commitments/', payload)

        setSuccess('Commitment created successfully.')
      }

      await loadCommitments()

      setTimeout(() => {
        setShowForm(false)
        setEditingCommitment(null)
        setForm(EMPTY_FORM)
        setSuccess('')
      }, 700)
    } catch (err) {
      setFormError(
        err.response?.data?.detail ||
        'Unable to save the commitment.'
      )
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (commitment) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this commitment?'
    )

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      await api.delete(`/commitments/${commitment.id}`)

      setSuccess('Commitment deleted successfully.')

      await loadCommitments()
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to delete the commitment.'
      )
    }
  }

  return (
    <AppLayout title="Commitments">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/60">
            Track commitments, responsible people, delivery status and due dates.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] px-4 py-2 text-sm font-medium text-white hover:brightness-90"
          >
            + Add Commitment
          </button>
        </div>

        {error ? (
          <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded border border-health-green/30 bg-health-green/5 px-3 py-2 text-sm text-health-green">
            {success}
          </p>
        ) : null}

        {showForm ? (
          <section className="rounded-xl border border-line bg-white p-5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="font-serif text-lg">
                  {editingCommitment
                    ? 'Edit Commitment'
                    : 'Add Commitment'}
                </h2>

                <p className="text-sm text-ink/60">
                  {editingCommitment
                    ? 'Update the commitment details and responsible person.'
                    : 'Record a new commitment and assign responsibility.'}
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

            {formError ? (
              <p className="mb-4 rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">
                {formError}
              </p>
            ) : null}

            {formLoading && !organisations.length ? (
              <p className="text-sm text-ink/60">
                Loading form data...
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-4 md:grid-cols-2"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Organisation
                  </label>

                  <select
                    name="organisation_id"
                    value={form.organisation_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="">Select organisation</option>

                    {organisations.map((organisation) => (
                      <option
                        key={organisation.id}
                        value={organisation.id}
                      >
                        {organisation.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Opportunity
                  </label>

                  <select
                    name="opportunity_id"
                    value={form.opportunity_id}
                    onChange={handleChange}
                    disabled={!form.organisation_id}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none disabled:opacity-50"
                  >
                    <option value="">
                      {form.organisation_id
                        ? 'Select opportunity (optional)'
                        : 'Select organisation first'}
                    </option>

                    {availableOpportunities.map((opportunity) => (
                      <option
                        key={opportunity.id}
                        value={opportunity.id}
                      >
                        {opportunity.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Responsible Person
                  </label>

                  <select
                    name="responsible_id"
                    value={form.responsible_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="">Unassigned</option>

                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Committed Value
                  </label>

                  <input
                    type="number"
                    name="committed_value"
                    value={form.committed_value}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 150000"
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Commitment
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Describe what has been committed."
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-ink/70">
                    Delivery Status
                  </label>

                  <select
                    name="delivery_status"
                    value={form.delivery_status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 md:col-span-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="rounded-lg bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] px-4 py-2 text-sm font-medium text-white hover:brightness-90 disabled:opacity-60"
                  >
                    {formLoading
                      ? 'Saving...'
                      : editingCommitment
                        ? 'Update Commitment'
                        : 'Create Commitment'}
                  </button>

                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={formLoading}
                    className="rounded-lg border border-line px-4 py-2 text-sm text-ink/70 hover:bg-ink/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        ) : null}

        {loading ? (
          <p className="text-sm text-ink/60">
            Loading commitments...
          </p>
        ) : null}

        {!loading && !error && commitments.length === 0 ? (
          <EmptyState
            title="No commitments yet"
            description="Commitments linked to your organisations will appear here."
          />
        ) : null}

        {!loading && commitments.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                  <tr>
                    <th className="px-5 py-3 font-medium">Commitment</th>
                    <th className="px-5 py-3 font-medium">Organisation</th>
                    <th className="px-5 py-3 font-medium">Opportunity</th>
                    <th className="px-5 py-3 font-medium">Responsible</th>
                    <th className="px-5 py-3 font-medium">Value</th>
                    <th className="px-5 py-3 font-medium">Due</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line">
                  {commitments.map((commitment) => (
                    <tr key={commitment.id}>
                      <td className="px-5 py-3 font-medium">
                        {commitment.description}
                      </td>

                      <td className="px-5 py-3 text-ink/70">
                        {commitment.organisation_name}
                      </td>

                      <td className="px-5 py-3 text-ink/70">
                        {commitment.opportunity_title || '-'}
                      </td>

                      <td className="px-5 py-3 text-ink/70">
                        {commitment.responsible_name || 'Unassigned'}
                      </td>

                      <td className="px-5 py-3 font-medium text-accent">
                        {formatValue(commitment)}
                      </td>

                      <td className="px-5 py-3 text-ink/70">
                        {commitment.due_date || '-'}
                      </td>

                      <td className="px-5 py-3">
                        <Badge tone={statusTone(commitment.delivery_status)}>
                          {commitment.delivery_status.replace('_', ' ')}
                        </Badge>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(commitment)}
                            className="rounded border border-line px-3 py-1.5 text-xs text-ink/70 hover:bg-ink/5"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(commitment)}
                            className="rounded border border-health-red/30 px-3 py-1.5 text-xs text-health-red hover:bg-health-red/5"
                          >
                            Delete
                          </button>
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
