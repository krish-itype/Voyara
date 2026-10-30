import { ArrowRight, CalendarDays, MapPin, Search, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/voyara-hero.png'
import alpineHeroImage from '../assets/voyara-hero-alpine.png'
import desertHeroImage from '../assets/voyara-hero-desert.png'
import mediterraneanHeroImage from '../assets/voyara-hero-mediterranean.png'
import { Footer } from '../components/Footer.jsx'
import { SiteHeader } from '../components/SiteHeader.jsx'

const heroImages = [
  {
    src: heroImage,
    label: 'Tropical island coast',
    eyebrow: 'Slow down by the sea',
    title: ['Your own corner', 'of clear blue.'],
    lead: 'Private island stays and coastal journeys, selected by verified local vendors.',
  },
  {
    src: alpineHeroImage,
    label: 'Alpine lake retreat',
    eyebrow: 'Fresh air, higher standards',
    title: ['Wake up where', 'the world feels wider.'],
    lead: 'Mountain retreats and guided escapes made personal from the very first enquiry.',
  },
  {
    src: desertHeroImage,
    label: 'Desert camp at sunset',
    eyebrow: 'Go beyond the expected',
    title: ['Follow the light', 'into the extraordinary.'],
    lead: 'Distinctive desert stays and private journeys, curated by trusted local experts.',
  },
  {
    src: mediterraneanHeroImage,
    label: 'Mediterranean coastal village',
    eyebrow: 'Stay close to the coast',
    title: ['A slower rhythm,', 'a brighter kind of blue.'],
    lead: 'Cliffside villas and coastal experiences designed for days worth remembering.',
  },
]

const discoveryCards = [
  { eyebrow: 'Coastal escapes', title: 'Slow days beside clear water', position: 'center 56%' },
  { eyebrow: 'Private stays', title: 'Space to settle in and unwind', position: '75% center' },
  { eyebrow: 'Guided journeys', title: 'See more with people who know', position: '42% center' },
]

const heroCopyVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.08, staggerChildren: 0.09 } },
  exit: { transition: { staggerChildren: 0.045, staggerDirection: -1 } },
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.24, ease: 'easeIn' } },
}

export function HomePage() {
  const [activeHero, setActiveHero] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const activeSlide = heroImages[activeHero]

  useEffect(() => {
    heroImages.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    if (heroPaused || shouldReduceMotion) return undefined

    const interval = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length)
    }, 6500)

    return () => window.clearInterval(interval)
  }, [heroPaused, shouldReduceMotion])

  return (
    <div className="home-page">
      <section
        className="hero-section"
        onBlurCapture={() => setHeroPaused(false)}
        onFocusCapture={() => setHeroPaused(true)}
      >
        <div className="hero-section__images" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.div
              animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
              className="hero-section__image"
              exit={{ filter: 'blur(5px)', opacity: 0, scale: 1.035 }}
              initial={{ filter: 'blur(7px)', opacity: 0, scale: 1.055 }}
              key={activeSlide.src}
              style={{ '--hero-image': `url(${activeSlide.src})` }}
              transition={{ filter: { duration: 0.8 }, opacity: { duration: 1.05, ease: 'easeInOut' }, scale: { duration: 6.8, ease: 'easeOut' } }}
            />
          </AnimatePresence>
        </div>
        <SiteHeader overlay />
        <div className="hero-section__shade" />
        <div className="hero-section__content page-shell">
          <AnimatePresence mode="wait">
            <motion.div animate="visible" className="hero-section__copy" exit="exit" initial="hidden" key={activeHero} variants={heroCopyVariants}>
              <motion.p className="eyebrow eyebrow--light" variants={heroItemVariants}>{activeSlide.eyebrow}</motion.p>
              <motion.h1 variants={heroItemVariants}>{activeSlide.title[0]}<br />{activeSlide.title[1]}</motion.h1>
              <motion.p className="hero-section__lead" variants={heroItemVariants}>{activeSlide.lead}</motion.p>
            </motion.div>
          </AnimatePresence>
          <motion.form animate={{ opacity: 1, y: 0 }} className="search-bar" initial={{ opacity: 0, y: 22 }} onSubmit={(event) => event.preventDefault()} transition={{ delay: 0.38, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <label><MapPin size={20} /><span><small>Where</small><input aria-label="Destination" placeholder="Choose a destination" /></span></label>
            <label><CalendarDays size={20} /><span><small>When</small><input aria-label="Travel dates" placeholder="Add dates" /></span></label>
            <label><Users size={20} /><span><small>Travelers</small><input aria-label="Number of travelers" placeholder="2 guests" /></span></label>
            <motion.button whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.98 }} type="submit" aria-label="Search"><Search size={21} /><span>Search</span></motion.button>
          </motion.form>
        </div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="hero-section__pagination"
          aria-label="Choose a featured destination"
          initial={{ opacity: 0, y: 12 }}
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {heroImages.map((image, index) => (
            <motion.button
              aria-label={`Show ${image.label}`}
              aria-pressed={index === activeHero}
              className={index === activeHero ? 'active' : ''}
              key={image.src}
              onClick={() => setActiveHero(index)}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
        <a className="hero-section__scroll" href="#discover">Discover more <span>↓</span></a>
      </section>

      <main>
        <section className="intro-section page-shell" id="discover">
          <div><p className="eyebrow">Curated for curious travelers</p><h2>Travel that feels personal,<br />from the very first click.</h2></div>
          <p className="intro-section__copy">Voyara brings memorable places and experienced local vendors together, so planning feels simpler and every trip has more character.</p>
        </section>
        <section className="discovery-grid page-shell" id="tours">
          {discoveryCards.map((card, index) => (
            <article className={`discovery-card discovery-card--${index + 1}`} key={card.title} style={{ '--card-image': `url(${heroImage})`, '--card-position': card.position }}>
              <div className="discovery-card__overlay" />
              <div className="discovery-card__content"><p>{card.eyebrow}</p><h3>{card.title}</h3><button type="button" aria-label={`Explore ${card.eyebrow}`}><ArrowRight size={20} /></button></div>
            </article>
          ))}
        </section>
        <section className="benefits-section" id="stays">
          <div className="page-shell benefits-section__inner">
            <div className="benefit"><Sparkles /><h3>Carefully selected</h3><p>A focused collection designed around quality, place, and experience.</p></div>
            <div className="benefit"><ShieldCheck /><h3>Verified vendors</h3><p>Vendor review tools help us build a marketplace travelers can use confidently.</p></div>
            <div className="benefit"><Users /><h3>Built for both sides</h3><p>Simple dashboards for travelers, tour operators, villa hosts, and admins.</p></div>
          </div>
        </section>
        <section className="partner-cta page-shell" id="specials">
          <div><p className="eyebrow">Share what makes your place special</p><h2>Grow with travelers who care about the details.</h2></div>
          <Link className="button button--dark" to="/register?role=vendor">Become a Voyara vendor <ArrowRight size={18} /></Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
