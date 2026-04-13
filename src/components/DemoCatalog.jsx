import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';
import './DemoCatalog.css';

gsap.registerPlugin(ScrollTrigger);

const CARD_BGS = ['#020202', '#030303', '#050505'];

export default function DemoCatalog() {
  const rootRef = useRef(null);
  const T = useT();

  const tiers = [
    {
      level: '01',
      key: 'launch',
      name: T(t.demoCatalog.tiers.launch.name),
      stack: T(t.demoCatalog.tiers.launch.stack),
      badge: null,
      description: T(t.demoCatalog.tiers.launch.desc),
      demo: T(t.demoCatalog.tiers.launch.demo),
      features: [
        T(t.demoCatalog.tiers.launch.f1),
        T(t.demoCatalog.tiers.launch.f2),
        T(t.demoCatalog.tiers.launch.f3),
        T(t.demoCatalog.tiers.launch.f4),
      ],
      demoUrl: '/demos/barberdemo.html',
    },
    {
      level: '02',
      key: 'system',
      name: T(t.demoCatalog.tiers.system.name),
      stack: T(t.demoCatalog.tiers.system.stack),
      badge: T(t.demoCatalog.mostPopular),
      description: T(t.demoCatalog.tiers.system.desc),
      demo: T(t.demoCatalog.tiers.system.demo),
      features: [
        T(t.demoCatalog.tiers.system.f1),
        T(t.demoCatalog.tiers.system.f2),
        T(t.demoCatalog.tiers.system.f3),
        T(t.demoCatalog.tiers.system.f4),
      ],
      demoUrl: '/demos/cafedemo.html',
    },
    {
      level: '03',
      key: 'premium',
      name: T(t.demoCatalog.tiers.premium.name),
      stack: T(t.demoCatalog.tiers.premium.stack),
      badge: T(t.demoCatalog.pwaIncluded),
      description: T(t.demoCatalog.tiers.premium.desc),
      demo: T(t.demoCatalog.tiers.premium.demo),
      features: [
        T(t.demoCatalog.tiers.premium.f1),
        T(t.demoCatalog.tiers.premium.f2),
        T(t.demoCatalog.tiers.premium.f3),
        T(t.demoCatalog.tiers.premium.f4),
      ],
      demoUrl: '/demos/archdemo.html',
    },
  ];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-demo-fade]',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        },
      );

      gsap.fromTo(
        '.demo__card',
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.demo__grid',
            start: 'top 80%',
            once: true,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solutions"
      ref={rootRef}
      className="demo"
      aria-label="Solutions"
    >
      <span className="section-label" aria-hidden="true">
        {T(t.demoCatalog.sectionLabel)}
      </span>

      <div className="container demo__inner">
        <header className="demo__head">
          <h2 className="demo__title" data-demo-fade>
            {T(t.demoCatalog.title)}
          </h2>
          <p className="demo__sub" data-demo-fade>
            {T(t.demoCatalog.subtitle)}
          </p>
        </header>

        <div className="demo__grid">
          {tiers.map((tier, i) => (
            <article
              key={tier.level}
              className="demo__card"
              style={{ background: CARD_BGS[i] || '#020202' }}
            >
              {tier.badge ? (
                <span className="demo__badge">{tier.badge}</span>
              ) : null}

              <div className="demo__card-top">
                <span className="demo__level">{tier.level}</span>
                <span className="demo__stack">{tier.stack}</span>
              </div>

              <h3 className="demo__name">{tier.name}</h3>
              <p className="demo__desc">{tier.description}</p>
              <p className="demo__demo">{tier.demo}</p>

              <ul className="demo__features">
                {tier.features.map((f) => (
                  <li key={f} className="demo__feature">
                    — {f}
                  </li>
                ))}
              </ul>

              <div className="demo__actions">
                <a
                  href={tier.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary demo__cta"
                  aria-label={`${T(t.demoCatalog.viewDemo)} — ${tier.name}`}
                >
                  {T(t.demoCatalog.viewDemo)}
                </a>
                <Link
                  to="/contact"
                  className="btn-ghost demo__cta"
                  aria-label={`${T(t.demoCatalog.getQuote)} — ${tier.name}`}
                >
                  {T(t.demoCatalog.getQuote)}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
