import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import './TrialModal.css'

export default function TrialModal({ title, description, onClose, children, size = 'large' }) {
  const dialogRef = useRef(null)
  const titleId = 'trial-modal-title'
  const descriptionId = 'trial-modal-description'

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const dialog = dialogRef.current
    const initialTarget = dialog?.querySelector('[data-modal-autofocus]')
      ?? dialog?.querySelector('input:not([type="hidden"]), select, textarea, button')
      ?? dialog
    initialTarget?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog) return

      const focusable = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')]
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [onClose])

  return createPortal(
    <div className="trial-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section
        className={`trial-modal trial-modal--${size}`}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex="-1"
      >
        <header className="trial-modal__header">
          <div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId}>{description}</p>}</div>
          <button className="trial-modal__close" type="button" onClick={onClose} aria-label="Close dialog">
            <X size={19} aria-hidden="true" />
          </button>
        </header>
        <div className="trial-modal__body">{children}</div>
      </section>
    </div>,
    document.body,
  )
}
