import { Eye, EyeOff } from 'lucide-react'

export default function AuthField({
  id,
  name = id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  inputMode,
  icon: Icon,
  error,
  required = true,
  minLength,
  showPassword,
  onTogglePassword,
}) {
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={id}>{label}</label>
      <div className={`auth-input-wrap${error ? ' auth-input-wrap--error' : ''}`}>
        {Icon && <Icon className="auth-input-icon" size={17} aria-hidden="true" />}
        <input
          className="auth-input"
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          minLength={minLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {isPassword && (
          <button
            className="auth-password-toggle"
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            aria-pressed={Boolean(showPassword)}
          >
            {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && <span className="auth-field__error" id={`${id}-error`}>{error}</span>}
    </div>
  )
}
