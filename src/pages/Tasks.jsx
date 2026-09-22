import AppLayout from '../components/layout/AppLayout.jsx'
import Badge from '../components/ui/Badge.jsx'

// TODO(owner: tasks person): replace with GET /api/tasks?assigned_to=me
const MOCK_TASKS = [
  { id: 1, title: 'Follow up on renewal terms', due: 'Overdue (3 days)', tone: 'red' },
  { id: 2, title: 'Send updated proposal to Naspers', due: 'Today', tone: 'amber' },
  { id: 3, title: 'Confirm site visit date', due: 'This week', tone: 'neutral' },
]

export default function Tasks() {
  return (
    <AppLayout title="Tasks">
      <div className="rounded-lg border border-line bg-white divide-y divide-line">
        {MOCK_TASKS.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-5 py-3">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-accent" />
              {t.title}
            </label>
            <Badge tone={t.tone}>{t.due}</Badge>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
