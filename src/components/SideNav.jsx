import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LangToggle from "./LangToggle";
import { useI18n } from "../i18n/I18nProvider";

export default function SideNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const lastFocusRef = useRef(null);

  const LINKS = [
    { id: "hero", labelKey: "nav_intro" },
    { id: "philosophy", labelKey: "nav_philosophy" },
    { id: "architecture", labelKey: "nav_architecture" },
    { id: "metrics", labelKey: "nav_specs" },
    { id: "builds", labelKey: "nav_builds" },
    { id: "extensions", labelKey: "nav_extensions" },
    { id: "contact", labelKey: "nav_request" },
  ];

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    lastFocusRef.current = document.activeElement;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector("button, a");
      first?.focus?.();
    });

    return () => {
      document.documentElement.style.overflow = prevOverflow || "";
      lastFocusRef.current?.focus?.();
    };
  }, [open]);

  const onGo = (id) => (e) => {
    e.preventDefault();
    setOpen(false);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const topbar = (
    <div className="topbar" aria-label="Top controls">
      <LangToggle />
      <button
        className="sidenav__toggle"
        type="button"
        aria-label={t("nav_open_index")}
        aria-haspopup="dialog"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen(true)}
        data-cursor="hover"
      >
        {t("nav_index")}
      </button>
    </div>
  );

  return (
    <>
      {typeof document !== "undefined"
        ? createPortal(topbar, document.body)
        : null}

      <div
        className={`sidenav ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        hidden={!open}
      >
        <div
          className="sidenav__backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        <aside
          className="sidenav__panel"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav_index")}
          ref={panelRef}
        >
          <div className="sidenav__header">
            <p className="sidenav__title">COREXA</p>
            <button
              className="sidenav__close"
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav_close")}
              data-cursor="hover"
            >
              ✕
            </button>
          </div>

          <nav className="sidenav__nav" aria-label={t("nav_sections")}>
            {LINKS.map((l) => (
              <a
                key={l.id}
                className="sidenav__link"
                href={`#${l.id}`}
                onClick={onGo(l.id)}
                data-cursor="hover"
              >
                {t(l.labelKey)}
              </a>
            ))}
          </nav>

          <div className="sidenav__hint">
            <span className="dot" aria-hidden="true" />
            {t("nav_hint_esc")}
          </div>
        </aside>
      </div>
    </>
  );
}
