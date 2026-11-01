import { CalendarDays, Clock3, Edit3, UserRound } from 'lucide-react'
import Button from '../Button.jsx'
import StatusBadge from '../StatusBadge.jsx'
import TrialModal from '../trials/TrialModal.jsx'
import { visitStatuses } from '../../data/visitsData.js'
import { formatTrialDate } from '../../utils/trialFormatting.js'
import { formatVisitTime } from '../../utils/visitManagement.js'

function Detail({ label, children }) {
  return <div className="visit-detail"><dt>{label}</dt><dd>{children || '—'}</dd></div>
}

export default function VisitDetailsModal({ visit, onClose, onEdit, onStatusChange }) {
  return (
    <TrialModal title="Visit Details" description="Fictional demo visit · information is for interface demonstration only." onClose={onClose} size="medium">
      <div className="visit-details">
        <div className="visit-details__identity"><div><span className="visit-details__id">{visit.id}</span><h3>{visit.visitType} Visit</h3></div><StatusBadge status={visit.status} /></div>
        <dl className="visit-details__grid">
          <Detail label="Participant"><span className="visit-detail__icon"><UserRound size={14} aria-hidden="true" />{visit.participantName}</span><small>{visit.participantId}</small></Detail>
          <Detail label="Associated Trial"><span>{visit.trialName}</span><small>{visit.trialId}</small></Detail>
          <Detail label="Visit Date"><span className="visit-detail__icon"><CalendarDays size={14} aria-hidden="true" />{formatTrialDate(visit.visitDate)}</span></Detail>
          <Detail label="Visit Time"><span className="visit-detail__icon"><Clock3 size={14} aria-hidden="true" />{formatVisitTime(visit.visitTime)}</span></Detail>
          <Detail label="Assigned Researcher">{visit.researcher}</Detail>
          <div className="visit-detail"><label htmlFor="visit-detail-status">Update Visit Status</label><select id="visit-detail-status" value={visit.status} onChange={(event) => onStatusChange(visit, event.target.value)}>{visitStatuses.map((status) => <option key={status}>{status}</option>)}</select></div>
          <Detail label="Notes">{visit.notes || 'No notes'}</Detail>
        </dl>
        <p className="visit-form-demo-note">This record is fictional demo data. Status changes are temporary and local to this page.</p>
        <div className="trial-modal__footer"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={() => onEdit(visit)}><Edit3 size={15} aria-hidden="true" /> Edit Visit</Button></div>
      </div>
    </TrialModal>
  )
}
