import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Clock3, Eye } from 'lucide-react'
import Button from '../Button.jsx'
import EmptyState from '../EmptyState.jsx'
import StatusBadge from '../StatusBadge.jsx'
import { visitStatuses } from '../../data/visitsData.js'
import { formatTrialDate } from '../../utils/trialFormatting.js'
import { formatVisitTime, getMonthGrid, shiftCalendarMonth } from '../../utils/visitManagement.js'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export default function VisitCalendar({ visits, selectedDate, onSelectDate, month, onMonthChange, onView, onStatusChange }) {
  const dates = useMemo(() => getMonthGrid(month.year, month.month), [month])
  const visitsByDate = useMemo(() => visits.reduce((map, visit) => {
    const grouped = map.get(visit.visitDate) ?? []
    grouped.push(visit)
    map.set(visit.visitDate, grouped)
    return map
  }, new Map()), [visits])
  const selectedVisits = visitsByDate.get(selectedDate) ?? []
  const monthLabel = monthFormatter.format(new Date(Date.UTC(month.year, month.month - 1, 1)))

  function moveMonth(direction) {
    onMonthChange(shiftCalendarMonth(month, direction))
  }

  return (
    <div className="visit-calendar-layout">
      <section className="visit-calendar" aria-label={`${monthLabel} visit calendar`}>
        <header className="visit-calendar__header">
          <div><h3>{monthLabel}</h3><p>Select a date to see its scheduled visits.</p></div>
          <div className="visit-calendar__nav">
            <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month"><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" onClick={() => moveMonth(1)} aria-label="Next month"><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
        </header>
        <div className="visit-calendar__grid" role="grid" aria-label={monthLabel}>
          {weekDays.map((day) => <div key={day} className="visit-calendar__weekday" role="columnheader">{day}</div>)}
          {dates.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="visit-calendar__empty-day" role="gridcell" aria-hidden="true" />
            const dayVisits = visitsByDate.get(date) ?? []
            const dayNumber = Number(date.slice(-2))
            const selected = selectedDate === date
            return (
              <div key={date} className="visit-calendar__cell" role="gridcell" aria-selected={selected}>
                <button className={`visit-calendar__day${selected ? ' is-selected' : ''}${dayVisits.length ? ' has-visits' : ''}`} type="button" aria-pressed={selected} aria-label={`${formatTrialDate(date)}${dayVisits.length ? `, ${dayVisits.length} visits` : ', no visits'}`} onClick={() => onSelectDate(date)}>
                  <span className="visit-calendar__number">{dayNumber}</span>
                  {dayVisits.length > 0 && <span className="visit-calendar__markers" aria-hidden="true">{dayVisits.slice(0, 4).map((visit) => <i key={visit.id} className={`visit-calendar__marker visit-calendar__marker--${visit.status.toLowerCase()}`} />)}{dayVisits.length > 4 && <small>+{dayVisits.length - 4}</small>}</span>}
                  {dayVisits.length > 0 && <span className="visit-calendar__count">{dayVisits.length} {dayVisits.length === 1 ? 'visit' : 'visits'}</span>}
                </button>
              </div>
            )
          })}
        </div>
        <div className="visit-calendar__legend" aria-label="Visit status legend">
          {visitStatuses.map((status) => <span key={status}><i className={`visit-calendar__marker visit-calendar__marker--${status.toLowerCase()}`} />{status}</span>)}
        </div>
      </section>

      <section className="visit-calendar-day" aria-live="polite" aria-label="Visits on selected date">
        <header className="visit-calendar-day__header"><div><span>Selected date</span><h3>{selectedDate ? formatTrialDate(selectedDate) : 'Choose a date'}</h3></div><span className="visit-calendar-day__count">{selectedVisits.length} {selectedVisits.length === 1 ? 'visit' : 'visits'}</span></header>
        {selectedVisits.length ? <div className="visit-calendar-day__list">{selectedVisits.map((visit) => (
          <article key={visit.id} className="visit-calendar-event">
            <div className={`visit-calendar-event__rail visit-calendar-event__rail--${visit.status.toLowerCase()}`} />
            <div className="visit-calendar-event__main"><div className="visit-calendar-event__top"><span className="visit-calendar-event__time"><Clock3 size={13} aria-hidden="true" />{formatVisitTime(visit.visitTime)}</span><StatusBadge status={visit.status} /></div><h4>{visit.visitType} · {visit.participantName}</h4><p>{visit.trialName}</p><div className="visit-calendar-event__actions"><label><span className="sr-only">Update status for {visit.id}</span><select value={visit.status} onChange={(event) => onStatusChange(visit, event.target.value)}>{visitStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><Button variant="outline" size="small" onClick={() => onView(visit)}><Eye size={14} aria-hidden="true" /> Details</Button></div></div>
          </article>
        ))}</div> : <EmptyState title="No visits for this date" description="Select another date or adjust your filters to view demo visits." className="visit-calendar-day__empty" />}
      </section>
    </div>
  )
}
