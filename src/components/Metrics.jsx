import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GridOverlay from "./GridOverlay";
import { useI18n } from "../i18n/I18nProvider";

gsap.registerPlugin(ScrollTrigger);

export default function Metrics() {
  const rootRef = useRef(null);
  const { t } = useI18n();

  // Metricas
  const METRICS = useMemo(
    () => [
      { label: t("metrics_01_label"), value: t("metrics_01_value") },
      { label: t("metrics_02_label"), value: t("metrics_02_value") },
      { label: t("metrics_03_label"), value: t("metrics_03_value") },
      { label: t("metrics_04_label"), value: t("metrics_04_value") },
      { label: t("metrics_05_label"), value: t("metrics_05_value") },
      { label: t("metrics_06_label"), value: t("metrics_06_value") },
    ],
    [t],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Title reveal is handled globally by useH2Reveal.
      const eyebrow = root.querySelector(".metrics__eyebrow");
      const rows = root.querySelectorAll(".metrics__row");

      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 75%", once: true },
          },
        );
      }

      if (rows.length) {
        gsap.fromTo(
          rows,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: root, start: "top 65%", once: true },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="metrics"
      ref={rootRef}
      className="section metrics"
      aria-label={t("metrics_aria")}
    >
      <GridOverlay variant="default" />
      <span className="section-label" aria-hidden="true">04 — Specs</span>

      <div className="container metrics__inner">
        <header className="metrics__head">
          <p className="metrics__eyebrow">{t("metrics_eyebrow")}</p>
          <h2 className="metrics__title" data-metric>
            {t("metrics_title")}
          </h2>
        </header>

        <div className="metrics__list" role="list">
          {METRICS.map((m, i) => (
            <div className="metrics__row" role="listitem" data-metric key={i}>
              <span className="metrics__idx">{String(i + 1).padStart(2, "0")}</span>
              <div className="metrics__body">
                <div className="metrics__value">{m.value}</div>
                <div className="metrics__label">{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
