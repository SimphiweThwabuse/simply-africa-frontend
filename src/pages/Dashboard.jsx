import { Users, Handshake, TrendingUp, ClipboardList } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import IconStatCard from '../components/ui/IconStatCard.jsx'
import DonutChart from '../components/ui/DonutChart.jsx'
import TrendLineChart from '../components/ui/TrendLineChart.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Badge from '../components/ui/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// TODO(owner: dashboard person): every MOCK_ constant below maps to one
// GET /api/dashboard/... endpoint. Replace with real fetches, same shape.

const MOCK_STATS = [
  { icon: Users, label: 'Total Partners', value: 48, change: '+12%', tone: 'blue' },
  { icon: Handshake, label: 'Active Partners', value: 37, change: '+16%', tone: 'green' },
  { icon: TrendingUp, label: 'Open Opportunities', value: 12, change: '+33%', tone: 'purple' },
  { icon: ClipboardList, label: 'Outstanding Commitments', value: 18, change: '-10%', tone: 'amber' },
]

const PARTNER_TYPES = [
  { name: 'Sponsors', value: 10, pct: 21, color: '#2F80ED' },
  { name: 'Funders', value: 8, pct: 17, color: '#1DA05C' },
  { name: 'Employers', value: 7, pct: 15, color: '#8B5CF6' },
  { name: 'Institutions', value: 9, pct: 19, color: '#E09A22' },
  { name: 'Mentors', value: 6, pct: 13, color: '#22C1DE' },
  { name: 'Speakers', value: 4, pct: 8, color: '#EC4899' },
  { name: 'Ecosystem Partners', value: 4, pct: 8, color: '#9CA3AF' },
]

const ENGAGEMENT_TRENDS = [
  { month: 'Apr', Meetings: 12, Emails: 8, Calls: 5, Events: 1 },
  { month: 'May', Meetings: 18, Emails: 11, Calls: 7, Events: 2 },
  { month: 'Jun', Meetings: 15, Emails: 14, Calls: 6, Events: 3 },
  { month: 'Jul', Meetings: 22, Emails: 16, Calls: 9, Events: 4 },
  { month: 'Aug', Meetings: 20, Emails: 18, Calls: 8, Events: 3 },
  { month: 'Sep', Meetings: 27, Emails: 21, Calls: 10, Events: 5 },
]
const ENGAGEMENT_LINES = [
  { key: 'Meetings', color: '#2F80ED' },
  { key: 'Emails', color: '#1DA05C' },
  { key: 'Calls', color: '#8B5CF6' },
  { key: 'Events', color: '#E09A22' },
]

const HEALTH_BREAKDOWN = [
  { label: 'Strong (80-100)', count: 22, tone: 'green' },
  { label: 'Healthy (60-79)', count: 13, tone: 'green' },
  { label: 'At Risk (40-59)', count: 8, tone: 'amber' },
  { label: 'Critical (0-39)', count: 5, tone: 'red' },
]

const QUICK_STATS = [
  { label: 'Total Engagements', value: 124, change: '+18%' },
  { label: 'Total Opportunities', value: 12, change: '+33%' },
  { label: 'Commitments (Total)', value: 36, change: '+12%' },
  { label: 'Tasks (Open)', value: 18, change: '-10%' },
]

const RECENT_ENGAGEMENTS = [
  { date: '15 Sep 2026', org: 'ABC Foundation', type: 'Meeting', summary: 'Discussed funding opportunities for AI Skills Accelerator.', next: 'Send proposal by 20 Sep.' },
  { date: '12 Sep 2026', org: 'TechCorp', type: 'Email', summary: 'Shared programme brochure and impact report.', next: 'Follow up on internship offer.' },
  { date: '10 Sep 2026', org: 'University of Pretoria', type: 'Event', summary: 'Attended career fair and networking session.', next: 'Send thank you email.' },
  { date: '08 Sep 2026', org: 'GrowthHub', type: 'Call', summary: 'Discussed mentoring programme for learners.', next: 'Schedule next meeting.' },
]

const TOP_PARTNERS = [
  { code: 'ABC', name: 'ABC Foundation', type: 'Funder', score: 92, last: '15 Sep 2026' },
  { code: 'TC', name: 'TechCorp', type: 'Employer', score: 88, last: '12 Sep 2026' },
  { code: 'UP', name: 'University of Pretoria', type: 'Institution', score: 85, last: '10 Sep 2026' },
  { code: 'GH', name: 'GrowthHub', type: 'Mentor', score: 76, last: '08 Sep 2026' },
]

const RECENT_OPPORTUNITIES = [
  { title: 'AI Skills Accelerator Sponsorship', stage: 'Proposal Submitted', value: 'R500,000', close: '30 Oct 2026' },
  { title: 'Employer Internship Programme', stage: 'Negotiation', value: 'R300,000', close: '15 Nov 2026' },
  { title: 'Digital Skills Training Grant', stage: 'Initial Contact', value: 'R1,200,000', close: '20 Dec 2026' },
]

const UPCOMING_TASKS = [
  { title: 'Prepare sponsorship proposal', due: 'Due 20 Sep 2026', owner: 'Partnership Manager' },
  { title: 'Follow up with ABC Foundation', due: 'Due 22 Sep 2026', owner: 'Relationship Manager' },
  { title: 'Confirm event speakers', due: 'Due 25 Sep 2026', owner: 'Events Coordinator' },
]

const STAGE_TONE = {
  'Proposal Submitted': 'blue',
  Negotiation: 'purple',
  'Initial Contact': 'amber',
}

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-serif font-semibold sm:text-2xl">Welcome back, {firstName}!</h2>
          <p className="max-w-2xl text-sm text-ink/60">
            Here's an overview of your partner relationships and activities.
          </p>
        </div>
        <p className="text-xs text-ink/50 sm:text-sm">
          {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Top stat row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        {MOCK_STATS.map((s) => (
          <div key={s.label} className="min-w-0">
            <IconStatCard {...s} />
          </div>
        ))}
      </div>

      {/* Partner types / engagements over time / relationship health */}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)_minmax(0,0.9fr)]">
        <div className="min-w-0 rounded-xl border border-line bg-white p-4 sm:p-5">
          <h3 className="mb-3 font-serif text-lg">Partner Types</h3>
          <DonutChart data={PARTNER_TYPES} centerLabel="Partners" centerValue={48} />
        </div>

        <div className="min-w-0 rounded-xl border border-line bg-white p-4 sm:p-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-lg">Engagements Over Time</h3>
            <select aria-label="Engagement period" className="rounded border border-line bg-paper px-2 py-1 text-xs">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <TrendLineChart data={ENGAGEMENT_TRENDS} lines={ENGAGEMENT_LINES} />
        </div>

        <div className="min-w-0 rounded-xl border border-line bg-white p-4 sm:p-5">
          <h3 className="mb-3 font-serif text-lg">Relationship Health</h3>
          <div className="flex justify-center">
            <DonutChart
              data={[
                { name: 'Healthy', value: 78, pct: 78, color: '#1DA05C' },
                { name: 'Remaining', value: 22, pct: 22, color: '#E4E8EF' },
              ]}
              centerLabel="Overall Health"
              centerValue="78%"
            />
          </div>
          <ul className="mt-4 space-y-3 text-sm sm:text-base">
            {HEALTH_BREAKDOWN.map((h) => (
              <li key={h.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <span className="flex min-w-0 items-center gap-2 text-ink/70">
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-ink/20" />
                  <span className="min-w-0 break-words">{h.label}</span>
                </span>
                <span className="font-medium text-ink/70 whitespace-nowrap">{h.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent engagements + top partners */}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="min-w-0 rounded-xl border border-line bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-lg">Recent Engagements</h3>
            <a href="/engagements" className="text-sm text-accent hover:underline">View all</a>
          </div>
          <div className="divide-y divide-line">
            {RECENT_ENGAGEMENTS.map((e) => (
              <div key={e.org + e.date} className="min-w-0 py-3 text-sm">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <span className="min-w-0 truncate font-medium">{e.org}</span>
                  <Badge tone="blue">{e.type}</Badge>
                </div>
                <p className="mt-1 break-words text-ink/60">{e.summary}</p>
                <p className="mt-1 break-words text-xs text-ink/40">{e.date} · Next: {e.next}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0 rounded-xl border border-line bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-lg">Top Partners by Relationship Health</h3>
            <a href="/organisations" className="text-sm text-accent hover:underline">View all</a>
          </div>
          <div className="divide-y divide-line">
            {TOP_PARTNERS.map((p) => (
              <div key={p.name} className="flex min-w-0 items-center justify-between gap-3 py-3 text-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-medium text-white">
                    {p.code}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-ink/50">{p.type}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <ProgressBar score={p.score} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent opportunities + quick stats/tasks */}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className="min-w-0 rounded-xl border border-line bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-lg">Recent Opportunities</h3>
            <a href="/opportunities" className="text-sm text-accent hover:underline">View all</a>
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-ink/40">
              <tr>
                <th className="pb-2 font-medium">Opportunity</th>
                <th className="pb-2 font-medium">Stage</th>
                <th className="pb-2 font-medium">Value</th>
                <th className="pb-2 font-medium">Expected Close</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {RECENT_OPPORTUNITIES.map((o) => (
                <tr key={o.title}>
                  <td className="py-2.5">{o.title}</td>
                  <td className="py-2.5">
                    <Badge tone={STAGE_TONE[o.stage] || 'neutral'}>{o.stage}</Badge>
                  </td>
                  <td className="py-2.5 font-medium">{o.value}</td>
                  <td className="py-2.5 text-ink/60">{o.close}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          <div className="divide-y divide-line md:hidden">
            {RECENT_OPPORTUNITIES.map((o) => (
              <div key={o.title} className="space-y-2 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 font-medium">{o.title}</p>
                  <Badge tone={STAGE_TONE[o.stage] || 'neutral'}>{o.stage}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
                  <span className="font-medium text-ink/80">{o.value}</span>
                  <span>Close: {o.close}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="min-w-0 space-y-5">
          <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <h3 className="mb-3 font-serif text-lg">Quick Stats</h3>
            <ul className="space-y-3">
              {QUICK_STATS.map((q) => (
                <li key={q.label} className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">{q.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{q.value}</span>
                    <span className={q.change.startsWith('+') ? 'text-health-green text-xs' : 'text-health-red text-xs'}>
                      {q.change}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-serif text-lg">Upcoming Tasks</h3>
              <a href="/tasks" className="text-sm text-accent hover:underline">View all</a>
            </div>
            <ul className="space-y-3">
              {UPCOMING_TASKS.map((t) => (
                <li key={t.title} className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-accent" />
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-ink/50">{t.due} · {t.owner}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppLayout>
  )
}
