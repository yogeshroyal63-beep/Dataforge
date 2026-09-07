import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-ink text-paper hover:bg-ink/85',
  secondary: 'bg-transparent text-ink border border-ink/25 hover:border-ink/60',
  full: 'bg-full text-white hover:bg-full-deep',
  linear: 'bg-linear text-white hover:bg-linear-deep',
}

export default function Button({
  as = 'button',
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const sizeCls = size === 'sm' ? 'text-sm px-3 py-1.5' : 'text-sm px-4 py-2.5'
  const cls = `inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-150 ${sizeCls} ${VARIANTS[variant]} ${className}`

  if (as === 'link' && to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
