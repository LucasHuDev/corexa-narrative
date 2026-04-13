import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ArchDemo.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  { name: 'Casa Minimal', tag: 'Residential · 2024', loc: 'Dalkey, Dublin', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  { name: 'Torre Glass', tag: 'Commercial · 2023', loc: 'Grand Canal Dock', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80' },
  { name: 'Pavilion 04', tag: 'Institutional · 2024', loc: 'Phoenix Park', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
];

const PHILOSOPHY = [
  'Space is not built. It is revealed.',
  'Every line has a reason.',
  'Form follows intention.',
];

const SERVICE_ROWS = [
  { num: '01', name: 'Residential', desc: 'Private homes, villas, and apartment complexes designed around how people actually live. We start with the human, not the blueprint.' },
  { num: '02', name: 'Commercial', desc: 'Offices, retail, and hospitality spaces that elevate brand through architecture. Every surface communicates.' },
  { num: '03', name: 'Institutional', desc: 'Public buildings, cultural centres, and educational facilities built for permanence. Architecture that outlasts its makers.' },
];

const AWARDS = [
  { year: '2024', title: 'RIBA International Prize — Shortlisted' },
  { year: '2024', title: 'RIAI Best Emerging Practice' },
  { year: '2023', title: 'World Architecture Festival — Residential Finalist' },
  { year: '2023', title: 'Dezeen Awards — House of the Year' },
];

export default function ArchDemo() {
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Hide-on-scroll-down navbar
  useEffect(() => {
    let lastY = 0;
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-hidden', y > 120 && y > lastY);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP reveals
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Hero text reveal — clip-path wipe
      gsap.fromTo('.arch-d__hero-line', { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'expo.out', stagger: 0.4,
        scrollTrigger: { trigger: heroRef.current, start: 'top 60%', once: true },
      });

      // Hero subtitle + scroll hint
      gsap.fromTo('.arch-d__hero-sub, .arch-d__scroll-hint', { opacity: 0 }, {
        opacity: 1, duration: 1, delay: 1.2, ease: 'power2.out',
      });

      // Manifesto line
      gsap.fromTo('.arch-d__manifesto', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.arch-d__manifesto', start: 'top 80%', once: true },
      });

      // Project cards — staggered scale reveal
      gsap.fromTo('.arch-d__proj-card', { opacity: 0, y: 80, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2,
        scrollTrigger: { trigger: '.arch-d__projects-grid', start: 'top 85%', once: true },
      });

      // Image parallax on scroll
      document.querySelectorAll('.arch-d__proj-photo').forEach(img => {
        gsap.to(img, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.arch-d__proj-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // Service rows
      gsap.fromTo('.arch-d__svc-row', { opacity: 0, x: -40 }, {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.arch-d__services', start: 'top 75%', once: true },
      });

      // Awards
      gsap.fromTo('.arch-d__award', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.arch-d__awards', start: 'top 80%', once: true },
      });

      // CTA
      gsap.fromTo('[data-arch-cta]', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.arch-d__cta', start: 'top 80%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Philosophy fade-in via IntersectionObserver
  useEffect(() => {
    const items = document.querySelectorAll('.arch-d__philo-item');
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.4 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Magnetic button
  useEffect(() => {
    const btn = document.querySelector('.arch-d__magnetic-btn');
    if (!btn || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e) => {
      const r = btn.getBoundingClientRect();
      const x = Math.max(-14, Math.min(14, (e.clientX - r.left - r.width/2) * 0.22));
      const y = Math.max(-14, Math.min(14, (e.clientY - r.top - r.height/2) * 0.22));
      gsap.to(btn, { x, y, duration: 0.25, ease: 'power3.out', overwrite: 'auto' });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    btn.addEventListener('mousemove', onMove, { passive: true });
    btn.addEventListener('mouseleave', onLeave, { passive: true });
    return () => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div className="arch-d" ref={rootRef}>
      <Link to="/" className="demo-badge">⚡ Demo by CorexaStudio</Link>

      {/* ── Navbar ── */}
      <nav className="arch-d__nav" ref={navRef}>
        <div className="arch-d__nav-inner">
          <span className="arch-d__logo">FORM STUDIO</span>
          <div className="arch-d__links">
            <a href="#ad-projects">Projects</a>
            <a href="#ad-studio">Studio</a>
            <a href="#ad-contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* ── Hero — cinematic full-screen ── */}
      <section className="arch-d__hero" ref={heroRef}>
        <div className="arch-d__hero-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80)' }} aria-hidden="true" />
        <div className="arch-d__hero-inner">
          <h1 className="arch-d__hero-line">ARCHITECTURE</h1>
          <h1 className="arch-d__hero-line arch-d__hero-line--accent">IS INTENTION.</h1>
          <p className="arch-d__hero-sub">Form Studio — Dublin, Ireland</p>
        </div>
        <div className="arch-d__scroll-hint">
          <span className="arch-d__scroll-line" aria-hidden="true" />
          <span className="arch-d__scroll-text">scroll</span>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="arch-d__manifesto-section">
        <div className="arch-d__container">
          <p className="arch-d__manifesto">We believe architecture is the most intimate form of design. It shapes how you wake, how you work, how you breathe. Every project begins with a single question — how should this space make you feel?</p>
        </div>
      </section>

      {/* ── Projects — staggered grid ── */}
      <section id="ad-projects" className="arch-d__projects">
        <div className="arch-d__container">
          <div className="arch-d__section-head">
            <span className="arch-d__section-num">01</span>
            <h2 className="arch-d__section-label">Selected Projects</h2>
          </div>
          <div className="arch-d__projects-grid">
            {PROJECTS.map((p, i) => (
              <div key={p.name} className={`arch-d__proj-card ${i === 1 ? 'arch-d__proj-card--tall' : ''}`}>
                <div className="arch-d__proj-img">
                  <img src={p.img} alt={p.name} className="arch-d__proj-photo" loading="lazy" />
                  <div className="arch-d__proj-overlay" />
                </div>
                <div className="arch-d__proj-info">
                  <span className="arch-d__proj-tag">{p.tag}</span>
                  <h3 className="arch-d__proj-name">{p.name}</h3>
                  <span className="arch-d__proj-loc">{p.loc}</span>
                  <span className="arch-d__proj-link">View Project →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <div id="ad-studio" className="arch-d__philo-stack">
        {PHILOSOPHY.map((text, i) => (
          <div key={i} className="arch-d__philo-item">
            <span className="arch-d__philo-num">{String(i + 1).padStart(2, '0')}</span>
            <p className="arch-d__philo-statement">{text}</p>
          </div>
        ))}
      </div>

      {/* ── Services — numbered, editorial ── */}
      <section className="arch-d__services">
        <div className="arch-d__container">
          <div className="arch-d__section-head">
            <span className="arch-d__section-num">02</span>
            <h2 className="arch-d__section-label">Services</h2>
          </div>
          {SERVICE_ROWS.map((s, i) => (
            <div
              key={s.name}
              className={`arch-d__svc-row ${hoveredRow === i ? 'is-open' : ''}`}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <span className="arch-d__svc-num">{s.num}</span>
              <div className="arch-d__svc-body">
                <h3 className="arch-d__svc-name">{s.name}</h3>
                <p className="arch-d__svc-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="arch-d__awards">
        <div className="arch-d__container">
          <div className="arch-d__section-head">
            <span className="arch-d__section-num">03</span>
            <h2 className="arch-d__section-label">Recognition</h2>
          </div>
          {AWARDS.map((a, i) => (
            <div key={i} className="arch-d__award">
              <span className="arch-d__award-year">{a.year}</span>
              <span className="arch-d__award-title">{a.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section id="ad-contact" className="arch-d__cta">
        <span className="arch-d__cta-num" data-arch-cta>04</span>
        <h2 className="arch-d__cta-title" data-arch-cta>Begin a project.</h2>
        <div className="arch-d__cta-line" data-arch-cta />
        <p className="arch-d__cta-email" data-arch-cta>hello@formstudio.ie</p>
        <Link to="/contact" className="arch-d__magnetic-btn" data-arch-cta>Get in touch</Link>
      </section>

      {/* ── Footer ── */}
      <footer className="arch-d__footer">
        <div className="arch-d__container arch-d__footer-inner">
          <span className="arch-d__logo">FORM STUDIO</span>
          <span className="arch-d__footer-year">© 2024</span>
          <span className="arch-d__footer-credit">Built by CorexaStudio</span>
        </div>
      </footer>
    </div>
  );
}
