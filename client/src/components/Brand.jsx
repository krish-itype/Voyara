import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Brand({ light = false }) {
  return (
    <Link className={`brand ${light ? 'brand--light' : ''}`} to="/" aria-label="Voyara home">
      <span className="brand__mark"><Compass size={22} strokeWidth={2.4} /></span>
      <span>voyara</span>
    </Link>
  )
}
