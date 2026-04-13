import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { useT } from "../i18n/I18nProvider";
import { t } from "../i18n/translations";

const Globe = lazy(() => import("./Globe"));

export default function Hero() {
  const rootRef = useRef(null);
  const T = useT();

  return (
    <section id="hero" className="hero-globe" aria-label="Intro" ref={rootRef}>
      <Suspense fallback={<div style={{width:'100%',height:'100vh',background:'#020202'}} />}>
        <Globe />
      </Suspense>

      {/* Vignette overlay so text is always readable */}
      <div className="hero-globe__vignette" aria-hidden="true" />

      <div className="hero-globe__content">
        <div className="hero-globe__label">
          <span className="hero-globe__label-line" aria-hidden="true" />
          {T(t.hero.tag)}
        </div>

        <h1 className="hero-globe__headline">
          <span className="word-reveal"><span>{T(t.hero.word1)}</span></span>
          <span className="word-reveal"><span>{T(t.hero.word2)}</span></span>
          <span className="word-reveal"><span className="thin">{T(t.hero.word3)}</span></span>
          <span className="word-reveal"><span>{T(t.hero.word4)}</span></span>
        </h1>

        <p className="hero-globe__sub">
          {T(t.hero.sub)}
        </p>

        <div className="hero-globe__actions">
          <Link to="/contact" className="hero-globe__btn-primary" data-cursor="cta">
            {T(t.hero.cta1)}
          </Link>
          <Link to="/services" className="hero-globe__btn-ghost">
            {T(t.hero.cta2)}
          </Link>
        </div>
      </div>

      <div className="hero-globe__scroll-hint">
        <span className="hero-globe__scroll-line" aria-hidden="true" />
        {T(t.hero.scroll)}
      </div>
    </section>
  );
}
