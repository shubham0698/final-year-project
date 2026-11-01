import { CalendarDays, Edit3 } from 'lucide-react'
import Button from '../Button.jsx'
import StatusBadge from '../StatusBadge.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { formatTrialDate } from '../../utils/trialFormatting.js'

function Detail({ label, children }) {
  return <div className="participant-detail"><dt>{label}</dt><dd>{children || '—'}</dd></div>
}

export default function ParticipantDetailsModal({ participant, onClose, onEdit }) {
  return (
    <TrialModal
      title="Participant Details"
      description="Fictional demo record · information is for interface demonstration only."
      onClose={onClose}
      size="medium"
    >
      <div className="participant-details">
        <div className="participant-details__identity">
          <div>
            <span className="participant-details__id">{participant.id}</span>
            <h3>{participant.fullName}</h3>
          </div>
          <StatusBadge status={participant.status} />
        </div>
        <dl className="participant-details__grid">
          <Detail label="Age">{participant.age} years</Detail>
          <Detail label="Gender">{participant.gender}</Detail>
          <Detail label="Phone"><a href={`tel:${participant.phone}`}>{participant.phone}</a></Detail>
          <Detail label="Email">{participant.email ? <a href={`mailto:${participant.email}`}>{participant.email}</a> : 'Not provided'}</Detail>
          <Detail label="Associated Trial"><span>{participant.trialName}</span><small>{participant.trialId}</small></Detail>
          <Detail label="Enrollment Date"><span className="participant-detail__date"><CalendarDays size={14} aria-hidden="true" />{formatTrialDate(participant.enrollmentDate)}</span></Detail>
          <Detail label="Emergency Contact">{participant.emergencyContact || 'Not provided'}</Detail>
          <Detail label="Notes">{participant.notes || 'No notes'}</Detail>
        </dl>
        <div className="participant-form-demo-note">All displayed participant information is fictional demo data.</div>
        <div className="trial-modal__footer">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onEdit}><Edit3 size={15} aria-hidden="true" /> Edit Participant</Button>
        </div>
      </div>
    </TrialModal>
  )
}
