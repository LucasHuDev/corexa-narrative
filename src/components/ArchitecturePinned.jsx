import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../i18n/I18nProvider";

gsap.registerPlugin(ScrollTrigger);

export default function ArchitecturePinned() {
  const rootRef = useRef(null);
  const wordOutRef = useRef(null);
  const wordInRef = useRef(null);
  const descRef = useRef(null);

  const { t } = useI18n();

  // Slides traducidos
  const slides = useMemo(
    () => [
      { word: t("arch_word_brand"), desc: t("arch_desc_brand") },
      { word: t("arch_word_ux"), desc: t("arch_desc_ux") },
      { word: t("arch_word_frontend"), desc: t("arch_desc_frontend") },
      { word: t("arch_word_motion"), desc: t("arch_desc_motion") },
      { word: t("arch_word_optimization"), desc: t("arch_desc_optimization") },
    ],
    [t],
  );

  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const wordOut = wordOutRef.current;
    const wordIn = wordInRef.current;
    const desc = descRef.current;
    if (!wordOut || !wordIn || !desc) return;

    const setNoSnap = (v) => {
      document.documentElement.classList.toggle("no-snap", !!v);
    };

    ScrollTrigger.clearScrollMemory?.();

    const ctx = gsap.context(() => {
      const state = { i: 0, tl: null, isAnimating: false };
      const total = slides.length;
      const step = 1 / Math.max(1, total - 1);

      gsap.set(wordOut, { yPercent: 0, opacity: 1 });
      gsap.set(wordIn, { yPercent: 110, opacity: 0 });
      gsap.set(desc, { opacity: 0.85 });

      const applyImmediate = (i) => {
        wordOut.textContent = slides[i].word;
        wordIn.textContent = slides[i].word;
        desc.textContent = slides[i].desc;

        gsap.set(wordOut, { yPercent: 0, opacity: 1 });
        gsap.set(wordIn, { yPercent: 110, opacity: 0 });
        gsap.set(desc, { opacity: 0.85 });

        state.i = i;
        setIndex(i);
      };

      const animateTo = (i) => {
        if (i === state.i) return;

        state.isAnimating = true;
        state.tl?.kill?.();
        gsap.killTweensOf([wordOut, wordIn, desc]);

        wordIn.textContent = slides[i].word;

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", overwrite: "auto" },
          onStart: () => {
            state.i = i;
            setIndex(i);
          },
          onComplete: () => {
            wordOut.textContent = slides[i].word;
            gsap.set(wordOut, { yPercent: 0, opacity: 1 });
            gsap.set(wordIn, { yPercent: 110, opacity: 0 });
            state.isAnimating = false;
          },
        });

        tl.to(wordOut, { yPercent: -110, opacity: 0, duration: 0.5 }, 0);
        tl.to(wordIn, { yPercent: 0, opacity: 1, duration: 0.62 }, 0.02);

        tl.to(desc, { opacity: 0, duration: 0.18 }, 0).add(() => {
          desc.textContent = slides[i].desc;
        }, 0.2);
        tl.to(desc, { opacity: 0.85, duration: 0.42 }, 0.2);

        state.tl = tl;
      };

      applyImmediate(0);

      const STEP_FACTOR = 0.78;
      const HYST = 0.18;
      const SCRUB = 0.18;

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () =>
          `+=${Math.max(1, total - 1) * window.innerHeight * STEP_FACTOR}`,
        pin: true,
        scrub: SCRUB,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,

        onToggle: (self) => setNoSnap(self.isActive),

        onEnter: (self) => {
          const i = Math.round(self.progress * (total - 1));
          applyImmediate(Math.min(total - 1, Math.max(0, i)));
        },
        onRefresh: (self) => {
          const i = Math.round(self.progress * (total - 1));
          applyImmediate(Math.min(total - 1, Math.max(0, i)));
        },

        onUpdate: (self) => {
          if (state.isAnimating) return;

          const p = self.progress;
          const currentP = state.i * step;

          const v = self.getVelocity();
          const dir = v === 0 ? 0 : v > 0 ? 1 : -1;

          const forwardThreshold = currentP + step * (0.5 + HYST);
          const backThreshold = currentP - step * (0.5 + HYST);

          let next = state.i;

          if (dir >= 0 && state.i < total - 1 && p >= forwardThreshold) {
            next = state.i + 1;
          } else if (dir <= 0 && state.i > 0 && p <= backThreshold) {
            next = state.i - 1;
          }

          if (next !== state.i) animateTo(next);
        },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("resize", onResize);
        st.kill();
      };
    }, root);

    return () => {
      setNoSnap(false);
      ctx.revert();
    };
  }, [slides]);

  return (
    <section
      id="architecture"
      className="section architecture"
      ref={rootRef}
      aria-label={t("arch_aria")}
    >
      <div className="gridOverlay" aria-hidden="true" />
      <div className="gridVignette" aria-hidden="true" />

      <div className="container arch">
        <div className="arch__left" aria-hidden="true">
          <div className="arch__wordStack">
            <div className="arch__word arch__word--out" ref={wordOutRef}>
              {slides[index].word}
            </div>
            <div className="arch__word arch__word--in" ref={wordInRef}>
              {slides[index].word}
            </div>
          </div>
        </div>

        <div className="arch__right">
          <p className="arch__kicker">{t("arch_kicker")}</p>
          <p className="arch__desc" ref={descRef}>
            {slides[index].desc}
          </p>

          <div className="arch__rail" aria-hidden="true">
            {slides.map((s, i) => (
              <div
                key={`${s.word}-${i}`}
                className={`arch__tick ${i === index ? "is-active" : ""}`}
              />
            ))}
          </div>

          <p className="arch__hint" aria-hidden="true">
            {t("arch_hint")}
          </p>
        </div>
      </div>
    </section>
  );
}
