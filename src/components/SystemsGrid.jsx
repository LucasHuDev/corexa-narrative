import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';
import './SystemsGrid.css';

gsap.registerPlugin(ScrollTrigger);

export default function SystemsGrid() {
  const rootRef = useRef(null);
  const T = useT();

  const SERVICES = [
    { id: 'architecture', name: T(t.services.items.architecture.name), desc: T(t.services.items.architecture.desc) },
    { id: 'interfaces', name: T(t.services.items.interfaces.name), desc: T(t.services.items.interfaces.desc) },
    { id: 'automation', name: T(t.services.items.automation.name), desc: T(t.services.items.automation.desc) },
    { id: 'maintenance', name: T(t.services.items.maintenance.name), desc: T(t.services.items.maintenance.desc) },
  ];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const rows = root.querySelectorAll('[data-svc-row]');
    if (!rows.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.11,
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const handleRowClick = (id) => {
    // Hook for future service modal integration.
    // Currently a no-op — SystemsGrid has no modals yet.
    void id;
  };

  return (
    <section
      ref={rootRef}
      className="services-section"
      aria-label="Services"
      id="services"
    >
      <span className="section-label" aria-hidden="true">{T(t.services.sectionLabel)}</span>

      <div className="services-head container">
        <h2 className="services-title">{T(t.services.title)}</h2>
        <p className="services-kicker">
          {T(t.services.kicker)}
        </p>
      </div>

      <ul className="services-list container" role="list">
        {SERVICES.map((svc, i) => (
          <li key={svc.id} className="services-row-wrap" data-svc-row>
            <button
              type="button"
              className="services-row"
              onClick={() => handleRowClick(svc.id)}
              aria-label={`${svc.name} — ${svc.desc}`}
            >
              <span className="services-row__num">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="services-row__name">{svc.name}</span>
              <span className="services-row__desc">{svc.desc}</span>
              <span className="services-row__arrow" aria-hidden="true">
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                  <path
                    d="M0 5h20M16 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
