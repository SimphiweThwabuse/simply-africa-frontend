import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Badge from '../components/ui/Badge.jsx'
import { api } from '../api/client.js'

export default function Engagements() {
  const [engagements, setEngagements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/engagements/')
      .then((response) => setEngagements(response.data.items))
      .catch(() => setError('Unable to load engagements.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppLayout title="Engagements">
      {loading ? <p className="text-sm text-ink/60">Loading engagements...</p> : null}
      {error ? <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">{error}</p> : null}
      {!loading && !error && engagements.length === 0 ? <EmptyState title="No engagements yet" description="Logged meetings, calls, emails, and events will appear here." /> : null}
      {!loading && !error && engagements.length > 0 ? (
        <div className="space-y-3">
          {engagements.map((engagement) => (
            <article key={engagement.id} className="rounded-lg border border-line bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><h3 className="font-medium">{engagement.organisation_name}</h3><p className="text-xs text-ink/50">{new Date(engagement.occurred_at).toLocaleString()}</p></div>
                <Badge tone="blue">{engagement.engagement_type.replace('_', ' ')}</Badge>
              </div>
              {engagement.summary ? <p className="mt-3 text-sm text-ink/70">{engagement.summary}</p> : null}
              {engagement.next_action ? <p className="mt-2 text-xs text-ink/50">Next: {engagement.next_action}</p> : null}
            </article>
          ))}
        </div>
      ) : null}
    </AppLayout>
  )
}
