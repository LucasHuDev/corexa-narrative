import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useI18n, useT } from '../i18n/I18nProvider';
import { t as Trans } from '../i18n/translations';
import '../styles/extension-accordion.css';

function ExtItem({ ext, isOpen, onToggle, labels, onRequest, headerRef }) {
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

  const yesItems = T(ext.yes) || [];
  const noItems = T(ext.no) || [];

  return (
    <div className={`xacc__item${isOpen ? ' xacc__item--open' : ''}`}>
      <button
        type="button"
        className="xacc__header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`xacc-body-${ext.id}`}
        ref={headerRef}
      >
        <span className="xacc__num">{T(ext.label)}</span>
        <h3 className="xacc__title">{T(ext.title)}.</h3>
        <span className="xacc__toggle" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        className="xacc__body"
        id={`xacc-body-${ext.id}`}
        ref={bodyRef}
      >
        <div className="xacc__body-inner" ref={innerRef}>
          <div className="xacc__cols">
            <div className="xacc__col xacc__col--yes">
              <p className="xacc__col-title">
                <span className="xacc__col-mark" aria-hidden="true">✓</span>
                {labels.forYou}
              </p>
              <ul className="xacc__col-list">
                {yesItems.map((item, i) => (
                  <li key={i}>
                    <span className="xacc__bullet xacc__bullet--yes" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="xacc__col xacc__col--no">
              <p className="xacc__col-title">
                <span className="xacc__col-mark" aria-hidden="true">✗</span>
                {labels.notForYou}
              </p>
              <ul className="xacc__col-list">
                {noItems.map((item, i) => (
                  <li key={i}>
                    <span className="xacc__bullet xacc__bullet--no" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="xacc__col xacc__col--when">
              <p className="xacc__col-title">
                <span className="xacc__col-mark" aria-hidden="true">→</span>
                {labels.when}
              </p>
              <p className="xacc__col-text">{T(ext.when)}</p>
            </div>
          </div>
          <button
            type="button"
            className="xacc__cta"
            onClick={onRequest}
          >
            {labels.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExtensionAccordion() {
  const T = useT();
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState('audit');
  const headerRefs = useRef([]);

  const exts = [
    { id: 'audit', ...Trans.extensionAccordion.ext01 },
    { id: 'maintenance', ...Trans.extensionAccordion.ext02 },
    { id: 'tools', ...Trans.extensionAccordion.ext03 },
  ];

  const labels = {
    forYou: T(Trans.extensionAccordion.forYou),
    notForYou: T(Trans.extensionAccordion.notForYou),
    when: T(Trans.extensionAccordion.whenLabel),
    cta: T(Trans.extensionAccordion.cta),
  };

  const requestQuote = (ext) => {
    const name = T(ext.title);
    const brief =
      lang === 'es'
        ? `Hola, me interesa el servicio ${name}. Me gustaría saber más sobre cómo pueden ayudarme.`
        : `Hi, I'm interested in the ${name} service. I'd like to know more about how you can help me.`;
    navigate('/contact', { state: { service: ext.id, brief } });
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
    <div className="xacc">
      {exts.map((ext, i) => (
        <ExtItem
          key={ext.id}
          ext={ext}
          isOpen={openId === ext.id}
          onToggle={() => handleToggle(i, ext.id)}
          labels={labels}
          onRequest={() => requestQuote(ext)}
          headerRef={(el) => (headerRefs.current[i] = el)}
        />
      ))}
    </div>
  );
}
