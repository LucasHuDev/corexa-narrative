import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';
import './StickyStack.css';

gsap.registerPlugin(ScrollTrigger);

export default function ArchitecturePinned() {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const T = useT();

  const CARDS = useMemo(
    () => [
      {
        label: T(t.studio.cards.c1.label),
        title: T(t.studio.cards.c1.title),
        desc: T(t.studio.cards.c1.desc),
        tags: ['Figma', 'UI Systems', 'Branding'],
      },
      {
        label: T(t.studio.cards.c2.label),
        title: T(t.studio.cards.c2.title),
        desc: T(t.studio.cards.c2.desc),
        tags: ['React', 'Next.js', 'WordPress'],
      },
      {
        label: T(t.studio.cards.c3.label),
        title: T(t.studio.cards.c3.title),
        desc: T(t.studio.cards.c3.desc),
        tags: ['APIs', 'Zapier', 'Custom Tools'],
      },
      {
        label: T(t.studio.cards.c4.label),
        title: T(t.studio.cards.c4.title),
        desc: T(t.studio.cards.c4.desc),
        tags: ['Updates', 'Security', 'Support'],
      },
    ],
    [T],
  );

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    // Mobile / tablet: simple fade-up stagger, no pinning
    if (!isDesktop) {
      if (reduce) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }
      const ctxM = gsap.context(() => {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 80%',
              once: true,
            },
          },
        );
      }, wrapper);
      return () => ctxM.revert();
    }

    if (reduce) {
      cards.forEach((c, i) =>
        gsap.set(c, { opacity: i === 0 ? 1 : 0, y: 0, scale: 1 }),
      );
      return;
    }

    // Desktop: initial state — first card active, rest below
    gsap.set(cards[0], { opacity: 1, y: 0, scale: 1 });
    for (let i = 1; i < cards.length; i++) {
      gsap.set(cards[i], { opacity: 0, y: 80, scale: 0.97 });
    }

    const ctx = gsap.context(() => {
      // Pin is handled by CSS (position: sticky on .arch-stage).
      // GSAP only drives the scrubbed card transitions below.

      // Each card owns one "slot" of the wrapper (4 cards → 4 slots of 25% each).
      // Transitions are tight windows centered on slot boundaries, leaving the
      // bulk of each slot as a "settled" zone where the card is fully visible
      // and readable. Snap targets align with those settled zones.
      const slots = cards.length; // 4
      const slotPct = 1 / slots;  // 0.25 of the wrapper = 125vh on a 500vh wrapper

      // Transition window: 0.15 of wrapper progress = ~75vh of scroll (within 60–80vh).
      const transitionWindow = 0.15;
      const halfWindow = transitionWindow / 2;

      // Build scrubbed transitions for i -> i+1
      for (let i = 0; i < cards.length - 1; i++) {
        const boundary = (i + 1) * slotPct;      // 0.25, 0.50, 0.75
        const startPct = boundary - halfWindow;  // transition begins
        const endPct = boundary + halfWindow;    // transition ends

        // Outgoing card (current): y 0 → -40, opacity 1 → 0, scale 1 → 0.97
        gsap.to(cards[i], {
          y: -40,
          opacity: 0,
          scale: 0.97,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: wrapper,
            start: `${startPct * 100}% top`,
            end: `${endPct * 100}% top`,
            scrub: 0.4,
          },
        });

        // Incoming card (next): y 80 → 0, opacity 0 → 1, scale 0.97 → 1
        gsap.fromTo(
          cards[i + 1],
          { y: 80, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: wrapper,
              start: `${startPct * 100}% top`,
              end: `${endPct * 100}% top`,
              scrub: 0.4,
            },
          },
        );
      }

      // Counter updater — flips active index at each transition midpoint (the
      // slot boundary itself), matching the snap points.
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress;
          let idx = 0;
          for (let i = 0; i < cards.length - 1; i++) {
            if (p >= (i + 1) * slotPct) idx = i + 1;
          }
          setActiveIndex(idx);
        },
      });

      // Snap — land cleanly on each card's settled zone (centers of the 4 slots,
      // plus the very top and bottom). Subtle: only kicks in after the user
      // pauses, never fighting active scrolling.
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        snap: {
          snapTo: [0, 0.25, 0.5, 0.75, 1],
          duration: { min: 0.2, max: 0.4 },
          delay: 0.05,
          ease: 'power2.inOut',
        },
      });
    }, wrapper);

    // Re-measure once layout has settled (fonts, images, other effects)
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="architecture"
      className="arch-wrapper"
      ref={wrapperRef}
      aria-label="What we build"
    >
      <div className="arch-stage" ref={stageRef}>
        <div className="arch-left">
          <div className="arch-left__inner">
            <span className="arch-label">{T(t.studio.architecture)}</span>
            <h2 className="arch-title">
              {T(t.studio.archTitle)}
            </h2>
            <div className="arch-counter" aria-live="polite">
              <span className="arch-counter__current">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="arch-counter__sep"> / </span>
              <span className="arch-counter__total">
                {String(CARDS.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="arch-right">
          <div className="arch-cards">
            {CARDS.map((card, i) => (
              <article
                key={card.label}
                ref={(el) => (cardsRef.current[i] = el)}
                className="arch-card"
                aria-hidden={i !== activeIndex}
              >
                <div className="arch-card__inner">
                  <p className="arch-card__label">{card.label}</p>
                  <h3 className="arch-card__title">{card.title}</h3>
                  <p className="arch-card__desc">{card.desc}</p>
                  <div className="arch-card__tags">
                    {card.tags.map((tag) => (
                      <span key={tag} className="arch-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
