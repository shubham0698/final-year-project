import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './layout.css'

const pageTitles = {
  overview: 'Overview',
  'clinical-trials': 'Clinical Trials',
  participants: 'Participants',
  visits: 'Visits',
  'data-collection': 'eCRF / Data Collection',
  'ayurveda-assessment': 'Ayurveda Assessment',
  'adverse-events': 'Adverse Events',
  'regulatory-compliance': 'Regulatory & Compliance',
  'reports-analytics': 'Reports & Analytics',
  'audit-trail': 'Audit Trail',
  notifications: 'Notifications',
  'user-management': 'User Management',
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const pageKey = location.pathname.split('/').filter(Boolean).at(-1)
  const title = pageTitles[pageKey] ?? 'Overview'

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <div className={`app-shell${collapsed ? ' app-shell--collapsed' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onClose={() => setMobileOpen(false)}
      />
      <div className="app-main-column">
        <Topbar
          title={title}
          onToggleSidebar={() => {
            if (window.matchMedia('(max-width: 900px)').matches) setMobileOpen((value) => !value)
            else setCollapsed((value) => !value)
          }}
        />
        <main className="app-content" id="main-content" tabIndex="-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
