import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GridOverlay from "./GridOverlay";
import { useI18n, useT } from "../i18n/I18nProvider";
import { t as Trans } from "../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const rootRef = useRef(null);
  const { t } = useI18n();
  const T = useT();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const q = gsap.utils.selector(root);
    const copy = q("[data-ph-copy]");
    const items = q("[data-ph-item]");
    const scan = q("[data-ph-scan]");

    // Title reveal is handled globally by useH2Reveal.
    gsap.set(copy, { opacity: 0, y: 14 });
    gsap.set(items, { opacity: 0, y: 14 });
    gsap.set(scan, { clipPath: "inset(0 100% 0 0)" });

    if (reduce) {
      gsap.set([copy, items], { opacity: 1, y: 0 });
      gsap.set(scan, { clipPath: "inset(0 0% 0 0)" });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(copy, { opacity: 1, y: 0, duration: 0.75 }, 0.08);
      tl.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.16);
      tl.to(
        scan,
        { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power2.out" },
        0.22,
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={rootRef}
      className="section philosophy"
      aria-label={t("philo_aria")}
    >
      <GridOverlay variant="philosophy" />

      <span className="section-label" aria-hidden="true">{T(Trans.studio.philosophy)}</span>

      <div className="container philo">
        <div className="philo__left">
          <p className="eyebrow">{t("philo_eyebrow")}</p>

          <h2 className="philo__title" data-ph-title>
            {t("philo_title")}
          </h2>

          <p className="philo__copy" data-ph-copy>
            {t("philo_copy")}
          </p>

          <p className="philo__tag">{t("philo_tag")}</p>
        </div>

        <div className="philo__right" aria-label={t("philo_principles_aria")}>
          <div className="philo__scan" aria-hidden="true" data-ph-scan />

          <ol className="philo__list">
            <li className="philo__item" data-ph-item>
              <span className="philo__n">01</span>
              <span className="philo__k">{t("philo_01_k")}</span>
              <span className="philo__v">{t("philo_01_v")}</span>
            </li>

            <li className="philo__item" data-ph-item>
              <span className="philo__n">02</span>
              <span className="philo__k">{t("philo_02_k")}</span>
              <span className="philo__v">{t("philo_02_v")}</span>
            </li>

            <li className="philo__item" data-ph-item>
              <span className="philo__n">03</span>
              <span className="philo__k">{t("philo_03_k")}</span>
              <span className="philo__v">{t("philo_03_v")}</span>
            </li>

            <li className="philo__item" data-ph-item>
              <span className="philo__n">04</span>
              <span className="philo__k">{t("philo_04_k")}</span>
              <span className="philo__v">{t("philo_04_v")}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
