import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'Nothing here yet',
  description,
  action,
  icon: Icon = Inbox,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <span className="empty-state__icon"><Icon size={22} aria-hidden="true" /></span>
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
