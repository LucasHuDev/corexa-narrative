import { useEffect, useMemo, useState } from "react";

const DEFAULT_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "philosophy", label: "Philosophy" },
  { id: "architecture", label: "Architecture" },
  { id: "metrics", label: "Metrics" },
  { id: "builds", label: "Builds" },
  { id: "extensions", label: "Extensions" },
  { id: "contact", label: "Contact" },
];

export default function ProgressRail({ sections = DEFAULT_SECTIONS }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    if (!ids.includes(active)) setActive(ids[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const candidates = entries
            .filter((e) => e.isIntersecting && e.target?.id)
            .sort(
              (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
            );

          const top = candidates[0];
          if (top?.target?.id) setActive(top.target.id);
        });
      },
      {
        root: null,
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.2, 0.35, 0.5, 0.65, 0.8],
      },
    );

    els.forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ids]);

  const onJump = (id) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav className="rail" aria-label="Page sections">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`rail__dot ${active === s.id ? "is-active" : ""}`}
          onClick={() => onJump(s.id)}
          aria-label={`Go to ${s.label}`}
          aria-current={active === s.id ? "true" : undefined}
          data-cursor="hover"
        />
      ))}
    </nav>
  );
}
