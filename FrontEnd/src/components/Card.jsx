export default function Card({ as: Element = 'section', padding = 'medium', className = '', children, ...props }) {
  return (
    <Element className={`ui-card ui-card--${padding} ${className}`.trim()} {...props}>
      {children}
    </Element>
  )
}
