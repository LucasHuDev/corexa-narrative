import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n, useT } from "../i18n/I18nProvider";
import { t as Trans } from "../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
}

const SERVICE_OPTIONS = [
  "Launch (WordPress)",
  "Custom Frontend",
  "Premium System (React + GSAP)",
  "Audit & Restructure",
  "Maintenance",
  "Tools & Automation",
  "Other",
];

const SERVICE_BY_ID = {
  launch: "Launch (WordPress)",
  custom: "Custom Frontend",
  premium: "Premium System (React + GSAP)",
  audit: "Audit & Restructure",
  maintenance: "Maintenance",
  tools: "Tools & Automation",
};

function normalizeService(raw) {
  if (!raw) return "";
  const s = String(raw).trim().toLowerCase();

  const byExact = SERVICE_OPTIONS.find((o) => o.toLowerCase() === s);
  if (byExact) return byExact;

  if (s.includes("launch") || s.includes("wordpress"))
    return "Launch (WordPress)";
  if (s.includes("custom") || s.includes("frontend") || s.includes("html"))
    return "Custom Frontend";
  if (
    s.includes("premium") ||
    s.includes("react") ||
    s.includes("gsap") ||
    s.includes("system")
  )
    return "Premium System (React + GSAP)";
  if (s.includes("audit") || s.includes("restructure") || s.includes("ux"))
    return "Audit & Restructure";
  if (s.includes("maint")) return "Maintenance";
  if (
    s.includes("api") ||
    s.includes("automation") ||
    s.includes("tools") ||
    s.includes("dashboard")
  )
    return "Tools & Automation";

  return "Other";
}

export default function Contact() {
  const rootRef = useRef(null);
  const { t, lang } = useI18n();
  const T = useT();
  const location = useLocation();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    type: "Launch (WordPress)",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [status, setStatus] = useState({ kind: "idle", msg: "" });

  useEffect(() => {
    const applyFromUrl = () => {
      const sp = new URLSearchParams(window.location.search);
      const rawService = sp.get("service") || sp.get("type") || "";
      const rawMsg = sp.get("msg") || "";

      const stored = sessionStorage.getItem("corexa_audit_request");
      const parsedStored = stored ? JSON.parse(stored) : null;

      const nextType = normalizeService(
        rawService || parsedStored?.service || "",
      );
      const nextMsg = rawMsg || parsedStored?.msg || "";

      setValues((v) => ({
        ...v,
        type: nextType || v.type,
        message: nextMsg ? nextMsg : v.message,
      }));

      if (stored) {
        sessionStorage.removeItem("corexa_audit_request");
        setTimeout(() => {
          const el = document.getElementById("contact");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    };

    applyFromUrl();

    window.addEventListener("popstate", applyFromUrl);
    window.addEventListener("hashchange", applyFromUrl);

    return () => {
      window.removeEventListener("popstate", applyFromUrl);
      window.removeEventListener("hashchange", applyFromUrl);
    };
  }, []);

  useEffect(() => {
    const state = location.state;
    if (!state) return;
    const { service, brief } = state;
    if (!service && !brief) return;

    setValues((v) => ({
      ...v,
      type: service && SERVICE_BY_ID[service] ? SERVICE_BY_ID[service] : v.type,
      message: brief ? brief : v.message,
    }));

    navigate(location.pathname, { replace: true, state: null });

    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, [location.state, location.pathname, navigate]);

  const errors = useMemo(() => {
    const e = {};
    if (!values.name.trim()) e.name = t("form_error_name") || "Name required.";
    if (!values.email.trim())
      e.email = t("form_error_email") || "Email required.";
    else if (!isEmail(values.email))
      e.email = t("form_error_email_valid") || "Email not valid.";
    if (!values.message.trim())
      e.message = t("form_error_message") || "Message required.";
    return e;
  }, [values, t]);

  const hasErrors = Object.keys(errors).length > 0;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Title reveal is handled globally by useH2Reveal (clip-path wipe).
      const sub = root.querySelector(".contact-v2__sub");
      const details = gsap.utils.toArray(
        root.querySelectorAll(".contact-v2__detail"),
      );
      const fields = gsap.utils.toArray(root.querySelectorAll(".field"));
      const submit = root.querySelector(".contact-v2__submit");

      gsap.set([sub, ...details, ...fields, submit].filter(Boolean), {
        opacity: 0,
        y: 16,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      tl.to(sub, { opacity: 1, y: 0, duration: 0.7 }, 0.25)
        .to(
          details,
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 },
          0.35,
        )
        .to(
          fields,
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
          0.4,
        )
        .to(submit, { opacity: 1, y: 0, duration: 0.6 }, 0.75);
    }, root);

    return () => ctx.revert();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setStatus({ kind: "idle", msg: "" });
  }

  function onBlur(e) {
    const { name } = e.target;
    if (name in touched) setTouched((tt) => ({ ...tt, [name]: true }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (hasErrors) {
      setStatus({ kind: "error", msg: t("form_error_fields") });
      return;
    }

    setStatus({ kind: "loading", msg: t("form_sending") });

    try {
      const res = await fetch("https://formspree.io/f/xqedrvvq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          type: values.type,
          message: values.message,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Send failed");

      setStatus({ kind: "ok", msg: t("form_ok") });

      setValues({
        name: "",
        email: "",
        type: "Launch (WordPress)",
        message: "",
      });

      setTouched({ name: false, email: false, message: false });
    } catch {
      setStatus({ kind: "error", msg: t("form_error_send") });
    }
  }

  const showNameErr = touched.name && errors.name;
  const showEmailErr = touched.email && errors.email;
  const showMsgErr = touched.message && errors.message;

  return (
    <section
      id="contact"
      ref={rootRef}
      className="contact-v2"
      aria-label={t("nav_request")}
    >
      <span className="section-label" aria-hidden="true">{T(Trans.contact.sectionLabel)}</span>

      <div className="container contact-v2__inner">
        {/* ── Left column: headline + subtext + details ── */}
        <div className="contact-v2__left">
          <h2 className="contact-v2__title">
            {T(Trans.contact.title)}
          </h2>

          <p className="contact-v2__sub">{T(Trans.contact.subtitle)}</p>

          <ul className="contact-v2__details" aria-label="Contact details">
            <li className="contact-v2__detail">
              <span className="contact-v2__detail-label">{T(Trans.contact.basedIn)}</span>
              <span className="contact-v2__detail-value">{T(Trans.contact.location)}</span>
            </li>
            <li className="contact-v2__detail">
              <span className="contact-v2__detail-label">{T(Trans.contact.emailLabel)}</span>
              <a
                className="contact-v2__detail-value contact-v2__detail-link"
                href="mailto:corexastudio@gmail.com"
              >
                corexastudio@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* ── Right column: form ── */}
        <div className="contact-v2__right">
          <form
            className="contact-v2__form"
            onSubmit={onSubmit}
            noValidate
            aria-label="Contact form"
          >
            <div className="field">
              <label className="field__label" htmlFor="type">
                {T(Trans.contact.projectType)}
              </label>
              <select
                id="type"
                name="type"
                className="field__input field__input--select"
                value={values.type}
                onChange={onChange}
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="name">
                {T(Trans.contact.nameLabel)}
              </label>
              <input
                id="name"
                name="name"
                className={`field__input ${showNameErr ? "is-error" : ""}`}
                value={values.name}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete="name"
                placeholder={T(Trans.contact.namePlaceholder)}
                aria-invalid={showNameErr ? "true" : "false"}
                aria-describedby={showNameErr ? "name-err" : undefined}
              />
              {showNameErr ? (
                <p className="field__err" id="name-err">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="email">
                {T(Trans.contact.emailLabel).toUpperCase()}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`field__input ${showEmailErr ? "is-error" : ""}`}
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete="email"
                placeholder={T(Trans.contact.emailPlaceholder)}
                aria-invalid={showEmailErr ? "true" : "false"}
                aria-describedby={showEmailErr ? "email-err" : undefined}
              />
              {showEmailErr ? (
                <p className="field__err" id="email-err">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="message">
                {T(Trans.contact.briefLabel)}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className={`field__input field__input--area ${showMsgErr ? "is-error" : ""}`}
                value={values.message}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={T(Trans.contact.briefPlaceholder)}
                aria-invalid={showMsgErr ? "true" : "false"}
                aria-describedby={showMsgErr ? "msg-err" : undefined}
              />
              {showMsgErr ? (
                <p className="field__err" id="msg-err">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <button
              className="btn-primary contact-v2__submit"
              type="submit"
              disabled={status.kind === "loading"}
              data-magnetic
              data-cursor="cta"
            >
              {status.kind === "loading" ? T(Trans.contact.sending) : T(Trans.contact.send)}
            </button>

            <div
              className={`contact-v2__status is-${status.kind}`}
              aria-live="polite"
            >
              {status.msg}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
