import { useEffect, useRef, useState } from "react";
import "./PageLoader.css";

const SESSION_KEY = "corexa:loader:seen";
const WORDS = [
  { text: "COREXA", tone: "primary" },
  { text: "STUDIO", tone: "muted" },
];
const LETTER_STAGGER = 60;
const WORD_GAP = 120;
const LETTER_BASE_DELAY = 180;
const COUNT_DURATION = 2100;
const HOLD_AFTER_COUNT = 450;
const EXIT_DURATION = 1100;

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PageLoader() {
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return false;
    if (prefersReducedMotion()) return false;
    if (window.sessionStorage.getItem(SESSION_KEY)) return false;
    return window.location.pathname === "/";
  });
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const prevOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION);
      const eased = 1 - Math.pow(1 - t, 4);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, COUNT_DURATION + HOLD_AFTER_COUNT);

    const unmountTimer = setTimeout(() => {
      setActive(false);
      window.sessionStorage.setItem(SESSION_KEY, "1");
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    }, COUNT_DURATION + HOLD_AFTER_COUNT + EXIT_DURATION);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [active]);

  if (!active) return null;

  const pct = String(progress).padStart(3, "0");

  return (
    <div
      className={`page-loader ${exiting ? "is-exiting" : ""}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="page-loader__band page-loader__band--top" />
      <div className="page-loader__band page-loader__band--bottom" />

      <div className="page-loader__content">
        <span className="page-loader__tick page-loader__tick--tl" />
        <span className="page-loader__tick page-loader__tick--tr" />
        <span className="page-loader__tick page-loader__tick--bl" />
        <span className="page-loader__tick page-loader__tick--br" />

        <header className="page-loader__meta page-loader__meta--top">
          <span className="page-loader__meta-item">
            <i className="page-loader__dot" />
            COREXA · STUDIO
          </span>
          <span className="page-loader__meta-item page-loader__meta-item--mid">
            EST. MMXXVI
          </span>
          <span className="page-loader__meta-item">V.01 — DUBLIN</span>
        </header>

        <div className="page-loader__lockup">
          <h1 className="page-loader__wordmark" aria-label="COREXA STUDIO">
            {WORDS.map((word, wi) => {
              const priorLetters = WORDS.slice(0, wi).reduce(
                (sum, w) => sum + w.text.length,
                0
              );
              const wordBase =
                LETTER_BASE_DELAY +
                priorLetters * LETTER_STAGGER +
                wi * WORD_GAP;
              return (
                <span
                  key={wi}
                  className={`page-loader__word page-loader__word--${word.tone}`}
                >
                  {word.text.split("").map((l, i) => (
                    <span key={i} className="page-loader__letter-wrap">
                      <span
                        className="page-loader__letter"
                        style={{
                          animationDelay: `${wordBase + i * LETTER_STAGGER}ms`,
                        }}
                      >
                        {l}
                      </span>
                    </span>
                  ))}
                </span>
              );
            })}
          </h1>
          <div className="page-loader__sub">
            <span className="page-loader__rule" />
            <span className="page-loader__sub-text">
              DIGITAL SYSTEMS · NARRATIVE WEB
            </span>
            <span className="page-loader__rule" />
          </div>
        </div>

        <footer className="page-loader__meta page-loader__meta--bottom">
          <span className="page-loader__count">— {pct}</span>
          <div className="page-loader__bar" aria-hidden="true">
            <span
              className="page-loader__bar-fill"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <span className="page-loader__status">
            {progress < 100 ? "INITIALIZING" : "READY"}
          </span>
        </footer>
      </div>
    </div>
  );
}
