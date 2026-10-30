import { CalendarCheck2, Heart, MessageCircle, Plus, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isVendor = user.role === 'VENDOR'
  const signOut = async () => { await logout(); navigate('/', { replace: true }) }
  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Brand />
        <nav><a className="active" href="#overview"><UserRound size={19} /> Overview</a><a href="#bookings"><CalendarCheck2 size={19} /> {isVendor ? 'Listings' : 'My trips'}</a><a href="#messages"><MessageCircle size={19} /> Enquiries</a>{!isVendor && <a href="#favorites"><Heart size={19} /> Saved places</a>}</nav>
        <button className="text-button dashboard-sidebar__logout" type="button" onClick={signOut}>Sign out</button>
      </aside>
      <main className="dashboard-main" id="overview">
        <header><div><p className="eyebrow">{isVendor ? 'Vendor dashboard' : 'Traveler dashboard'}</p><h1>Hello, {user.firstName}</h1><p>{isVendor ? 'Manage your presence and connect with travelers.' : 'Your next journey will appear here.'}</p></div>{isVendor && <button className="button button--primary" type="button"><Plus size={18} /> Add listing</button>}</header>
        {isVendor && user.vendorProfile?.status === 'PENDING' && <div className="status-banner"><span>Review in progress</span><p>Your vendor account is ready. An admin must approve it before listings can be published.</p></div>}
        <section className="dashboard-cards">
          <article><span>01</span><h2>{isVendor ? 'Complete your profile' : 'Explore experiences'}</h2><p>{isVendor ? 'Add your business story and contact details.' : 'Browse tours and stays, then save your favorites.'}</p></article>
          <article><span>02</span><h2>{isVendor ? 'Create a listing' : 'Send an enquiry'}</h2><p>{isVendor ? 'Build a tour or villa page and submit it for review.' : 'Ask the vendor about dates and availability.'}</p></article>
          <article><span>03</span><h2>{isVendor ? 'Welcome travelers' : 'Manage your trip'}</h2><p>{isVendor ? 'Reply to enquiries and manage confirmed bookings.' : 'Keep messages and booking details together.'}</p></article>
        </section>
      </main>
    </div>
  )
}
