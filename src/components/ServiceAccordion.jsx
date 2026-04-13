import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useI18n, useT } from '../i18n/I18nProvider';
import { t as Trans } from '../i18n/translations';
import '../styles/service-accordion.css';

function TierItem({ index, tier, isOpen, onToggle, labels, onRequest, headerRef }) {
  const T = useT();
  const bodyRef = useRef(null);
  const innerRef = useRef(null);
  const initRef = useRef(true);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    if (initRef.current) {
      gsap.set(el, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
      });
      initRef.current = false;
      return;
    }

    if (isOpen) {
      gsap.set(el, { height: 'auto', opacity: 1 });
      const h = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: h,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => gsap.set(el, { height: 'auto' }),
        },
      );
    } else {
      const h = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: h, opacity: 1 },
        { height: 0, opacity: 0, duration: 0.35, ease: 'power2.in' },
      );
    }
  }, [isOpen]);

  const num = String(index + 1).padStart(2, '0');
  const yesItems = T(tier.yes) || [];
  const noItems = T(tier.no) || [];

  return (
    <div className={`sacc__item${isOpen ? ' sacc__item--open' : ''}`}>
      <button
        type="button"
        className="sacc__header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`sacc-body-${tier.id}`}
        ref={headerRef}
      >
        <span className="sacc__num">{num}</span>
        <h3 className="sacc__title">{T(tier.title)}.</h3>
        <span className="sacc__toggle" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className="sacc__body"
        id={`sacc-body-${tier.id}`}
        ref={bodyRef}
      >
        <div className="sacc__body-inner" ref={innerRef}>
          <div className="sacc__cols">
            <div className="sacc__col sacc__col--yes">
              <p className="sacc__col-title">
                <span className="sacc__col-mark" aria-hidden="true">✓</span>
                {labels.forYou}
              </p>
              <ul className="sacc__col-list">
                {yesItems.map((item, i) => (
                  <li key={i}>
                    <span className="sacc__bullet sacc__bullet--yes" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sacc__col sacc__col--no">
              <p className="sacc__col-title">
                <span className="sacc__col-mark" aria-hidden="true">✗</span>
                {labels.notForYou}
              </p>
              <ul className="sacc__col-list">
                {noItems.map((item, i) => (
                  <li key={i}>
                    <span className="sacc__bullet sacc__bullet--no" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sacc__col sacc__col--when">
              <p className="sacc__col-title">
                <span className="sacc__col-mark" aria-hidden="true">→</span>
                {labels.when}
              </p>
              <p className="sacc__col-text">{T(tier.when)}</p>
            </div>
          </div>
          <button
            type="button"
            className="sacc__cta"
            onClick={onRequest}
          >
            {labels.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServiceAccordion() {
  const T = useT();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState('launch');
  const headerRefs = useRef([]);

  const tiers = [
    { id: 'launch', ...Trans.serviceAccordion.tier01 },
    { id: 'custom', ...Trans.serviceAccordion.tier02 },
    { id: 'premium', ...Trans.serviceAccordion.tier03 },
  ];

  const labels = {
    forYou: T(Trans.serviceAccordion.forYou),
    notForYou: T(Trans.serviceAccordion.notForYou),
    when: T(Trans.serviceAccordion.whenLabel),
    cta: T(Trans.serviceAccordion.cta),
  };

  const requestQuote = (tier) => {
    const name = T(tier.title);
    const brief =
      lang === 'es'
        ? `Hola, me interesa el servicio ${name}. Me gustaría saber más sobre cómo pueden ayudarme.`
        : `Hi, I'm interested in the ${name} service. I'd like to know more about how you can help me.`;
    navigate('/contact', { state: { service: tier.id, brief } });
  };

  const handleToggle = (index, id) => {
    const willOpen = openId !== id;
    setOpenId((prev) => (prev === id ? null : id));

    if (willOpen && window.innerWidth <= 1100) {
      setTimeout(() => {
        const el = headerRefs.current[index];
        if (el) {
          const navbarHeight = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 350);
    }
  };

  return (
    <div className="sacc">
      {tiers.map((tier, i) => (
        <TierItem
          key={tier.id}
          index={i}
          tier={tier}
          isOpen={openId === tier.id}
          onToggle={() => handleToggle(i, tier.id)}
          labels={labels}
          onRequest={() => requestQuote(tier)}
          headerRef={(el) => (headerRefs.current[i] = el)}
        />
      ))}
    </div>
  );
}
