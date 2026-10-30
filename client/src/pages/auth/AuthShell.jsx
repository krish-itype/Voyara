import { ArrowLeft, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/voyara-hero.png'
import { Brand } from '../../components/Brand.jsx'

export function AuthShell({ children, title, subtitle }) {
  return (
    <main className="auth-shell">
      <section className="auth-shell__visual" style={{ '--auth-image': `url(${heroImage})` }}>
        <div className="auth-shell__visual-shade" />
        <div className="auth-shell__top"><Brand light /></div>
        <div className="auth-shell__visual-copy">
          <p className="eyebrow eyebrow--light">Your journey starts here</p>
          <h1>Discover more.<br />Travel better.</h1>
          <ul><li><Check size={18} /> Save tours and stays you love</li><li><Check size={18} /> Send enquiries to verified vendors</li><li><Check size={18} /> Keep every booking in one place</li></ul>
        </div>
      </section>
      <section className="auth-shell__form-side">
        <Link className="back-link" to="/"><ArrowLeft size={17} /> Back to home</Link>
        <div className="auth-card"><h2>{title}</h2><p className="auth-card__subtitle">{subtitle}</p>{children}</div>
      </section>
    </main>
  )
}
