import { useEffect, useState } from 'react'
import { CalendarClock, CheckCircle2, FileText, Handshake, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'

const NOTIFICATIONS = [
  {
    id: 1,
    icon: Handshake,
    tone: 'bg-[#E8EEDB] text-[#55612D]',
    title: 'Ubuntu Capital renewed its partnership commitment',
    detail: 'The renewal is ready for your review.',
    time: '15 minutes ago',
    unread: true,
  },
  {
    id: 2,
    icon: CalendarClock,
    tone: 'bg-[#FAF3D7] text-[#8C8A3E]',
    title: 'Follow-up meeting with AfriGrowth Fund is tomorrow',
    detail: 'Review the latest engagement notes before the meeting.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 3,
    icon: FileText,
    tone: 'bg-[#F0ECDC] text-[#6A6D2F]',
    title: 'Quarterly partnership report is ready',
    detail: 'Your report has finished generating and is available to view.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 4,
    icon: CheckCircle2,
    tone: 'bg-[#E8EEDB] text-[#55612D]',
    title: 'Site visit task marked complete',
    detail: 'Kente Advisory site visit preparation has been completed.',
    time: '2 days ago',
    unread: false,
  },
]

export default function Notifications() {
  const [readIds, setReadIds] = useState(() => {
    const stored = localStorage.getItem('readNotifications')
    if (!stored) {
      return NOTIFICATIONS.filter((notification) => !notification.unread).map((notification) => notification.id)
    }

    try {
      return JSON.parse(stored)
    } catch {
      return NOTIFICATIONS.filter((notification) => !notification.unread).map((notification) => notification.id)
    }
  })
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    localStorage.setItem('readNotifications', JSON.stringify(readIds))
  }, [readIds])

  function handleNotificationClick(notificationId) {
    setReadIds((current) => current.includes(notificationId) ? current : [...current, notificationId])
    setOpenId((current) => current === notificationId ? null : notificationId)
  }

  const unreadCount = NOTIFICATIONS.filter((notification) => !readIds.includes(notification.id)).length

  return (
    <AppLayout title="Notifications" notificationCount={unreadCount}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/60">
            Stay up to date with your partnerships, tasks, and reports.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 self-start text-sm text-ink/60 transition-colors hover:text-[#8C8A3E] sm:self-auto"
          >
            <ArrowLeft size={15} /> Back to dashboard
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-line bg-white" aria-label="Recent notifications">
          {NOTIFICATIONS.map((notification) => {
            const Icon = notification.icon
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleNotificationClick(notification.id)}
                aria-expanded={openId === notification.id}
                className={`block w-full border-b border-line px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-[#FAFBF3] sm:px-5 ${!readIds.includes(notification.id) ? 'bg-[#FAFBF3]' : ''}`}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.tone}`}>
                    <Icon size={19} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h3 className="text-sm font-medium text-ink">{notification.title}</h3>
                      {!readIds.includes(notification.id) && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#D4AF37]" aria-label="Unread" />}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">{notification.detail}</p>
                    <time className="mt-2 block text-xs text-ink/40">{notification.time}</time>
                    {openId === notification.id && (
                      <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink/70">
                        This notification has been opened and marked as read. Visit the related area of your workspace to take action.
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </section>
      </div>
    </AppLayout>
  )
}
