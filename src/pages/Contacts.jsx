import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { api } from '../api/client.js'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/contacts/')
      .then((response) => setContacts(response.data))
      .catch(() => setError('Unable to load contacts.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AppLayout title="Contacts">
      {loading ? <p className="text-sm text-ink/60">Loading contacts...</p> : null}
      {error ? <p className="rounded border border-health-red/30 bg-health-red/5 px-3 py-2 text-sm text-health-red">{error}</p> : null}
      {!loading && !error && contacts.length === 0 ? (
        <EmptyState title="No contacts yet" description="Contacts linked to your organisations will appear here." />
      ) : null}
      {!loading && !error && contacts.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-ink/5 text-left text-xs uppercase tracking-wide text-ink/50">
                <tr><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Mobile</th><th className="px-5 py-3 font-medium">Primary</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-5 py-3 font-medium">{contact.full_name}</td>
                    <td className="px-5 py-3 text-ink/70">{contact.job_title || '-'}</td>
                    <td className="px-5 py-3 text-ink/70">{contact.email || '-'}</td>
                    <td className="px-5 py-3 text-ink/70">{contact.mobile || '-'}</td>
                    <td className="px-5 py-3 text-ink/70">{contact.is_primary ? 'Yes' : 'No'}</td>
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
