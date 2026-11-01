import { LoaderCircle } from 'lucide-react'

const variants = ['primary', 'secondary', 'outline', 'danger']

export default function Button({
  as: Element = 'button',
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const safeVariant = variants.includes(variant) ? variant : 'primary'
  const isButton = Element === 'button'

  return (
    <Element
      className={`ui-button ui-button--${safeVariant} ui-button--${size} ${className}`.trim()}
      {...(isButton ? { type, disabled: disabled || loading } : {})}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="ui-button__spinner" size={16} aria-hidden="true" />}
      {children}
    </Element>
  )
}
