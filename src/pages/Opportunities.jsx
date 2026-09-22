import AppLayout from '../components/layout/AppLayout.jsx'
import Badge from '../components/ui/Badge.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

const STAGES = ['lead', 'contacted', 'proposal', 'negotiation', 'active', 'won', 'lost']
const STAGE_LABELS = {
  lead: 'Lead',
  contacted: 'Contacted',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  active: 'Active',
  won: 'Won',
  lost: 'Lost',
}
export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/opportunities/')
      .then((response) => setOpportunities(response.data.items))
      .catch(() => setError('Unable to load opportunities.'))
      .finally(() => setLoading(false))
  }, [])

  const formatValue = (opportunity) => opportunity.estimated_value == null
    ? '-'
    : `${opportunity.currency} ${Number(opportunity.estimated_value).toLocaleString('en-ZA')}`

  return (
    <AppLayout title="Opportunities">
      {loading ? <p className="text-sm text-ink/60">Loading opportunities...</p> : null}
      {error ? <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">{error}</p> : null}
      {!loading && !error && opportunities.length === 0 ? <EmptyState title="No opportunities yet" description="Potential funding, sponsorship, and partnership opportunities will appear here." /> : null}
      {!loading && !error && opportunities.length > 0 ? <div className="flex gap-4 overflow-x-auto pb-2 lg:flex-wrap">
        {STAGES.map((stage) => (
          <div key={stage} className="min-w-[220px] flex-1 rounded-lg bg-ink/5 p-3 lg:min-w-[180px]">
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink/50">
              {STAGE_LABELS[stage]}
            </h4>
            <div className="space-y-2">
              {opportunities.filter((o) => o.stage === stage).map((o) => (
                <div key={o.id} className="rounded border border-line bg-white p-3 text-sm">
                  <p className="font-medium">{o.title}</p>
                  <p className="text-ink/60">{o.organisation_name}</p>
                  <p className="mt-1 text-accent font-medium">{formatValue(o)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> : null}
    </AppLayout>
  )
}
