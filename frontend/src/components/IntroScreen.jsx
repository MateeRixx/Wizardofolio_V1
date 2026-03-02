import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * IntroScreen — agency-style letter-split + curtain-wipe reveal
 * Similar to dnaprojecten.nl approach:
 *  1. Letters stagger in one by one
 *  2. Role subtitle fades in
 *  3. Two curtain panels (top + bottom) split apart automatically
 *  4. onReveal() fires → main site animates in
 *
 * Props:
 *   onReveal()  — called when exit animation finishes
 */
export default function IntroScreen({ onReveal }) {
  const topPanelRef    = useRef(null)
  const botPanelRef    = useRef(null)
  const lettersRef     = useRef([])
  const subtitleRef    = useRef(null)
  const skipRef        = useRef(null)
  const hasRevealedRef = useRef(false)

  const NAME = 'TIME TO MAKE THE MAGIC HAPPEN'
  const ROLE = ''

  /* ── Run the full intro sequence ──────────────────────────────────── */
  useEffect(() => {
    const tl = gsap.timeline()

    /* 1. Letters drop in with stagger */
    tl.fromTo(
      lettersRef.current,
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'power4.out', stagger: 0.055 }
    )

    /* 2. Subtitle fades up */
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )

    /* 3. Scroll hint appears */
    tl.fromTo(
      skipRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '+=0.15'
    )

    /* 4. Bounce the arrow repeatedly once visible */
    tl.to(skipRef.current?.querySelector?.('.arrow'), {
      y: 7,
      repeat: -1,
      yoyo: true,
      duration: 0.65,
      ease: 'sine.inOut',
    }, '-=0.1')

    /* 5. After text is in, listen for scroll / touch to trigger reveal */
    const onScroll = () => triggerReveal()
    let touchStartY = 0
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchMove  = (e) => { if (touchStartY - e.touches[0].clientY > 30) triggerReveal() }

    tl.add(() => {
      window.addEventListener('wheel',      onScroll,     { passive: true, once: true })
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove',  onTouchMove,  { passive: true })
    })

    return () => {
      tl.kill()
      window.removeEventListener('wheel',      onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, []) // eslint-disable-line

  /* ── Curtain wipe ───────────────────────────────────────────────── */
  const triggerReveal = () => {
    if (hasRevealedRef.current) return
    hasRevealedRef.current = true

    const tl = gsap.timeline({ onComplete: onReveal })

    /* Letters flick toward centre and out */
    tl.to(lettersRef.current, {
      y: '-10px',
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      stagger: { each: 0.025, from: 'center' },
    })
    tl.to(subtitleRef.current, { opacity: 0, duration: 0.25 }, '<')
    tl.to(skipRef.current,     { opacity: 0, duration: 0.2  }, '<')

    /* Top panel slides up, bottom panel slides down */
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

      {/* ── Content (sits between the two panels) ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '1.2rem', pointerEvents: 'none',
      }}>

        {/* Name — each letter has its own overflow:hidden mask */}
        <div style={{ display: 'flex', gap: 'clamp(2px, 0.5vw, 8px)', overflow: 'hidden' }}
             aria-label={NAME}>
          {NAME.split('').map((char, i) => (
            <div key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
              <span
                ref={el => { lettersRef.current[i] = el }}
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-display, serif)',
                  fontSize: 'clamp(2.6rem, 8.5vw, 7.5rem)',
                  fontWeight: 700,
                  color: '#DDAF90',
                  letterSpacing: '0.07em',
                  lineHeight: 1,
                  opacity: 0,
                  willChange: 'transform, opacity',
                }}
              >
                {char}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} style={{
          fontFamily: 'var(--font-body, sans-serif)',
          fontSize: 'clamp(0.6rem, 1.4vw, 0.8rem)',
          letterSpacing: '0.3em',
          color: 'rgba(221,175,144,0.45)',
          textTransform: 'uppercase',
          opacity: 0, margin: 0,
        }}>
          {ROLE}
        </p>

        {/* Thin vertical line accent */}
        <div style={{
          width: '1.5px', height: '44px',
          background: 'linear-gradient(to bottom, rgba(206,135,21,0.55), transparent)',
          marginTop: '0.2rem',
        }} />
      </div>

      {/* ── Scroll hint (centered bottom, clickable too) ── */}
      <div
        ref={skipRef}
        onClick={triggerReveal}
        style={{
          position: 'fixed', bottom: '2.2rem', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.45rem',
          opacity: 0, cursor: 'pointer',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-body, sans-serif)',
          fontSize: '0.62rem', letterSpacing: '0.3em',
          color: 'rgba(221,175,144,0.4)', textTransform: 'uppercase',
        }}>
          Scroll to reveal
        </span>
        <span className="arrow" style={{
          display: 'block', width: '18px', height: '18px',
          borderRight: '1.5px solid rgba(206,135,21,0.5)',
          borderBottom: '1.5px solid rgba(206,135,21,0.5)',
          transform: 'rotate(45deg)',
        }} />
      </div>
    </div>
  )
}
