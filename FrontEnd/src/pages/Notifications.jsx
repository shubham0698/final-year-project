import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Clock,
  Info,
  ShieldAlert
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axiosInstance'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import './Notifications.css'

const fallbackNotifications = [
  {
    id: 1,
    title: 'ACTION REQUIRED: SAE Regulatory Deadline (NDCT 2019)',
    message: 'Serious Adverse Event for participant P-102 requires 24-hour initial notice submission to CDSCO and Ethics Committee.',
    type: 'Urgent',
    targetRole: 'Pharmacovigilance Officer',
    isRead: false,
    createdAt: '2026-11-15 14:30',
    actionUrl: '/app/adverse-events'
  },
  {
    id: 2,
    title: 'Ethics Committee Renewal Due Soon',
    message: 'Trial CT-2024-001 ethical approval validity requires periodic review submission within 60 days.',
    type: 'Warning',
    targetRole: 'Ethics Committee',
    isRead: false,
    createdAt: '2026-11-14 10:00',
    actionUrl: '/app/regulatory-compliance'
  },
  {
    id: 3,
    title: 'Upcoming Protocol Visits',
    message: '3 participant visits are scheduled for this week under trial CT-2024-001.',
    type: 'Info',
    targetRole: 'Study Coordinator',
    isRead: true,
    createdAt: '2026-11-12 09:00',
    actionUrl: '/app/visits'
  }
]

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const res = await api.get('/api/notifications')
      if (res.data && res.data.length > 0) {
        setNotifications(res.data)
      } else {
        setNotifications(fallbackNotifications)
      }
    } catch {
      setNotifications(fallbackNotifications)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id) {
    try {
      await api.patch(`/api/notifications/${id}/read`)
    } catch {}
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  async function markAllAsRead() {
    try {
      await api.post('/api/notifications/read-all')
    } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  return (
    <div className="notifications-page">
      <PageHeader
        eyebrow="System Alerts"
        title="Notifications & Tasks"
        description="Monitor time-critical regulatory deadlines, SAE reporting requirements, and visit reminders."
      >
        <Button variant="outline" onClick={markAllAsRead}>
          <CheckCheck size={16} /> Mark All as Read
        </Button>
      </PageHeader>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="You're all caught up"
            description="There are no active alerts or pending notifications at this time."
          />
        ) : (
          notifications.map(item => {
            const isUrgent = item.type === 'Urgent'
            const isWarning = item.type === 'Warning'

            return (
              <div
                key={item.id}
                className={`notification-item ${!item.isRead ? 'notification-item--unread' : ''} ${
                  isUrgent ? 'notification-item--urgent' : isWarning ? 'notification-item--warning' : ''
                }`}
              >
                <div className="notification-item__icon" style={{
                  background: isUrgent ? '#fee2e2' : isWarning ? '#fef3c7' : '#e0f2fe',
                  color: isUrgent ? '#dc2626' : isWarning ? '#d97706' : '#0284c7'
                }}>
                  {isUrgent ? <ShieldAlert size={20} /> : isWarning ? <AlertTriangle size={20} /> : <Info size={20} />}
                </div>

                <div className="notification-item__body">
                  <h4 className="notification-item__title">{item.title}</h4>
                  <p className="notification-item__message">{item.message}</p>
                  <div className="notification-item__meta">
                    <span>Target: <strong>{item.targetRole || 'All'}</strong></span>
                    <span>•</span>
                    <span>{item.createdAt ? String(item.createdAt).replace('T', ' ').substring(0, 16) : ''}</span>
                    {item.actionUrl && (
                      <>
                        <span>•</span>
                        <Link to={item.actionUrl} style={{ color: '#2563eb', fontWeight: 600 }}>
                          Open Module &rarr;
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {!item.isRead && (
                  <Button size="small" variant="ghost" onClick={() => markAsRead(item.id)}>
                    <Check size={14} /> Mark Read
                  </Button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

