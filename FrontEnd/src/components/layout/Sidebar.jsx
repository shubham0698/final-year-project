import {
  Activity,
  Bell,
  ClipboardList,
  FlaskConical,
  History,
  Home,
  Leaf,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  UserRoundCog,
  Waypoints,
  X,
  ChartNoAxesCombined,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Overview', to: '/app/overview', icon: Home },
  { label: 'Clinical Trials', to: '/app/clinical-trials', icon: FlaskConical },
  { label: 'Participants', to: '/app/participants', icon: UsersRound },
  { label: 'Visits', to: '/app/visits', icon: Waypoints },
  { label: 'eCRF / Data Collection', to: '/app/data-collection', icon: ClipboardList },
  { label: 'Ayurveda Assessment', to: '/app/ayurveda-assessment', icon: Leaf },
  { label: 'Adverse Events', to: '/app/adverse-events', icon: TriangleAlert },
  { label: 'Regulatory & Compliance', to: '/app/regulatory-compliance', icon: ShieldCheck },
  { label: 'Reports & Analytics', to: '/app/reports-analytics', icon: ChartNoAxesCombined },
  { label: 'Audit Trail', to: '/app/audit-trail', icon: History },
  { label: 'Notifications', to: '/app/notifications', icon: Bell },
  { label: 'User Management', to: '/app/user-management', icon: UserRoundCog },
]

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onClose }) {
  return (
    <>
      {mobileOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
        />
      )}
      <aside className={`app-sidebar${collapsed ? ' app-sidebar--collapsed' : ''}${mobileOpen ? ' app-sidebar--mobile-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-brand-row">
          <Link className="sidebar-brand" to="/app/overview" onClick={onClose} aria-label="AIIA Clinical Trial Management System overview">
            <span className="sidebar-brand__mark" aria-hidden="true">A</span>
            <span className="sidebar-brand__copy">
              <strong>AIIA</strong>
              <span>Clinical Trial<br />Management</span>
            </span>
          </Link>
          <button className="sidebar-mobile-close" type="button" onClick={onClose} aria-label="Close navigation menu">
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Application sections">
          <span className="sidebar-nav__label">Workspace</span>
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link--active' : ''}`}
              onClick={onClose}
            >
              <Icon className="sidebar-link__icon" size={18} strokeWidth={1.8} aria-hidden="true" />
              <span className="sidebar-link__label">{label}</span>
              <span className="sidebar-link__active-mark" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link className="sidebar-public-link" to="/" onClick={onClose} title={collapsed ? 'Public home' : undefined}>
            <Activity size={17} aria-hidden="true" />
            <span className="sidebar-link__label">Public home</span>
          </Link>
          <button className="sidebar-collapse" type="button" onClick={onToggleCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={collapsed}>
            {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
            <span className="sidebar-link__label">Collapse sidebar</span>
          </button>
        </div>
      </aside>
    </>
  )
}
