import { PencilLine } from 'lucide-react'
import Button from '../Button.jsx'
import StatusBadge from '../StatusBadge.jsx'
import { formatTrialDate } from '../../utils/trialFormatting.js'
import TrialModal from './TrialModal.jsx'

function Detail({ label, children }) {
  return <div className="trial-detail"><dt>{label}</dt><dd>{children}</dd></div>
}

export default function TrialDetailsModal({ trial, onClose, onEdit }) {
  return (
    <TrialModal title="Trial Details" description={`Demo record ${trial.id}`} onClose={onClose} size="medium">
      <div className="trial-details">
        <div className="trial-details__identity">
          <span className="trial-details__id">{trial.id}</span>
          <StatusBadge status={trial.status.toLowerCase()} label={trial.status} />
        </div>
        <h3>{trial.name}</h3>
        <p className="trial-details__description">{trial.description}</p>
        <dl className="trial-details__grid">
          <Detail label="Research Area">{trial.researchArea}</Detail>
          <Detail label="Phase">{trial.phase}</Detail>
          <Detail label="Principal Investigator">{trial.investigator}</Detail>
          <Detail label="Start Date">{formatTrialDate(trial.startDate)}</Detail>
          <Detail label="Expected End Date">{formatTrialDate(trial.expectedEndDate)}</Detail>
          <Detail label="Target Participants">{trial.targetParticipants.toLocaleString()}</Detail>
        </dl>
        <div className="trial-modal__footer">
          <Button variant="outline" type="button" onClick={onClose}>Close</Button>
          <Button variant="primary" type="button" onClick={onEdit}><PencilLine size={16} aria-hidden="true" /> Edit Trial</Button>
        </div>
      </div>
    </TrialModal>
  )
}
