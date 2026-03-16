import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import GridOverlay from "./GridOverlay";
import { useI18n } from "../i18n/I18nProvider";

export default function Hero() {
  const rootRef = useRef(null);
  const scanRef = useRef(null);
  const eyRef = useRef(null);
  const decoRef = useRef(null);
  const l1Ref = useRef(null);
  const l2Ref = useRef(null);
  const subRef = useRef(null);
  const actRef = useRef(null);

  const { t, lang } = useI18n();

  useLayoutEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      if (reduce) return;

      // estado inicial
      gsap.set(
        [
          eyRef.current,
          actRef.current,
          l1Ref.current,
          l2Ref.current,
          subRef.current,
        ],
        { opacity: 0 },
      );
      gsap.set(decoRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(scanRef.current, { opacity: 0, top: "0px" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // scan line barre de arriba a abajo
      tl.to(scanRef.current, { opacity: 1, duration: 0.1 }, 0.1)
        .to(scanRef.current, { top: "100%", duration: 1.4, ease: "none" }, 0.1)
        .to(scanRef.current, { opacity: 0, duration: 0.3 }, 1.2);

      // eyebrow + línea deco
      tl.to(eyRef.current, { opacity: 1, duration: 0.7 }, 0.3).to(
        decoRef.current,
        { scaleY: 1, duration: 1.6 },
        0.25,
      );

      // títulos
      tl.to(l1Ref.current, { opacity: 1, duration: 0.8 }, 0.42).to(
        l2Ref.current,
        { opacity: 1, duration: 0.8 },
        0.6,
      );

      // subtítulo
      tl.to(subRef.current, { opacity: 1, duration: 0.7 }, 0.8);

      // botones
      tl.to(actRef.current, { opacity: 1, duration: 0.6 }, 1.0);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const projectLabel = lang === "es" ? "Solicitar proyecto" : "Start a Project";
  const analyzerLabel =
    lang === "es" ? "Análisis gratuito" : "Free Website Analysis";

  return (
    <section id="hero" className="section hero" aria-label="Intro">
      <GridOverlay variant="default" />

      {/* scan line */}
      <div ref={scanRef} className="hero__scan" aria-hidden="true" />

      {/* línea deco vertical */}
      <div ref={decoRef} className="hero__deco-line" aria-hidden="true" />

      <div className="sectionContent">
        <div className="container hero__inner" ref={rootRef}>
          {/* eyebrow */}
          <div ref={eyRef} className="hero__eyebrow-row">
            <span className="hero__eyebrow-num">001</span>
            <span className="hero__eyebrow-line" aria-hidden="true" />
            <span className="hero__eyebrow-text">{t("hero_eyebrow")}</span>
          </div>

          {/* headline */}
          <h1 className="headline hero__headline">
            <span ref={l1Ref} className="hero__line">
              {t("hero_line1")}
            </span>
            <span ref={l2Ref} className="hero__line hero__line--2">
              {t("hero_line2")}
            </span>
          </h1>

          {/* sub */}
          <p ref={subRef} className="sub hero__sub">
            {t("hero_sub")}
          </p>

          {/* actions */}
          <div ref={actRef} className="hero__actions">
            <a
              href="#contact"
              className="btn btn--primary"
              data-cursor="cta"
              data-hover-intent="cta"
            >
              {projectLabel} <span aria-hidden="true">→</span>
            </a>
            <a href="/analyzer" className="btn btn--ghost">
              {analyzerLabel} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
