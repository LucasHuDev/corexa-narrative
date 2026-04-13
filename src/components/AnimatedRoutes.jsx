import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Home from '../pages/Home.jsx';
import Services from '../pages/Services.jsx';
import Studio from '../pages/Studio.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import AnalyzerPage from '../pages/AnalyzerPage.jsx';
import Analyze from '../pages/Analyze.jsx';
import BarberDemo from '../pages/demos/BarberDemo.jsx';
import CafeDemo from '../pages/demos/CafeDemo.jsx';
import ArchDemo from '../pages/demos/ArchDemo.jsx';
import Privacy from '../pages/Privacy.jsx';
import Terms from '../pages/Terms.jsx';

/**
 * GSAP-driven page transitions.
 *
 * Strategy:
 *   - We keep a local `displayLocation` that only updates AFTER the exit
 *     animation completes. This lets <Routes location={displayLocation}>
 *     render the *previous* page while we animate it out.
 *   - Exit: current content opacity 1 → 0, y 0 → -20 (0.3s, power2.in)
 *   - Scroll resets to 0 while the page is invisible.
 *   - Enter: new content opacity 0 → 1, y 20 → 0 (0.5s, power2.out)
 *   - `clearProps` strips the wrapper transform on complete so children
 *     that rely on `position: sticky` (ArchitecturePinned) work correctly —
 *     a transformed ancestor creates a new containing block and breaks sticky.
 *   - ScrollTrigger.refresh() after the enter tween ensures every page's
 *     internal scroll-scrubbed animations remeasure against the final DOM.
 */
export default function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('enter');
  const elRef = useRef(null);

  // Detect incoming route change → begin exit.
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('exit');
    }
  }, [location, displayLocation]);

  // Run the actual tween whenever stage flips.
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (stage === 'exit') {
      if (reduce) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setDisplayLocation(location);
        setStage('enter');
        return;
      }
      gsap.to(el, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          setDisplayLocation(location);
          setStage('enter');
        },
      });
      return;
    }

    // stage === 'enter'
    if (reduce) {
      gsap.set(el, { clearProps: 'transform,opacity' });
      ScrollTrigger.refresh();
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        onComplete: () => {
          // Remeasure every scroll-driven animation on the newly mounted page.
          ScrollTrigger.refresh();
        },
      },
    );
  }, [stage, location]);

  return (
    <div ref={elRef} className="route-stage">
      <Routes location={displayLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/analyzer" element={<AnalyzerPage />} />
        <Route path="/demos/barbershop" element={<BarberDemo />} />
        <Route path="/demos/cafe" element={<CafeDemo />} />
        <Route path="/demos/arch" element={<ArchDemo />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
