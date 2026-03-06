import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import GridOverlay from "./GridOverlay";
import { useI18n } from "../i18n/I18nProvider";

export default function Hero() {
  const rootRef = useRef(null);
  const { t, lang } = useI18n();

  useLayoutEffect(() => {
    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduce) return;
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 20, scale: 1.01 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const projectLabel = lang === "es" ? "Solicitar proyecto" : "Start a Project";
  const analyzerLabel =
    lang === "es" ? "Análisis gratuito" : "Free Website Analysis";

  return (
    <section id="hero" className="section hero" aria-label="Intro">
      <GridOverlay variant="default" />
      <div className="sectionContent">
        <div className="container hero__inner" ref={rootRef}>
          <p className="eyebrow">{t("hero_eyebrow")}</p>

          <h1 className="headline">
            {t("hero_line1")}
            <br />
            {t("hero_line2")}
          </h1>

          <p className="sub">{t("hero_sub")}</p>

          <div className="hero__actions">
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
