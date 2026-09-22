import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

// `title` is optional: pass it for simple list pages (renders a plain heading).
// Leave it out when the page builds its own header (like Dashboard's "Welcome back").
export default function AppLayout({ title, notificationCount = 3, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F7F7E7] md:h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar notificationCount={notificationCount} onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-w-0 flex-1 overflow-y-auto bg-[#F7F7E7] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {title && <h2 className="mb-6 text-2xl font-serif font-semibold">{title}</h2>}
          {children}
        </main>
      </div>
    </div>
  )
}
