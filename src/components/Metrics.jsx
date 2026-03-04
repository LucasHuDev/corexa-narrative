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

    const items = root.querySelectorAll("[data-metric]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            once: true,
          },
        },
      );
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

      <div className="container metrics__inner">
        <p className="eyebrow">{t("metrics_eyebrow")}</p>
        <h2 className="title">{t("metrics_title")}</h2>

        <div className="metrics__list" role="list">
          {METRICS.map((m, i) => (
            <div className="metrics__row" role="listitem" data-metric key={i}>
              <div className="metrics__left">{m.label}</div>
              <div className="metrics__right">{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
