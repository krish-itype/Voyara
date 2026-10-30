import { Globe2, Mail, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand.jsx'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand"><Brand light /><p>Thoughtful tours and private stays, brought together in one place.</p></div>
        <div><h3>Explore</h3><a href="#tours">Tours</a><a href="#stays">Villas</a><a href="#specials">Specials</a></div>
        <div><h3>Vendors</h3><Link to="/register?role=vendor">Become a vendor</Link><Link to="/login">Vendor sign in</Link></div>
        <div><h3>Stay connected</h3><span className="footer__social"><Globe2 size={18} /><Share2 size={18} /><Mail size={18} /></span></div>
      </div>
      <div className="footer__bottom"><span>© 2026 Voyara</span><span>Privacy · Terms</span></div>
    </footer>
  )
}
