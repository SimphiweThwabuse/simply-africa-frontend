import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { api } from '../api/client.js'

export default function Reports() {
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/reports/summary')
      .then((response) => setReport(response.data))
      .catch(() => setError('Unable to load reports.'))
  }, [])

  if (error) return <AppLayout title="Reports"><p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">{error}</p></AppLayout>
  if (!report) return <AppLayout title="Reports"><p className="text-sm text-ink/60">Loading reports...</p></AppLayout>

  return (
    <AppLayout title="Reports">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(report.totals).map(([label, value]) => <div key={label} className="rounded-lg border border-line bg-white p-5"><p className="text-xs uppercase tracking-wide text-ink/50">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {[
          ['Organisations by status', report.organisations_by_status],
          ['Opportunities by stage', report.opportunities_by_stage],
          ['Engagements by type', report.engagements_by_type],
        ].map(([title, values]) => <section key={title} className="rounded-lg border border-line bg-white p-5"><h3 className="font-serif text-lg">{title}</h3><ul className="mt-4 space-y-2 text-sm">{Object.entries(values).map(([label, value]) => <li key={label} className="flex justify-between"><span className="capitalize text-ink/60">{label.replace('_', ' ')}</span><span className="font-medium">{value}</span></li>)}</ul></section>)}
      </div>
      <section className="mt-6 rounded-lg border border-line bg-white p-5"><h3 className="font-serif text-lg">Opportunity value</h3><ul className="mt-4 space-y-2 text-sm">{Object.entries(report.opportunity_value_by_currency).map(([currency, value]) => <li key={currency} className="flex justify-between"><span className="text-ink/60">{currency}</span><span className="font-medium">{Number(value).toLocaleString('en-ZA')}</span></li>)}</ul></section>
    </AppLayout>
  )
}
