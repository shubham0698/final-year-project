import { LoaderCircle } from 'lucide-react'

export default function LoadingState({ label = 'Loading', className = '' }) {
  return (
    <div className={`loading-state ${className}`.trim()} role="status" aria-live="polite">
      <LoaderCircle className="loading-state__spinner" size={22} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
