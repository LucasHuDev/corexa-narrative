import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ImpactCalculator.css';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    id: 'hospitality',
    label: 'Hospitality & Food',
    icon: '◈',
    headline: 'Stop paying commissions. Own your bookings.',
    metrics: [
      { value: '23', suffix: '%', label: 'Increase in direct reservations', prefix: '+' },
      { value: '1,840', suffix: '€', label: 'Avg. monthly commission savings', prefix: '' },
      { value: '4.2', suffix: 'hrs', label: 'Saved weekly on room management', prefix: '' },
      { value: '67', suffix: '%', label: 'Faster check-in with digital systems', prefix: '+' },
    ],
  },
  {
    id: 'health',
    label: 'Clinics & Health',
    icon: '◉',
    headline: 'Eliminate no-shows. Recover lost revenue.',
    metrics: [
      { value: '340', suffix: '€', label: 'Recovered monthly from no-show reduction', prefix: '' },
      { value: '71', suffix: '%', label: 'Drop in missed appointments with auto-reminders', prefix: '-' },
      { value: '6', suffix: 'hrs', label: 'Admin hours saved per week', prefix: '' },
      { value: '38', suffix: '%', label: 'Increase in patient retention', prefix: '+' },
    ],
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    icon: '◇',
    headline: 'Stop losing high-value leads to slow follow-up.',
    metrics: [
      { value: '8', suffix: 'hrs', label: 'Saved weekly on manual lead qualification', prefix: '' },
      { value: '3×', suffix: '', label: 'Faster response to high-intent prospects', prefix: '' },
      { value: '29', suffix: '%', label: 'Higher conversion rate with automated follow-up', prefix: '+' },
      { value: '2,200', suffix: '€', label: 'Avg. monthly value of recovered lost leads', prefix: '' },
    ],
  },
  {
    id: 'beauty',
    label: 'Barbershops & Beauty',
    icon: '◎',
    headline: 'Let the system book while you work.',
    metrics: [
      { value: '12', suffix: 'hrs', label: 'Admin hours eliminated per week', prefix: '' },
      { value: '91', suffix: '%', label: 'Bookings handled automatically', prefix: '' },
      { value: '440', suffix: '€', label: 'Avg. monthly revenue increase from online visibility', prefix: '+' },
      { value: '0', suffix: '', label: 'Phone calls needed to fill your calendar', prefix: '' },
    ],
  },
];

// Split a value like "3×" into { numeric: "3", extra: "×" } so the count-up
// tween only touches the numeric part and preserves any trailing glyph.
function splitValue(raw) {
  const s = String(raw);
  const m = s.match(/^([\d.,]+)(.*)$/);
  if (!m) return { numeric: s, extra: '' };
  return { numeric: m[1], extra: m[2] };
}

export default function ImpactCalculator() {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const numRefs = useRef([]);
  const [activeId, setActiveId] = useState(industries[0].id);

  const active = industries.find((i) => i.id === activeId) || industries[0];

  // Entrance reveal on scroll (head, tabs, panel, foot).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-impact-fade]',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  // Tab change: fade cards out → count numbers up from 0 → fade in.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const numEls = numRefs.current.filter(Boolean);
    const cards = gsap.utils.toArray(panel.querySelectorAll('.impact__card'));

    if (reduce) {
      active.metrics.forEach((m, i) => {
        const el = numEls[i];
        if (!el) return;
        const { numeric, extra } = splitValue(m.value);
        el.textContent = numeric + extra + m.suffix;
      });
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline();
    tl.to(cards, {
      opacity: 0,
      y: 12,
      duration: 0.25,
      ease: 'power2.in',
    });
    tl.add(() => {
      active.metrics.forEach((m, i) => {
        const el = numEls[i];
        if (!el) return;
        const { numeric, extra } = splitValue(m.value);
        const isDecimal = numeric.includes('.');
        const target = parseFloat(numeric.replace(/,/g, ''));
        const fullSuffix = extra + m.suffix;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = isDecimal
              ? obj.v.toFixed(1) + fullSuffix
              : Math.round(obj.v).toLocaleString() + fullSuffix;
          },
        });
      });
    });
    tl.to(
      cards,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.05,
      },
      '>-0.05',
    );

    return () => tl.kill();
  }, [activeId, active.metrics]);

  return (
    <section
      id="impact"
      ref={rootRef}
      className="impact"
      aria-label="Impact Calculator"
    >
      <span className="section-label" aria-hidden="true">
        01 — Impact Calculator
      </span>

      <div className="container impact__inner">
        <header className="impact__head">
          <h2 className="impact__title" data-impact-fade>
            Project your digital growth.
          </h2>
          <p className="impact__sub" data-impact-fade>
            Our solutions speak your industry's language. Select your sector
            and see real projected metrics.
          </p>
        </header>

        <div
          className="impact__tabs"
          role="tablist"
          aria-label="Industries"
          data-impact-fade
        >
          {industries.map((ind) => (
            <button
              key={ind.id}
              type="button"
              role="tab"
              aria-selected={ind.id === activeId}
              className={`impact__tab ${ind.id === activeId ? 'is-active' : ''}`}
              onClick={() => setActiveId(ind.id)}
            >
              <span className="impact__tab-icon" aria-hidden="true">
                {ind.icon}
              </span>
              <span className="impact__tab-label">{ind.label}</span>
            </button>
          ))}
        </div>

        <div className="impact__panel" ref={panelRef} data-impact-fade>
          <p className="impact__headline">{active.headline}</p>

          <div className="impact__grid">
            {active.metrics.map((m, i) => (
              <article key={`${active.id}-${i}`} className="impact__card">
                <div className="impact__value">
                  {m.prefix ? (
                    <span className="impact__prefix">{m.prefix}</span>
                  ) : null}
                  <span
                    className="impact__num"
                    ref={(el) => (numRefs.current[i] = el)}
                  >
                    0{m.suffix}
                  </span>
                </div>
                <p className="impact__label">{m.label}</p>
              </article>
            ))}
          </div>
        </div>

        <p className="impact__foot" data-impact-fade>
          Our data engine expands continuously — new sectors added regularly.
        </p>
      </div>
    </section>
  );
}
