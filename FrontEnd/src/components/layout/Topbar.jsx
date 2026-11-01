import { Bell, ChevronRight, Menu, Search } from 'lucide-react'

export default function Topbar({ title, onToggleSidebar }) {
  return (
    <header className="app-topbar">
      <div className="topbar-leading">
        <button className="topbar-menu-button" type="button" onClick={onToggleSidebar} aria-label="Toggle navigation menu">
          <Menu size={20} aria-hidden="true" />
        </button>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <span className="breadcrumbs__root">Workspace</span>
          <ChevronRight size={15} aria-hidden="true" />
          <span className="breadcrumbs__current" aria-current="page">{title}</span>
        </nav>
      </div>

      <div className="topbar-actions">
        <label className="topbar-search">
          <Search size={17} aria-hidden="true" />
          <span className="visually-hidden">Search workspace</span>
          <input type="search" placeholder="Search workspace" aria-label="Search workspace" />
        </label>
        <button className="topbar-icon-button topbar-notifications" type="button" aria-label="Notifications">
          <Bell size={19} aria-hidden="true" />
          <span className="notification-indicator" aria-hidden="true" />
        </button>
        <div className="topbar-profile" aria-label="Admin User, Administrator">
          <span className="topbar-avatar" aria-hidden="true">AU</span>
          <span className="topbar-profile__copy">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </span>
        </div>
      </div>
    </header>
  )
}
