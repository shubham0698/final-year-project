import { ArrowUpRight } from 'lucide-react'
import Card from '../Card.jsx'
import StatusBadge from '../StatusBadge.jsx'

export default function RecentTrialsTable({ trials }) {
  return (
    <Card className="trials-panel" padding="small">
      <div className="trials-panel__header">
        <div>
          <h2>Recent Clinical Trials</h2>
          <p>Sample records for demonstration</p>
        </div>
        <span className="table-count">{trials.length} samples</span>
      </div>
      <div className="dashboard-table-scroll" tabIndex="0" aria-label="Scrollable recent clinical trials table">
        <table className="dashboard-table">
          <caption className="visually-hidden">Mock recent clinical trials</caption>
          <thead>
            <tr>
              <th scope="col">Trial ID</th>
              <th scope="col">Trial Name</th>
              <th scope="col">Principal Investigator</th>
              <th scope="col">Participants</th>
              <th scope="col">Status</th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {trials.map((trial) => (
              <tr key={trial.id}>
                <td className="trial-id">{trial.id}</td>
                <td className="trial-name">{trial.name}</td>
                <td>{trial.investigator}</td>
                <td>{trial.participants}</td>
                <td><StatusBadge status={trial.status.toLowerCase()} label={trial.status} /></td>
                <td className="trial-date">{trial.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-scroll-hint"><ArrowUpRight size={13} aria-hidden="true" /> Scroll table horizontally to see all fields</p>
    </Card>
  )
}
