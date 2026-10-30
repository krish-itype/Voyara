import { Heart, Menu, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Brand } from './Brand.jsx'

export function SiteHeader({ overlay = false }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const accountPath = user?.role === 'ADMIN' ? '/admin' : user ? '/dashboard' : '/login'

  useEffect(() => {
    const updateHeader = () => {
      setScrolled(window.scrollY > 24)
    }
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('resize', updateHeader)
    return () => {
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('resize', updateHeader)
    }
  }, [])

  return (
    <header className={`site-header ${overlay ? 'site-header--overlay' : ''} ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <Brand light={overlay} />
        <nav className={`site-nav ${open ? 'site-nav--open' : ''}`} aria-label="Primary navigation">
          <a href="#tours" onClick={() => setOpen(false)}>Tours</a>
          <a href="#stays" onClick={() => setOpen(false)}>Villas</a>
          <a href="#specials" onClick={() => setOpen(false)}>Specials</a>
          <Link to="/register?role=vendor" onClick={() => setOpen(false)}>List your experience</Link>
        </nav>
        <div className="site-header__actions">
          <button className="icon-button desktop-only" type="button" aria-label="Saved trips"><Heart size={20} /></button>
          <Link className="account-link" to={accountPath}><UserRound size={19} /><span>{user ? user.firstName : 'Sign in'}</span></Link>
          <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  )
}
