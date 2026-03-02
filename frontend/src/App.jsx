import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { portfolioData as initialData } from './data/index'
import { photoEditing } from './data/photoEditing'
import SkillSection from './components/SkillSection'
import SocialSection from './components/SocialSection'
import HeroTitle from './components/HeroTitle'
import RandomQuote from './components/RandomQuote'
import ProjectUploadModal from './components/ProjectUploadModal'
import { GridView } from './components/PhotoShowcase'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import IntroScreen from './components/IntroScreen'
import './index.css'

function App() {
  const [data, setData] = useState(initialData)
  const [activeSkill, setActiveSkill] = useState(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // STANDALONE GALLERY VIEW CHECK
  const isGalleryView = window.location.search.includes('gallery=true');

  if (isGalleryView) {
    return (
        <div className="standalone-gallery" style={{ background: '#050301' }}>
            <GridView 
                items={photoEditing.items} 
                onBack={() => window.close()} 
            />
        </div>
    );
  }
  const heroRef    = useRef(null)
  const sectionsRef = useRef(null)

  /* ---- Fetch dynamic projects from MongoDB ---- */
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Skip fetch entirely if no backend URL is configured
    if (!apiUrl) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/projects`);
        const dbProjects = await response.json();
        
        if (dbProjects.length > 0) {
          setData(prev => {
            const updatedSkills = prev.skills.map(skill => {
              const matches = dbProjects.filter(p => p.category === skill.id);
              return {
                ...skill,
                items: [...matches, ...skill.items]
              };
            });
            return { ...prev, skills: updatedSkills };
          });
        }
      } catch {
        console.warn('Backend not connected, showing local data only.');
      }
    };
    fetchProjects();
  }, []);

  const handleAddProject = (newProject) => {
    const updatedSkills = data.skills.map(skill => {
      const isMatch = newProject.category === skill.id || (skill.id === 'video-editing' && !newProject.category);
      if (isMatch) {
        return {
          ...skill,
          items: [newProject, ...skill.items]
        };
      }
      return skill;
    });
    setData({ ...data, skills: updatedSkills });
  }

  /* ---- GSAP hero entrance — fires after reveal with delay ---- */
  useEffect(() => {
    if (!revealed) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2 })

      /* nav items drop in */
      tl.fromTo(
        '.nav-link',
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
      )
      /* "explore below" hint */
      tl.fromTo(
        '.hero-hint',
        { opacity: 0 },
        { opacity: 0.4, duration: 0.9, ease: 'power2.out' },
        '-=0.3'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [revealed])

  /* ---- Smooth scroll into sections when clicking a skill ---- */
  const handleActivate = (id) => {
    setActiveSkill(id === activeSkill ? null : id)
    if (id !== activeSkill) {
      setTimeout(() => {
        const el = document.getElementById(`skill-${id}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  const handleClose = () => setActiveSkill(null)

  return (
    <>
      {/* ── Intro splash screen ── */}
      {!revealed && <IntroScreen onReveal={() => setRevealed(true)} />}

      {/* Animated background */}
      <div className="bg-blobs" style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div className="bg-noise" />

      <div ref={heroRef} className="App" style={{ opacity: revealed ? 1 : 0 }}>

        {/* ===== NAVIGATION ===== */}
        <nav className="glass-nav">
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            {/* Logo */}
            <span className="nav-link" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem', fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '0.05em',
              cursor: 'default', userSelect: 'none',
            }}>
              {data.hero.title}
            </span>

            {/* Desktop links */}
            <div className="nav-desktop-links">
              {data.skills.map(s => (
                <button
                  key={s.id}
                  className="nav-link btn-glass"
                  style={{
                    color: activeSkill === s.id ? s.color : 'var(--text-secondary)',
                    borderColor: activeSkill === s.id ? s.color : 'rgba(221,175,144,0.15)',
                    boxShadow: activeSkill === s.id ? `0 0 10px ${s.color}44` : 'none',
                  }}
                  onClick={() => handleActivate(s.id)}
                >
                  {s.shortLabel}
                </button>
              ))}
              <button
                onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                className="nav-link btn-glass" style={{ marginLeft: '0.25rem' }}
              >
                Contact
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="hamburger-btn"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(o => !o)}
            >
              <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none', transition: 'transform 0.3s' }} />
              <span style={{ opacity: mobileMenuOpen ? 0 : 1, transition: 'opacity 0.3s' }} />
              <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none', transition: 'transform 0.3s' }} />
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="nav-mobile-menu">
              {data.skills.map(s => (
                <button
                  key={s.id}
                  className="btn-glass"
                  style={{
                    color: activeSkill === s.id ? s.color : 'var(--text-secondary)',
                    borderColor: activeSkill === s.id ? s.color : 'rgba(221,175,144,0.15)',
                  }}
                  onClick={() => { handleActivate(s.id); setMobileMenuOpen(false); }}
                >
                  {s.shortLabel}
                </button>
              ))}
              <button
                className="btn-glass"
                onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
              >
                Contact
              </button>
            </div>
          )}
        </nav>

        <header style={{
          minHeight: '75vh',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(5rem, 12vw, 8rem) 1.5rem 2rem',
          position: 'relative'
        }}>
          <HeroTitle
            key={revealed ? 'revealed' : 'hidden'}
            title={data.hero.title}
            subtitle={data.hero.subtitle}
            animDelay={revealed ? 2 : 9999}
          />
          <p
            className="hero-hint"
            style={{
              fontSize: '0.75rem', letterSpacing: '3px',
              textTransform: 'uppercase', color: 'var(--text-secondary)',
              opacity: 0.4, marginTop: '3.5rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <span>↓</span> explore below
          </p>
        </header>

        {/* ===== SCROLLABLE ABOUT SECTION ===== */}
        <AboutSection />

        {/* ===== SCROLLABLE SKILL SECTIONS ===== */}
        <main ref={sectionsRef} style={{ paddingBottom: '8rem' }}>
          {/* Divider decoration */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(221,175,144,0.25), transparent)',
            maxWidth: '1200px', margin: '0 auto 0.5rem'
          }} />

          {data.skills.map((skill) => (
            <div key={skill.id} id={`skill-${skill.id}`}>
              <SkillSection
                skill={skill}
                isActive={activeSkill === skill.id}
                onActivate={handleActivate}
                onClose={handleClose}
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            </div>
          ))}
        </main>

        {/* ===== CONTACT SECTION ===== */}
        <ContactSection />

        {/* ===== SOCIAL SECTION ===== */}
        <div style={{ borderTop: '1px solid rgba(221,175,144,0.08)', maxWidth: '1200px', margin: '0 auto' }} />
        <SocialSection socials={data.socials} />

        {/* ===== FOOTER ===== */}
        <footer style={{
          borderTop: '1px solid rgba(221,175,144,0.1)',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <RandomQuote />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.4, letterSpacing: '1px' }}>
            © 2026 Summohith · All rights reserved
          </p>
        </footer>
      </div>

      {/* Upload modal — dev/local only, hidden when no backend is configured */}
      {isUploadOpen && import.meta.env.VITE_API_URL && (
        <ProjectUploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onAdd={handleAddProject}
          category={activeSkill || 'video-editing'}
        />
      )}
    </>
  )
}

export default App
