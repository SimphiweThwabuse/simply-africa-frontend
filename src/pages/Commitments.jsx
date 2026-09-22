import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Badge from '../components/ui/Badge.jsx'
import { api } from '../api/client.js'

export default function Commitments() {
  const [commitments, setCommitments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/commitments/')
      .then((response) => setCommitments(response.data.items))
      .catch(() => setError('Unable to load commitments.'))
      .finally(() => setLoading(false))
  }, [])

  const formatValue = (commitment) => commitment.committed_value == null
    ? '-'
    : `ZAR ${Number(commitment.committed_value).toLocaleString('en-ZA')}`

  return (
    <AppLayout title="Commitments">
      {loading ? <p className="text-sm text-ink/60">Loading commitments...</p> : null}
      {error ? <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">{error}</p> : null}
      {!loading && !error && commitments.length === 0 ? <EmptyState title="No commitments yet" description="Commitments linked to your organisations will appear here." /> : null}
      {!loading && !error && commitments.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                <tr><th className="px-5 py-3 font-medium">Commitment</th><th className="px-5 py-3 font-medium">Organisation</th><th className="px-5 py-3 font-medium">Opportunity</th><th className="px-5 py-3 font-medium">Value</th><th className="px-5 py-3 font-medium">Due</th><th className="px-5 py-3 font-medium">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {commitments.map((commitment) => (
                  <tr key={commitment.id}>
                    <td className="px-5 py-3 font-medium">{commitment.description}</td>
                    <td className="px-5 py-3 text-ink/70">{commitment.organisation_name}</td>
                    <td className="px-5 py-3 text-ink/70">{commitment.opportunity_title || '-'}</td>
                    <td className="px-5 py-3 font-medium text-accent">{formatValue(commitment)}</td>
                    <td className="px-5 py-3 text-ink/70">{commitment.due_date || '-'}</td>
                    <td className="px-5 py-3"><Badge tone={commitment.delivery_status === 'delivered' ? 'green' : commitment.delivery_status === 'overdue' ? 'red' : 'amber'}>{commitment.delivery_status.replace('_', ' ')}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </AppLayout>
  )
}
