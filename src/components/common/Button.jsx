import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:   'bg-ink text-paper hover:bg-ink/85',
  secondary: 'bg-transparent text-ink border border-ink/25 hover:border-ink/60',
  full:      'bg-full text-white hover:bg-full-deep',
  linear:    'bg-linear text-white hover:bg-linear-deep',
  ghost:     'bg-transparent text-ink-soft hover:text-ink hover:bg-paper-line/50',
  danger:    'bg-red-600 text-white hover:bg-red-700',
}

const SIZES = {
  sm:  'text-sm px-3 py-1.5',
  md:  'text-sm px-4 py-2.5',
  lg:  'text-base px-5 py-3',
}

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function Button({
  as = 'button',
  to,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  disabled,
  ...props
}) {
  const cls = [
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-150',
    SIZES[size] ?? SIZES.md,
    VARIANTS[variant] ?? VARIANTS.primary,
    FOCUS,
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ].join(' ')

  const iconEl = Icon ? <Icon size={15} aria-hidden="true" /> : null

  const content = (
    <>
      {iconPosition === 'left' && iconEl}
      {children}
      {iconPosition === 'right' && iconEl}
    </>
  )

  if (as === 'link' && to) {
    return <Link to={to} className={cls} {...props}>{content}</Link>
  }

  return (
    <button className={cls} disabled={disabled} {...props}>
      {content}
    </button>
  )
}
