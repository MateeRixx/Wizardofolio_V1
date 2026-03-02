import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * IntroScreen — greeting + quote + click to reveal
 * ─────────────────────────────────────────────────
 * • Greeting fades in
 * • Quote fades in below
 * • "Enter" button pulses — click triggers curtain wipe
 *
 * ✏️  EDIT YOUR TEXT HERE:
 */
const GREETING = ''
const QUOTE    = '"Magic is something you make"'
const NAME_TAG = '~ Summohith'
// ─────────────────────────────────────────────────

export default function IntroScreen({ onReveal }) {
  const topPanelRef    = useRef(null)
  const botPanelRef    = useRef(null)
  const greetRef       = useRef(null)
  const quoteRef       = useRef(null)
  const nameTagRef     = useRef(null)
  const btnRef         = useRef(null)
  const ringRef        = useRef(null)
  const hasRevealedRef = useRef(false)

  /* ── Entrance sequence ───────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline()

    tl.fromTo(greetRef.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    )
    tl.fromTo(quoteRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.5'
    )
    tl.fromTo(nameTagRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    tl.fromTo(btnRef.current,
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' },
      '-=0.2'
    )
    /* pulsing ring on button */
    tl.to(ringRef.current, {
      scale: 1.45, opacity: 0,
      duration: 1.6, ease: 'power2.out',
      repeat: -1, repeatDelay: 0.5,
    }, '-=0.3')

    return () => {
      document.body.style.overflow = ''
      tl.kill()
    }
  }, [])

  /* ── Curtain wipe on click ───────────────────────────────────────── */
  const triggerReveal = () => {
    if (hasRevealedRef.current) return
    hasRevealedRef.current = true
    document.body.style.overflow = ''
    window.scrollTo(0, 0)

    const tl = gsap.timeline({ onComplete: onReveal })

    tl.to([greetRef.current, quoteRef.current, nameTagRef.current, btnRef.current], {
      opacity: 0, y: -12, duration: 0.35, ease: 'power2.in', stagger: 0.04,
    })
    tl.to(topPanelRef.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.05')
    tl.to(botPanelRef.current, { yPercent:  100, duration: 0.85, ease: 'power4.inOut' }, '<')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>

      {/* ── Top curtain ── */}
      <div ref={topPanelRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '51%', background: '#050301', zIndex: 2,
      }} />

      {/* ── Bottom curtain ── */}
      <div ref={botPanelRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '51%', background: '#050301', zIndex: 2,
      }} />

      {/* ── Content ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        gap: '0',
        pointerEvents: 'none',
      }}>

        {/* Greeting — only rendered when non-empty */}
        {GREETING ? (
          <p ref={greetRef} style={{
            fontFamily: 'var(--font-body, sans-serif)',
            fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#CE8715',
            opacity: 0,
            margin: '0 0 2rem 0',
          }}>
            {GREETING}
          </p>
        ) : <div ref={greetRef} />}

        {/* Quote */}
        <blockquote ref={quoteRef} style={{
          fontFamily: 'var(--font-display, serif)',
          fontSize: 'clamp(1.2rem, 4vw, 2.4rem)',
          fontWeight: 500,
          fontStyle: 'italic',
          color: '#DDAF90',
          textAlign: 'center',
          maxWidth: 'min(680px, 90vw)',
          lineHeight: 1.5,
          margin: 0,
          padding: '0 1rem',
          opacity: 0,
        }}>
          {QUOTE}
        </blockquote>

        {/* Name tag */}
        <p ref={nameTagRef} style={{
          fontFamily: 'var(--font-body, sans-serif)',
          fontSize: 'clamp(0.65rem, 1.3vw, 0.78rem)',
          letterSpacing: '0.2em',
          color: 'rgba(221,175,144,0.4)',
          margin: '1.2rem 0 3rem 0',
          opacity: 0,
        }}>
          {NAME_TAG}
        </p>

        {/* Enter button — needs pointer events */}
        <div style={{ position: 'relative', pointerEvents: 'all' }}>
          <div ref={ringRef} style={{
            position: 'absolute', inset: '-14px',
            borderRadius: '50%',
            border: '1.5px solid rgba(206,135,21,0.4)',
            transformOrigin: 'center',
          }} />
          <button
            ref={btnRef}
            onClick={triggerReveal}
            style={{
              width: 'clamp(80px, 18vw, 96px)', height: 'clamp(80px, 18vw, 96px)', borderRadius: '50%',
              background: 'transparent',
              border: '1.5px solid rgba(206,135,21,0.6)',
              color: '#CE8715',
              fontFamily: 'var(--font-display, serif)',
              fontSize: '0.88rem', letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer', opacity: 0,
              transition: 'background 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = 'rgba(206,135,21,0.1)'
              e.currentTarget.style.boxShadow   = '0 0 28px rgba(206,135,21,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow  = 'none'
            }}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  )
}
