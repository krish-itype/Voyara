import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand.jsx'

export function NotFoundPage() {
  return <main className="not-found"><Brand /><p className="eyebrow">404 · Wrong turn</p><h1>This destination doesn’t exist.</h1><p>Let’s take you back to somewhere familiar.</p><Link className="button button--primary" to="/"><ArrowLeft size={18} /> Back to Voyara</Link></main>
}
