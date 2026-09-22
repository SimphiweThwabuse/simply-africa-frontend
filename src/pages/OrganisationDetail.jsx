import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'
import Badge from '../components/ui/Badge.jsx'
import { api } from '../api/client.js'

export default function OrganisationDetail() {
  const { id } = useParams()
  const [organisation, setOrganisation] = useState(null)
  const [contacts, setContacts] = useState([])
  const [engagements, setEngagements] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.allSettled([
      api.get(`/organisations/${id}`),
      api.get(`/contacts/?organisation_id=${id}`),
      api.get(`/engagements/?organisation_id=${id}`),
      api.get(`/opportunities/?organisation_id=${id}`),
    ])
      .then(([organisationResult, contactsResult, engagementsResult, opportunitiesResult]) => {
        if (organisationResult.status === 'fulfilled') {
          setOrganisation(organisationResult.value.data)
        }
        if (contactsResult.status === 'fulfilled') {
          setContacts(contactsResult.value.data)
        }
        if (engagementsResult.status === 'fulfilled') {
          setEngagements(engagementsResult.value.data.items)
        }
        if (opportunitiesResult.status === 'fulfilled') {
          setOpportunities(opportunitiesResult.value.data.items)
        }
        if (organisationResult.status === 'rejected') {
          setError('This organisation could not be loaded.')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <AppLayout title="Organisation"><p className="text-sm text-ink/60">Loading organisation...</p></AppLayout>
  }

  if (error || !organisation) {
    return <AppLayout title="Organisation not found"><p className="text-sm text-ink/60">This organisation could not be found.</p></AppLayout>
  }

  return (
    <AppLayout title={organisation.name}>
      <Link
        to="/organisations"
        className="mb-4 inline-flex items-center gap-2 text-sm text-ink/60 transition-colors hover:text-[#8C8A3E]"
      >
        <ArrowLeft size={15} /> Back to organisations
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-ink/60">{organisation.sector || 'No sector recorded'}</span>
        <Badge tone={organisation.health_status}>{organisation.health_status} relationship</Badge>
      </div>

      <div className="flex flex-wrap gap-6">
        <section className="min-w-0 flex-1 basis-full rounded-lg border border-line bg-white p-5 lg:basis-0">
          <h3 className="font-serif text-lg mb-3">Contacts</h3>
          {contacts.length === 0 ? <p className="text-sm text-ink/60">No contacts recorded.</p> : null}
          <ul className="space-y-2">
            {contacts.map((c) => (
              <li key={c.id} className="text-sm">
                <span className="font-medium">{c.full_name}</span>
                <span className="text-ink/60"> — {c.job_title}</span>
                {c.is_primary && <Badge tone="neutral"> primary </Badge>}
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0 flex-1 basis-full rounded-lg border border-line bg-white p-5 lg:basis-0">
          <h3 className="font-serif text-lg mb-3">Open opportunities</h3>
          {opportunities.length === 0 ? <p className="text-sm text-ink/60">No opportunities recorded.</p> : null}
          <ul className="space-y-2">
            {opportunities.map((o) => (
              <li key={o.id} className="text-sm flex justify-between">
                <span>{o.title}</span>
                <span className="text-ink/60">{o.estimated_value == null ? '-' : `${o.currency} ${Number(o.estimated_value).toLocaleString('en-ZA')}`}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0 basis-full rounded-lg border border-line bg-white p-5">
          <h3 className="font-serif text-lg mb-3">Engagement timeline</h3>
          {engagements.length === 0 ? <p className="text-sm text-ink/60">No engagements recorded.</p> : null}
          <ul className="space-y-3">
            {engagements.map((e) => (
              <li key={e.id} className="border-l-2 border-accent pl-4 text-sm">
                <span className="text-ink/50">{new Date(e.occurred_at).toLocaleDateString('en-CA')}</span> — {e.summary || 'Engagement recorded.'}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  )
}
