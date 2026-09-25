import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarClock,
  TrendingUp,
  ClipboardCheck,
  ListChecks,
  BarChart3,
  Settings,
} from 'lucide-react'

// EDIT: add/remove nav items here as your team builds more pages
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/organisations', label: 'Organisations', icon: Building2 },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/engagements', label: 'Engagements', icon: CalendarClock },
  { to: '/opportunities', label: 'Opportunities', icon: TrendingUp },
  { to: '/commitments', label: 'Commitments', icon: ClipboardCheck },
  { to: '/tasks', label: 'Tasks & Follow-ups', icon: ListChecks },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open = false, onClose }) {
  const { user } = useAuth()

  const navItems = [
    ...NAV_ITEMS,
    ...(user?.role === 'admin'
      ? [{ to: '/users', label: 'User Management', icon: Users }]
      : []),
  ]

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}
      <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col bg-gradient-to-b from-[#294522] via-[#55612D] to-[#8C8A3E] text-white/90 transition-transform duration-200 md:sticky md:top-0 md:translate-x-0`}>
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <img
          src="/New_Logo.jpg"
          alt="Simply Complex Africa logo"
          className="h-10 w-10 rounded-lg object-contain"
        />
        <h1 className="font-serif text-base leading-tight text-white">
          Simply Complex
          <br />
          Africa
        </h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[#8C8A3E] text-white font-medium'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            <item.icon size={18} strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/10 text-xs text-white/40 leading-relaxed">
        Stronger Partnerships.
        <br />
        Greater Impact.
      </div>
      </aside>
    </>
  )
}
