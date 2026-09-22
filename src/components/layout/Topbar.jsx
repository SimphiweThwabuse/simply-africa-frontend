import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, LogOut, Menu, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { MOCK_ENGAGEMENTS, MOCK_OPPS } from '../../data/mockData.js'
import { api } from '../../api/client.js'

const ROLE_LABELS = {
  admin: 'Administrator',
  bd_officer: 'Relationship Manager',
  programme_manager: 'Programme Manager',
  executive: 'Executive',
  finance: 'Finance',
}

const STATIC_SEARCH_INDEX = [
  ...MOCK_ENGAGEMENTS.map((engagement) => ({
    label: `${engagement.organisation} ${engagement.title} ${engagement.summary}`,
    type: 'Engagement',
    path: '/engagements',
  })),
  ...MOCK_OPPS.map((opportunity) => ({
    label: `${opportunity.title} ${opportunity.org}`,
    type: 'Opportunity',
    path: '/opportunities',
  })),
]

function initials(fullName = '') {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Topbar({ notificationCount = 3, onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [organisations, setOrganisations] = useState([])

  useEffect(() => {
    api.get('/organisations/')
      .then((response) => setOrganisations(response.data))
      .catch(() => setOrganisations([]))
  }, [])

  async function handleSearch(event) {
    event.preventDefault()
    const normalizedQuery = event.currentTarget.elements.search.value.trim().toLowerCase()
    if (!normalizedQuery) return

    let liveOrganisations = organisations
    if (liveOrganisations.length === 0) {
      try {
        const response = await api.get('/organisations/')
        liveOrganisations = response.data
        setOrganisations(liveOrganisations)
      } catch {
        liveOrganisations = []
      }
    }

    const liveOrganisationIndex = liveOrganisations.map((organisation) => ({
      label: organisation.name,
      type: 'Organisation',
      path: `/organisations/${organisation.id}`,
    }))
    const searchIndex = [...liveOrganisationIndex, ...STATIC_SEARCH_INDEX]
    const organisationMatches = liveOrganisationIndex.filter((item) => (
      item.label.toLowerCase().includes(normalizedQuery)
    ))
    const result = organisationMatches.find((item) => item.label.toLowerCase() === normalizedQuery)
      || organisationMatches.find((item) => item.label.toLowerCase().startsWith(normalizedQuery))
      || organisationMatches[0]
      || searchIndex.find((item) => `${item.label} ${item.type}`.toLowerCase().includes(normalizedQuery))

    if (result) {
      setSearchQuery('')
      navigate(result.path)
    }
  }

  function handleLogout() {
    logout()
    navigate('/signin')
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#F7F7E7] px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-8 sm:py-4">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="rounded-lg p-1 text-ink/70 transition-colors hover:bg-white md:hidden"
      >
        <Menu size={21} />
      </button>
      <form onSubmit={handleSearch} className="relative order-last w-full sm:order-none sm:block sm:min-w-0 sm:max-w-md sm:flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          name="search"
          type="search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value)
          }}
          placeholder="Search organisations, contacts, opportunities..."
          className="w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-3 text-sm
                     placeholder:text-ink/40 focus:border-accent focus:outline-none"
        />
      </form>

      <div className="ml-auto flex items-center gap-3 sm:gap-5">
        <button
          onClick={() => navigate('/notifications')}
          className="relative rounded-lg p-1 text-ink/60 transition-colors hover:bg-white hover:text-ink"
          aria-label="View notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-health-red text-[10px] font-medium text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37]/25 text-[#6A6D2F] text-sm font-medium">
              {initials(user?.full_name)}
            </div>
            <div className="hidden text-left text-sm leading-tight sm:block">
              <p className="font-medium text-ink">{user?.full_name}</p>
              <p className="text-ink/50">{ROLE_LABELS[user?.role] || user?.role}</p>
            </div>
            <ChevronDown size={16} className="hidden text-ink/40 sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-line bg-white py-1 shadow-lg">
              <button
                onClick={() => { setMenuOpen(false); navigate('/settings') }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink/70 hover:bg-paper"
              >
                <SettingsIcon size={15} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-health-red hover:bg-paper"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
