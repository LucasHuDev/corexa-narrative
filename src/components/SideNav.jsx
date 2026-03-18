import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import LangToggle from "./LangToggle";
import { useI18n } from "../i18n/I18nProvider";

const WA_MSG_ES =
  "Hola! Vi tu sitio web y me gustaría consultar sobre sus servicios.";
const WA_MSG_EN =
  "Hi! I saw your website and I'd like to ask about your services.";

const WA_NUMBERS = [
  { label: "🇮🇪 Irlanda", number: "353834101709" },
  { label: "🇦🇷 Argentina", number: "542995706675" },
];

const IG_URL = "https://www.instagram.com/corexa.studio/";

const IconWA = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconIG = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export default function SideNav() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const panelRef = useRef(null);
  const lastFocusRef = useRef(null);
  const waRef = useRef(null);

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
    if (!waOpen) return;
    const handler = (e) => {
      if (waRef.current && !waRef.current.contains(e.target)) {
        setWaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [waOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setWaOpen(false);
      }
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

  useEffect(() => {
    setWaOpen(false);
  }, [lang]);

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

  const getWaMessage = () => {
    return String(lang).startsWith("es") ? WA_MSG_ES : WA_MSG_EN;
  };

  const openWA = (number) => {
    const msg = getWaMessage();
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setWaOpen(false);
  };

  const topbar = (
    <div className="topbar" aria-label="Top controls">
      <div className="social-btns">
        <div className="wa-wrap" ref={waRef}>
          <button
            className="icon-btn"
            type="button"
            aria-label="WhatsApp"
            aria-expanded={waOpen}
            onClick={() => setWaOpen((v) => !v)}
            data-cursor="hover"
          >
            <IconWA />
          </button>

          {waOpen && (
            <div className="wa-dropdown" role="menu">
              {WA_NUMBERS.map((n) => (
                <button
                  key={n.number}
                  className="wa-dropdown__item"
                  type="button"
                  role="menuitem"
                  onClick={() => openWA(n.number)}
                >
                  {n.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="icon-btn"
          type="button"
          aria-label="Instagram"
          onClick={() => window.open(IG_URL, "_blank", "noopener,noreferrer")}
          data-cursor="hover"
        >
          <IconIG />
        </button>
      </div>

      <div className="topbar__right">
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
