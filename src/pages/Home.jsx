import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Hero from '../components/Hero.jsx';
import LazyViewport from '../components/LazyViewport.jsx';

const IndustryDemo = lazy(() => import('../components/IndustryDemo.jsx'));
const DemoCatalog = lazy(() => import('../components/DemoCatalog.jsx'));
import useH2Reveal from '../utils/useH2Reveal.js';
import { useT } from '../i18n/I18nProvider';
import { t } from '../i18n/translations';

export default function Home() {
  useH2Reveal();
  const T = useT();

  return (
    <>
      <Hero />
      
      <LazyViewport height="100vh">
        <Suspense fallback={<div style={{minHeight: '100vh', background: '#020202'}} />}>
          <IndustryDemo />
        </Suspense>
      </LazyViewport>
      
      <LazyViewport height="50vh">
        <Suspense fallback={<div style={{minHeight: '50vh', background: '#020202'}} />}>
          <DemoCatalog />
        </Suspense>
      </LazyViewport>

      <section className="cta-strip" aria-label={T(t.cta.title)}>
        <div className="container cta-strip__inner">
          <h2 className="cta-strip__title" data-no-reveal style={{ clipPath: 'none', WebkitClipPath: 'none' }}>{T(t.cta.title)}</h2>
          <Link to="/contact" className="btn-primary cta-strip__btn">
            {T(t.cta.button)}
          </Link>
        </div>
      </section>
    </>
  );
}
