import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../i18n/I18nProvider";

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

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqedrvvq";

export default function Contact() {
  const rootRef = useRef(null);
  const { t, lang } = useI18n();

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

      const nextType = normalizeService(rawService);

      setValues((v) => ({
        ...v,
        type: nextType || v.type,
        message: rawMsg ? rawMsg : v.message,
      }));
    };

    applyFromUrl();

    window.addEventListener("popstate", applyFromUrl);
    window.addEventListener("hashchange", applyFromUrl);

    return () => {
      window.removeEventListener("popstate", applyFromUrl);
      window.removeEventListener("hashchange", applyFromUrl);
    };
  }, []);

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
      const left = root.querySelector(".contact__left");
      const right = root.querySelector(".contact__right");
      const panel = root.querySelector(".contact__panel");
      const itemLines = gsap.utils.toArray(
        root.querySelectorAll(".next__item"),
      );

      gsap.set([left, right], { opacity: 0, y: 16 });
      gsap.set(panel, { opacity: 0, y: 12, scale: 1.01 });
      gsap.set(itemLines, { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      tl.to([left, right], { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 })
        .to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.85 }, "-=0.45")
        .to(
          itemLines,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          "-=0.55",
        );
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
      const subject =
        values.type && values.type !== "Other"
          ? `COREXA — ${values.type}`
          : "COREXA — New inquiry";

      const payload = {
        name: values.name,
        email: values.email,
        service: values.type,
        message: values.message,
        _subject: subject,
        _language: lang || "en",
        _source: window.location.href,
      };

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
      className="section contact"
      aria-label={t("nav_request")}
    >
      <div className="gridOverlay" aria-hidden="true" />
      <div className="gridVignette" aria-hidden="true" />

      <div className="container contact__inner sectionContent">
        <div className="contact__left contact__left--pad">
          <p className="eyebrow">{t("contact_eyebrow")}</p>

          <h2 className="contact__title">
            {t("contact_title_line1")}
            <br />
            {t("contact_title_line2")}
          </h2>

          <p className="contact__lead">{t("contact_lead")}</p>
        </div>

        <div className="contact__right">
          <div
            className="contact__panel"
            role="region"
            aria-label="Contact form"
          >
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form__row">
                <label className="label" htmlFor="name">
                  {t("form_name")}
                </label>
                <input
                  id="name"
                  name="name"
                  className={`input ${showNameErr ? "is-error" : ""}`}
                  value={values.name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="name"
                  placeholder={t("form_name_ph")}
                  aria-invalid={showNameErr ? "true" : "false"}
                  aria-describedby={showNameErr ? "name-err" : undefined}
                />
                {showNameErr ? (
                  <p className="fielderr" id="name-err">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="form__row">
                <label className="label" htmlFor="email">
                  {t("form_email")}
                </label>
                <input
                  id="email"
                  name="email"
                  className={`input ${showEmailErr ? "is-error" : ""}`}
                  value={values.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="email"
                  placeholder={t("form_email_ph")}
                  aria-invalid={showEmailErr ? "true" : "false"}
                  aria-describedby={showEmailErr ? "email-err" : undefined}
                />
                {showEmailErr ? (
                  <p className="fielderr" id="email-err">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="form__row">
                <label className="label" htmlFor="type">
                  {t("form_project")}
                </label>
                <select
                  id="type"
                  name="type"
                  className="input select"
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

              <div className="form__row">
                <label className="label" htmlFor="message">
                  {t("form_brief")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={`input textarea ${showMsgErr ? "is-error" : ""}`}
                  value={values.message}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={t("form_brief_ph")}
                  aria-invalid={showMsgErr ? "true" : "false"}
                  aria-describedby={showMsgErr ? "msg-err" : undefined}
                />
                {showMsgErr ? (
                  <p className="fielderr" id="msg-err">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <div className="form__actions">
                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={status.kind === "loading"}
                  data-magnetic
                  data-cursor="cta"
                  data-hover-intent="cta"
                >
                  {status.kind === "loading"
                    ? t("form_sending")
                    : t("form_send")}
                </button>

                <div
                  className={`form__status is-${status.kind}`}
                  aria-live="polite"
                >
                  {status.msg}
                </div>
              </div>
            </form>
          </div>

          <aside className="next" aria-label={t("next_title")}>
            <p className="next__label">{t("next_title")}</p>
            <ul className="next__list">
              <li className="next__item">{t("next_1")}</li>
              <li className="next__item">{t("next_2")}</li>
              <li className="next__item">{t("next_3")}</li>
              <li className="next__item">{t("next_4")}</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
