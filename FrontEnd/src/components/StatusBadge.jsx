const statuses = {
  active: 'success',
  scheduled: 'info',
  submitted: 'warning',
  'in progress': 'info',
  reviewed: 'success',
  enrolled: 'info',
  screening: 'warning',
  completed: 'success',
  approved: 'success',
  pending: 'warning',
  review: 'warning',
  draft: 'neutral',
  inactive: 'neutral',
  withdrawn: 'neutral',
  cancelled: 'danger',
  missed: 'danger',
  rejected: 'danger',
  error: 'danger',
  info: 'info',
}

export default function StatusBadge({ status, label, className = '' }) {
  const tone = statuses[String(status).toLowerCase()] ?? 'neutral'

  return (
    <span className={`status-badge status-badge--${tone} ${className}`.trim()}>
      <span className="status-badge__dot" aria-hidden="true" />
      {label ?? status}
    </span>
  )
}
