import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Activity } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/experiment', label: 'Experiment' },
  { to: '/bdh-cq',     label: 'BDH-CQ' },
  { to: '/limitation', label: 'Limitation' },
  { to: '/sources',    label: 'Sources' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const linkCls = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive ? 'text-ink font-medium' : 'text-ink-soft hover:text-ink'
    }`

  return (
    <header className="border-b border-paper-line bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="StateLens home">
          <span className="w-7 h-7 rounded-sm bg-ink text-paper flex items-center justify-center" aria-hidden="true">
            <Activity size={15} strokeWidth={2.5} />
          </span>
          <span className="font-serif text-lg tracking-tight">StateLens</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="text-sm px-3.5 py-1.5 rounded-sm border border-ink/20 hover:border-ink/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {user ? 'Workspace' : 'Sign in'}
          </Link>
          <Link
            to="/experiment"
            className="text-sm px-3.5 py-1.5 rounded-sm bg-ink text-paper hover:bg-ink/85 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Try it live
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-sm"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-paper-line bg-paper px-5 py-4 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkCls}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="h-px bg-paper-line my-1" role="separator" />
          <Link to={user ? '/dashboard' : '/login'} onClick={() => setOpen(false)} className="text-sm">
            {user ? 'Workspace' : 'Sign in'}
          </Link>
          <Link
            to="/experiment"
            onClick={() => setOpen(false)}
            className="text-sm px-3.5 py-2 rounded-sm bg-ink text-paper text-center"
          >
            Try it live
          </Link>
        </nav>
      )}
    </header>
  )
}
