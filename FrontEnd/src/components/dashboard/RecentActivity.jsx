import { Activity, CalendarClock, ClipboardCheck, FlaskConical, TriangleAlert, UserRoundPlus } from 'lucide-react'
import Card from '../Card.jsx'

const activityIcons = {
  trial: FlaskConical,
  participant: UserRoundPlus,
  visit: CalendarClock,
  event: TriangleAlert,
  review: ClipboardCheck,
}

export default function RecentActivity({ activities }) {
  return (
    <Card className="activity-panel" padding="medium">
      <div className="dashboard-panel__heading activity-panel__heading">
        <div>
          <h2>Recent Activity</h2>
          <p>Sample workspace updates</p>
        </div>
        <span className="activity-panel__icon"><Activity size={17} aria-hidden="true" /></span>
      </div>
      <ol className="activity-list">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type] ?? Activity
          return (
            <li className="activity-item" key={activity.id}>
              <span className={`activity-item__icon activity-item__icon--${activity.type}`}><Icon size={16} aria-hidden="true" /></span>
              <div className="activity-item__copy">
                <p>{activity.description}</p>
                <span>{activity.context}</span>
              </div>
              <time className="activity-item__time">{activity.time}</time>
            </li>
          )
        })}
      </ol>
      <p className="activity-demo-note">All activity shown is sample data.</p>
    </Card>
  )
}
