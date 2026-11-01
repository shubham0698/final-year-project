const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export function formatTrialDate(value) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function currentISODate() {
  return new Date().toISOString().slice(0, 10)
}
