import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../i18n/I18nProvider";

gsap.registerPlugin(ScrollTrigger);

function buildContactHref(service, msg) {
  const s = encodeURIComponent(service);
  const m = encodeURIComponent(msg);
  // ✅ correcto: query en search + hash para scroll a #contact
  return `/?service=${s}&msg=${m}#contact`;
}

export default function Extensions() {
  const rootRef = useRef(null);
  const { t, lang } = useI18n();

  // ✅ Mensajes prefill por idioma (no van en translations porque son multi-línea “form templates”)
  const MSG = useMemo(() => {
    const en = {
      audit:
        "I want an Audit & Restructure.\n\nCurrent site:\nGoals:\nPages:\nTimeline:\nAnything we should know:",
      maintenance:
        "I want Maintenance.\n\nWebsite URL:\nWhat needs updating monthly:\nPreferred cadence:\nNotes:",
      tools:
        "I want Tools & Automation.\n\nWhat process are we automating:\nInputs / outputs:\nIntegrations (APIs):\nUsers / roles:\nTimeline:\nNotes:",
    };

    const es = {
      audit:
        "Quiero una Auditoría & Reestructura.\n\nSitio actual:\nObjetivos:\nPáginas:\nTimeline:\nAlgo que deberíamos saber:",
      maintenance:
        "Quiero Mantenimiento.\n\nURL del sitio:\nQué hay que actualizar mensualmente:\nFrecuencia preferida:\nNotas:",
      tools:
        "Quiero Herramientas & Automatización.\n\nQué proceso automatizamos:\nInputs / outputs:\nIntegraciones (APIs):\nUsuarios / roles:\nTimeline:\nNotas:",
    };

    return lang === "es" ? es : en;
  }, [lang]);

  const EXTENSIONS = useMemo(
    () => [
      {
        eyebrow: t("ext_item_1_eyebrow"),
        title: t("ext_item_1_title"),
        meta: t("ext_item_1_meta"),
        note: t("ext_item_1_note"),
        service: "Audit & Restructure",
        msg: MSG.audit,
      },
      {
        eyebrow: t("ext_item_2_eyebrow"),
        title: t("ext_item_2_title"),
        meta: t("ext_item_2_meta"),
        note: t("ext_item_2_note"),
        service: "Maintenance",
        msg: MSG.maintenance,
      },
      {
        eyebrow: t("ext_item_3_eyebrow"),
        title: t("ext_item_3_title"),
        meta: t("ext_item_3_meta"),
        note: t("ext_item_3_note"),
        service: "Tools & Automation",
        msg: MSG.tools,
      },
    ],
    [t, MSG],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const head = root.querySelector(".extensions__head");
      const items = gsap.utils.toArray(
        root.querySelectorAll(".extensions__item"),
      );
      const divider = root.querySelector(".extensions__divider");

      gsap.set([head, divider, ...items].filter(Boolean), {
        opacity: 0,
        y: 22,
      });
      gsap.set(items, { y: 28, scale: 0.99 });

      const tl = gsap.timeline({ paused: true });

      if (divider) {
        tl.to(
          divider,
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          0,
        );
      }

      tl.to(
        head,
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0.05,
      ).to(
        items,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          overwrite: "auto",
        },
        0.18,
      );

      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () => tl.play(0),
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="extensions"
      ref={rootRef}
      className="section extensions"
      aria-label={t("ext_eyebrow")}
    >
      <div className="sectionContent">
        <div className="container extensions__inner">
          <div className="extensions__layout">
            <header className="extensions__head">
              <p className="eyebrow">{t("ext_eyebrow")}</p>
              <h2 className="extensions__heading">{t("ext_heading")}</h2>
              <p className="copy">{t("ext_copy")}</p>
            </header>

            <div className="extensions__right">
              <div className="extensions__divider" aria-hidden="true" />
              <div className="extensions__grid">
                {EXTENSIONS.map((x) => (
                  <a
                    key={x.eyebrow}
                    className="extensions__item"
                    href={buildContactHref(x.service, x.msg)}
                    data-cursor="hover"
                    aria-label={`${t("ext_cta")} ${x.title}`}
                  >
                    <p className="extensions__eyebrow">{x.eyebrow}</p>
                    <h3 className="extensions__cardTitle">{x.title}</h3>
                    <p className="extensions__meta">{x.meta}</p>
                    <p className="extensions__note">{x.note}</p>
                    <span className="extensions__cta">{t("ext_cta")}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
