import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n, useT } from "../i18n/I18nProvider";
import { t as Trans } from "../i18n/translations";
import "../styles/philosophy.css";

gsap.registerPlugin(ScrollTrigger);

function renderTitleLines(str) {
  const lines = String(str).split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

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

    gsap.set(copy, { opacity: 0, y: 14 });
    gsap.set(items, { opacity: 0, y: 14 });

    if (reduce) {
      gsap.set([copy, items], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
      tl.to(copy, { opacity: 1, y: 0, duration: 0.75 }, 0.08);
      tl.to(items, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.18);
    }, root);

    return () => ctx.revert();
  }, []);

  const S = Trans.studio.philosophySection;
  const items = [
    S.block2.items.i1,
    S.block2.items.i2,
    S.block2.items.i3,
    S.block2.items.i4,
  ];

  return (
    <section
      id="philosophy"
      ref={rootRef}
      className="philo-v2"
      aria-label={t("philo_aria")}
    >
      <div className="container philo-v2__inner">
        <div className="philo-v2__block1">
          <p className="philo-v2__eyebrow">{T(S.block1.label)}</p>

          <h2 className="philo-v2__title">
            {renderTitleLines(T(S.block1.title))}
          </h2>

          <p className="philo-v2__copy" data-ph-copy>
            {T(S.block1.copy)}
          </p>
        </div>

        <div className="philo-v2__block2">
          <p className="philo-v2__eyebrow">{T(S.block2.label)}</p>

          <ul className="philo-v2__grid">
            {items.map((it) => (
              <li className="philo-v2__item" data-ph-item key={it.num}>
                <span className="philo-v2__num">{it.num}</span>
                <div className="philo-v2__body">
                  <h3 className="philo-v2__name">{T(it.name)}</h3>
                  <p className="philo-v2__desc">{T(it.desc)}</p>
                  <p className="philo-v2__tags">{T(it.tags)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
