import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../i18n/I18nProvider";
import ServiceModals from "./ServiceModals";

gsap.registerPlugin(ScrollTrigger);

function buildContactUrl({ service, msg }) {
  const url = new URL(window.location.href);
  url.searchParams.set("service", service);
  url.searchParams.set("msg", msg);
  url.hash = "contact";
  return url.toString();
}

function ctaPayload(id, lang) {
  const base =
    lang === "es"
      ? "Hola COREXA. Quiero cotizar. "
      : "Hi COREXA. I'd like a quote. ";

  const map = {
    launch: {
      service: "Launch (WordPress)",
      msg:
        base +
        (lang === "es"
          ? "Necesito una web rápida (WordPress). Tipo de negocio: __. Secciones: __. Objetivo: __. Fecha ideal: __."
          : "I need a fast site (WordPress). Business type: __. Sections: __. Goal: __. Ideal launch date: __."),
    },
    custom: {
      service: "Custom Frontend",
      msg:
        base +
        (lang === "es"
          ? "Quiero un Custom Frontend (HTML/CSS/JS). Referencias: __. Secciones: __. Objetivo: __. Deadline: __."
          : "I want a Custom Frontend (HTML/CSS/JS). References: __. Sections: __. Goal: __. Deadline: __."),
    },
    premium: {
      service: "Premium System (React + GSAP)",
      msg:
        base +
        (lang === "es"
          ? "Busco un sistema premium (React + GSAP). Referencias: __. Secciones clave: __. Motion: sutil/pro. Deadline: __."
          : "I want a premium system (React + GSAP). References: __. Key sections: __. Motion: subtle/pro. Deadline: __."),
    },
    audit: {
      service: "Audit & Restructure",
      msg:
        base +
        (lang === "es"
          ? "Quiero una auditoría y reestructura. URL actual: __. Problema principal: __. Mejorar: conversión / claridad / performance."
          : "I want an audit & restructure. Current URL: __. Main issue: __. Improve: conversion / clarity / performance."),
    },
    maintenance: {
      service: "Maintenance",
      msg:
        base +
        (lang === "es"
          ? "Necesito mantenimiento mensual. Cambios típicos: __. Stack actual: __. Prioridades: performance / contenido / estabilidad."
          : "I need monthly maintenance. Typical changes: __. Current stack: __. Priorities: performance / content / stability."),
    },
    tools: {
      service: "Tools & Automation",
      msg:
        base +
        (lang === "es"
          ? "Quiero herramientas/automatización. Proceso a mejorar: __. Integraciones/API: __. Resultado esperado: __."
          : "I want tools/automation. Process to improve: __. Integrations/APIs: __. Expected outcome: __."),
    },
  };

  return map[id] || { service: "Other", msg: base };
}

function VisualLaunch() {
  return (
    <svg className="build__visual" viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <radialGradient id="launchGlow" cx="35%" cy="25%" r="70%">
          <stop offset="0" stopColor="rgba(245,247,250,0.10)" />
          <stop offset="1" stopColor="rgba(245,247,250,0.00)" />
        </radialGradient>
        <linearGradient id="launchSheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(245,247,250,0.00)" />
          <stop offset="0.5" stopColor="rgba(245,247,250,0.10)" />
          <stop offset="1" stopColor="rgba(245,247,250,0.00)" />
        </linearGradient>
        <clipPath id="launchClip">
          <rect x="56" y="64" width="488" height="292" rx="18" />
        </clipPath>
      </defs>
      <rect
        x="56"
        y="64"
        width="488"
        height="292"
        rx="18"
        fill="rgba(245,247,250,0.02)"
        stroke="rgba(245,247,250,0.10)"
      />
      <rect
        x="56"
        y="64"
        width="488"
        height="292"
        rx="18"
        fill="url(#launchGlow)"
      />
      <g clipPath="url(#launchClip)">
        <g className="vl_grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={86 + i * 45}
              y1="64"
              x2={86 + i * 45}
              y2="356"
              stroke="rgba(245,247,250,0.05)"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="56"
              y1={104 + i * 42}
              x2="544"
              y2={104 + i * 42}
              stroke="rgba(245,247,250,0.04)"
              strokeWidth="1"
            />
          ))}
        </g>
        <rect
          className="vl_title"
          x="92"
          y="102"
          width="260"
          height="26"
          rx="10"
          fill="rgba(245,247,250,0.10)"
        />
        <rect
          className="vl_line"
          x="92"
          y="148"
          width="360"
          height="14"
          rx="7"
          fill="rgba(245,247,250,0.07)"
        />
        <rect
          className="vl_line"
          x="92"
          y="176"
          width="320"
          height="14"
          rx="7"
          fill="rgba(245,247,250,0.06)"
        />
        <rect
          className="vl_line"
          x="92"
          y="204"
          width="300"
          height="14"
          rx="7"
          fill="rgba(245,247,250,0.05)"
        />
        <rect
          className="vl_btn"
          x="92"
          y="238"
          width="178"
          height="34"
          rx="999"
          fill="rgba(245,247,250,0.07)"
          stroke="rgba(245,247,250,0.10)"
        />
        <rect
          className="vl_card"
          x="92"
          y="284"
          width="416"
          height="54"
          rx="16"
          fill="rgba(245,247,250,0.02)"
          stroke="rgba(245,247,250,0.10)"
        />
        <rect
          className="vl_sheen"
          x="-220"
          y="64"
          width="220"
          height="292"
          fill="url(#launchSheen)"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

function VisualCustom() {
  return (
    <svg className="build__visual" viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <linearGradient id="codeSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(245,247,250,0.00)" />
          <stop offset="0.5" stopColor="rgba(245,247,250,0.10)" />
          <stop offset="1" stopColor="rgba(245,247,250,0.00)" />
        </linearGradient>
        <clipPath id="customClip">
          <rect x="56" y="64" width="488" height="292" rx="18" />
        </clipPath>
      </defs>
      <rect
        x="56"
        y="64"
        width="488"
        height="292"
        rx="18"
        fill="rgba(245,247,250,0.02)"
        stroke="rgba(245,247,250,0.10)"
      />
      <rect
        x="56"
        y="64"
        width="488"
        height="42"
        rx="18"
        fill="rgba(245,247,250,0.015)"
      />
      <circle cx="90" cy="85" r="6" fill="rgba(245,247,250,0.18)" />
      <circle cx="112" cy="85" r="6" fill="rgba(245,247,250,0.12)" />
      <circle cx="134" cy="85" r="6" fill="rgba(245,247,250,0.08)" />
      <g clipPath="url(#customClip)">
        <rect
          x="84"
          y="122"
          width="46"
          height="214"
          rx="10"
          fill="rgba(245,247,250,0.02)"
          stroke="rgba(245,247,250,0.06)"
        />
        <g className="vc_gutter">
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={i}
              className="vc_gdot"
              x="100"
              y={136 + i * 20}
              width="14"
              height="6"
              rx="3"
              fill="rgba(245,247,250,0.10)"
              opacity={0.9 - i * 0.05}
            />
          ))}
        </g>
        <g className="vc_code">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={`l-${i}`}
              className="vc_line"
              x="150"
              y={130 + i * 18}
              width={340 - (i % 3) * 44}
              height="8"
              rx="4"
              fill={
                i % 5 === 0
                  ? "rgba(245,247,250,0.14)"
                  : "rgba(245,247,250,0.08)"
              }
            />
          ))}
          <rect
            className="vc_highlight"
            x="150"
            y="312"
            width="250"
            height="26"
            rx="10"
            fill="rgba(245,247,250,0.02)"
            stroke="rgba(245,247,250,0.12)"
          />
          <rect
            className="vc_sweep"
            x="-240"
            y="110"
            width="240"
            height="260"
            fill="url(#codeSweep)"
            opacity="0.28"
          />
        </g>
      </g>
    </svg>
  );
}

function VisualPremium() {
  return (
    <svg className="build__visual" viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <radialGradient id="orbGlow" cx="55%" cy="45%" r="75%">
          <stop offset="0" stopColor="rgba(245,247,250,0.12)" />
          <stop offset="1" stopColor="rgba(245,247,250,0.00)" />
        </radialGradient>
        <clipPath id="premiumClip">
          <rect x="56" y="64" width="488" height="292" rx="18" />
        </clipPath>
      </defs>
      <rect
        x="56"
        y="64"
        width="488"
        height="292"
        rx="18"
        fill="rgba(245,247,250,0.02)"
        stroke="rgba(245,247,250,0.10)"
      />
      <g clipPath="url(#premiumClip)">
        <rect
          x="92"
          y="96"
          width="260"
          height="22"
          rx="10"
          fill="rgba(245,247,250,0.08)"
        />
        <rect
          x="92"
          y="130"
          width="360"
          height="14"
          rx="7"
          fill="rgba(245,247,250,0.06)"
        />
        <g className="vp_bars">
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              className="vp_bar"
              x="92"
              y={178 + i * 26}
              width={260 - i * 18}
              height="10"
              rx="5"
              fill="rgba(245,247,250,0.08)"
            />
          ))}
        </g>
        <g className="vp_orb">
          <circle cx="424" cy="230" r="92" fill="url(#orbGlow)" opacity="0.9" />
          <circle
            className="vp_ring1"
            cx="424"
            cy="230"
            r="76"
            fill="none"
            stroke="rgba(245,247,250,0.12)"
          />
          <circle
            className="vp_ring2"
            cx="424"
            cy="230"
            r="54"
            fill="none"
            stroke="rgba(245,247,250,0.16)"
          />
          <circle
            className="vp_core"
            cx="424"
            cy="230"
            r="12"
            fill="rgba(245,247,250,0.35)"
          />
          <circle
            className="vp_sat"
            cx="372"
            cy="230"
            r="4"
            fill="rgba(245,247,250,0.22)"
          />
        </g>
      </g>
    </svg>
  );
}

function VisualAudit() {
  return (
    <svg className="build__visual" viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <clipPath id="auditClip">
          <rect x="56" y="64" width="488" height="292" rx="18" />
        </clipPath>
        <linearGradient id="auditSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(245,247,250,0.00)" />
          <stop offset="0.5" stopColor="rgba(245,247,250,0.10)" />
          <stop offset="1" stopColor="rgba(245,247,250,0.00)" />
        </linearGradient>
      </defs>
      <rect
        x="56"
        y="64"
        width="488"
        height="292"
        rx="18"
        fill="rgba(245,247,250,0.02)"
        stroke="rgba(245,247,250,0.10)"
      />
      <g clipPath="url(#auditClip)">
        <rect
          x="92"
          y="98"
          width="280"
          height="18"
          rx="9"
          fill="rgba(245,247,250,0.06)"
        />
        <g className="va_rows">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              className="va_row"
              x="92"
              y={142 + i * 22}
              width={380 - (i % 3) * 40}
              height="10"
              rx="5"
              fill="rgba(245,247,250,0.07)"
              opacity={0.9 - i * 0.05}
            />
          ))}
        </g>
        <g className="va_marks">
          {Array.from({ length: 6 }).map((_, i) => (
            <circle
              key={i}
              className="va_dot"
              cx={470 - i * 14}
              cy={150 + i * 26}
              r="3"
              fill="rgba(245,247,250,0.22)"
              opacity={0.25 + i * 0.08}
            />
          ))}
        </g>
        <rect
          className="va_sweep"
          x="-260"
          y="64"
          width="260"
          height="292"
          fill="url(#auditSweep)"
          opacity="0.22"
        />
      </g>
    </svg>
  );
}

function VisualMaintenance() {
  return (
    <svg className="build__visual" viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <clipPath id="maintClip">
          <rect x="56" y="64" width="488" height="292" rx="18" />
        </clipPath>
      </defs>
      <rect
        x="56"
        y="64"
        width="488"
        height="292"
        rx="18"
        fill="rgba(245,247,250,0.02)"
        stroke="rgba(245,247,250,0.10)"
      />
      <g clipPath="url(#maintClip)">
        <rect
          x="92"
          y="96"
          width="220"
          height="18"
          rx="9"
          fill="rgba(245,247,250,0.06)"
        />
        <rect
          x="92"
          y="132"
          width="340"
          height="12"
          rx="6"
          fill="rgba(245,247,250,0.05)"
        />
        <g className="vm_ring">
          <circle
            cx="430"
            cy="220"
            r="64"
            fill="none"
            stroke="rgba(245,247,250,0.10)"
          />
          <circle
            className="vm_arc"
            cx="430"
            cy="220"
            r="64"
            fill="none"
            stroke="rgba(245,247,250,0.22)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            className="vm_core"
            cx="430"
            cy="220"
            r="10"
            fill="rgba(245,247,250,0.28)"
          />
        </g>
        <g className="vm_logs">
          {Array.from({ length: 7 }).map((_, i) => (
            <rect
              key={i}
              className="vm_log"
              x="92"
              y={178 + i * 22}
              width={280 + (i % 2) * 40}
              height="10"
              rx="5"
              fill="rgba(245,247,250,0.07)"
              opacity={0.85 - i * 0.06}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

function VisualTools() {
  return (
    <svg className="build__visual" viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <clipPath id="toolsClip">
          <rect x="56" y="64" width="488" height="292" rx="18" />
        </clipPath>
      </defs>
      <rect
        x="56"
        y="64"
        width="488"
        height="292"
        rx="18"
        fill="rgba(245,247,250,0.02)"
        stroke="rgba(245,247,250,0.10)"
      />
      <g clipPath="url(#toolsClip)">
        <rect
          x="92"
          y="96"
          width="250"
          height="18"
          rx="9"
          fill="rgba(245,247,250,0.06)"
        />
        <rect
          x="92"
          y="132"
          width="360"
          height="12"
          rx="6"
          fill="rgba(245,247,250,0.05)"
        />
        <g className="vt_nodes">
          <circle
            className="vt_n"
            cx="170"
            cy="230"
            r="10"
            fill="rgba(245,247,250,0.20)"
          />
          <circle
            className="vt_n"
            cx="260"
            cy="190"
            r="8"
            fill="rgba(245,247,250,0.16)"
          />
          <circle
            className="vt_n"
            cx="320"
            cy="260"
            r="9"
            fill="rgba(245,247,250,0.18)"
          />
          <circle
            className="vt_n"
            cx="420"
            cy="220"
            r="11"
            fill="rgba(245,247,250,0.22)"
          />
          <path
            className="vt_link"
            d="M170 230 L260 190 L420 220 L320 260 L170 230"
            fill="none"
            stroke="rgba(245,247,250,0.10)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g className="vt_pulses">
          <circle
            className="vt_p"
            cx="170"
            cy="230"
            r="22"
            fill="none"
            stroke="rgba(245,247,250,0.10)"
          />
          <circle
            className="vt_p"
            cx="420"
            cy="220"
            r="26"
            fill="none"
            stroke="rgba(245,247,250,0.10)"
          />
        </g>
      </g>
    </svg>
  );
}

function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function useGlassMagnetic(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const cards = Array.from(root.querySelectorAll(".buildCard"));

    const cleanups = cards.map((card) => {
      const tilt = card.querySelector(".build__tilt");
      const glare = card.querySelector(".build__glare");
      if (!tilt || !glare) return () => {};

      const qx = gsap.quickTo(tilt, "x", {
        duration: 0.35,
        ease: "power3.out",
      });
      const qy = gsap.quickTo(tilt, "y", {
        duration: 0.35,
        ease: "power3.out",
      });
      const qrX = gsap.quickTo(tilt, "rotateX", {
        duration: 0.45,
        ease: "power3.out",
      });
      const qrY = gsap.quickTo(tilt, "rotateY", {
        duration: 0.45,
        ease: "power3.out",
      });
      const qs = gsap.quickTo(tilt, "scale", {
        duration: 0.55,
        ease: "power3.out",
      });
      const qgo = gsap.quickTo(glare, "opacity", {
        duration: 0.35,
        ease: "power3.out",
      });

      gsap.set(tilt, {
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      });
      gsap.set(glare, { opacity: 0 });

      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        qx((px - 0.5) * 18);
        qy((py - 0.5) * 14);
        qrY((px - 0.5) * 10);
        qrX(-(py - 0.5) * 10);
        qs(1.012);
        const gx = Math.round(px * 100);
        const gy = Math.round(py * 100);
        glare.style.background = `radial-gradient(420px 260px at ${gx}% ${gy}%, rgba(245,247,250,0.14), rgba(245,247,250,0.00) 62%)`;
        qgo(1);
      };

      const onLeave = () => {
        qx(0);
        qy(0);
        qrX(0);
        qrY(0);
        qs(1);
        qgo(0);
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);

      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, [rootRef]);
}

export default function Builds() {
  const { t, lang } = useI18n();
  const rootRef = useRef(null);
  const modalRef = useRef(null);
  const modalMediaRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [activeId, setActiveId] = useState(null);

  const items = useMemo(
    () => [
      {
        id: "launch",
        group: "core",
        eyebrow: t("build_01_eyebrow"),
        title: t("build_01_title"),
        meta: t("build_01_meta"),
        note: t("build_01_note"),
        Visual: VisualLaunch,
      },
      {
        id: "custom",
        group: "core",
        eyebrow: t("build_02_eyebrow"),
        title: t("build_02_title"),
        meta: t("build_02_meta"),
        note: t("build_02_note"),
        Visual: VisualCustom,
      },
      {
        id: "premium",
        group: "core",
        eyebrow: t("build_03_eyebrow"),
        title: t("build_03_title"),
        meta: t("build_03_meta"),
        note: t("build_03_note"),
        Visual: VisualPremium,
      },
      {
        id: "audit",
        group: "ext",
        eyebrow: t("ext_item_1_eyebrow"),
        title: t("ext_item_1_title"),
        meta: t("ext_item_1_meta"),
        note: t("ext_item_1_note"),
        Visual: VisualAudit,
      },
      {
        id: "maintenance",
        group: "ext",
        eyebrow: t("ext_item_2_eyebrow"),
        title: t("ext_item_2_title"),
        meta: t("ext_item_2_meta"),
        note: t("ext_item_2_note"),
        Visual: VisualMaintenance,
      },
      {
        id: "tools",
        group: "ext",
        eyebrow: t("ext_item_3_eyebrow"),
        title: t("ext_item_3_title"),
        meta: t("ext_item_3_meta"),
        note: t("ext_item_3_note"),
        Visual: VisualTools,
      },
    ],
    [t],
  );

  const activeItem = useMemo(
    () => items.find((x) => x.id === activeId) || null,
    [items, activeId],
  );

  useLockBody(Boolean(activeId));
  useGlassMagnetic(rootRef);

  const viewLabel = lang === "es" ? "Ver" : "View";
  const requestLabel = lang === "es" ? "Solicitar" : "Request";
  const closeLabel = lang === "es" ? "Cerrar" : "Close";

  function openModal(id, ev) {
    if (ev?.currentTarget) lastActiveRef.current = ev.currentTarget;
    setActiveId(id);
    const topbar = document.querySelector(".topbar");
    if (topbar) topbar.style.visibility = "hidden";
  }

  function closeModal() {
    setActiveId(null);
    const el = lastActiveRef.current;
    if (el && typeof el.focus === "function") el.focus();
    const topbar = document.querySelector(".topbar");
    if (topbar) topbar.style.visibility = "visible";
  }

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  function createLoop(scopeEl, id, reduce) {
    const svg = scopeEl.querySelector("svg");
    if (!svg) return null;

    const tl = gsap.timeline({
      paused: true,
      repeat: reduce ? 0 : -1,
      defaults: { ease: "power1.inOut" },
    });

    if (reduce) return tl;

    if (id === "launch") {
      const sheen = scopeEl.querySelector(".vl_sheen");
      const lines = scopeEl.querySelectorAll(".vl_line");
      const btn = scopeEl.querySelector(".vl_btn");
      tl.set(sheen, { x: -240 })
        .to(sheen, { x: 920, duration: 2.4 }, 0)
        .to(sheen, { x: -240, duration: 0.001 }, 2.4)
        .to(lines, { opacity: 0.75, stagger: 0.06, duration: 0.6 }, 0.2)
        .to(lines, { opacity: 1, stagger: 0.06, duration: 0.6 }, 1.0)
        .to(
          btn,
          { scale: 1.03, transformOrigin: "50% 50%", duration: 0.9 },
          0.6,
        )
        .to(btn, { scale: 1.0, duration: 0.9 }, 1.5);
    }

    if (id === "custom") {
      const code = scopeEl.querySelector(".vc_code");
      const sweep = scopeEl.querySelector(".vc_sweep");
      const gdot = scopeEl.querySelectorAll(".vc_gdot");
      tl.to(code, { y: -12, duration: 1.2 }, 0)
        .to(code, { y: 0, duration: 1.2 }, 1.2)
        .set(sweep, { x: -260 }, 0)
        .to(sweep, { x: 980, duration: 2.2 }, 0.2)
        .to(sweep, { x: -260, duration: 0.001 }, 2.4)
        .to(gdot, { opacity: 0.35, stagger: 0.05, duration: 0.5 }, 0.4)
        .to(gdot, { opacity: 0.9, stagger: 0.05, duration: 0.6 }, 1.2);
    }

    if (id === "premium") {
      const ring1 = scopeEl.querySelector(".vp_ring1");
      const ring2 = scopeEl.querySelector(".vp_ring2");
      const coreDot = scopeEl.querySelector(".vp_core");
      const sat = scopeEl.querySelector(".vp_sat");
      const bars = scopeEl.querySelectorAll(".vp_bar");
      const orb = scopeEl.querySelector(".vp_orb");
      tl.to(orb, { scale: 1.012, transformOrigin: "50% 50%", duration: 1.4 }, 0)
        .to(orb, { scale: 1.0, duration: 1.4 }, 1.4)
        .to(
          ring1,
          {
            rotation: 360,
            transformOrigin: "50% 50%",
            duration: 7.5,
            ease: "none",
          },
          0,
        )
        .to(
          ring2,
          {
            rotation: -360,
            transformOrigin: "50% 50%",
            duration: 9.5,
            ease: "none",
          },
          0,
        )
        .to(coreDot, { opacity: 0.55, duration: 0.8 }, 0.2)
        .to(coreDot, { opacity: 1, duration: 0.8 }, 1.0)
        .to(bars, { opacity: 0.75, stagger: 0.08, duration: 0.6 }, 0.3)
        .to(bars, { opacity: 1, stagger: 0.08, duration: 0.6 }, 1.1)
        .to(sat, { x: 30, y: -6, duration: 1.6, ease: "sine.inOut" }, 0)
        .to(sat, { x: -30, y: 6, duration: 1.6, ease: "sine.inOut" }, 1.6)
        .to(sat, { x: 0, y: 0, duration: 1.6, ease: "sine.inOut" }, 3.2);
    }

    if (id === "audit") {
      const rows = scopeEl.querySelectorAll(".va_row");
      const dots = scopeEl.querySelectorAll(".va_dot");
      const sweep = scopeEl.querySelector(".va_sweep");
      tl.set(sweep, { x: -300 })
        .to(sweep, { x: 980, duration: 2.6 }, 0)
        .to(sweep, { x: -300, duration: 0.001 }, 2.6)
        .to(rows, { opacity: 0.55, stagger: 0.05, duration: 0.6 }, 0.2)
        .to(rows, { opacity: 0.9, stagger: 0.05, duration: 0.6 }, 1.0)
        .to(dots, { opacity: 0.85, stagger: 0.08, duration: 0.5 }, 0.6)
        .to(dots, { opacity: 0.25, stagger: 0.08, duration: 0.7 }, 1.4);
    }

    if (id === "maintenance") {
      const arc = scopeEl.querySelector(".vm_arc");
      const coreDot = scopeEl.querySelector(".vm_core");
      const logs = scopeEl.querySelectorAll(".vm_log");
      gsap.set(arc, { strokeDasharray: 120, strokeDashoffset: 120 });
      tl.to(arc, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out" }, 0)
        .to(
          arc,
          { strokeDashoffset: -120, duration: 1.8, ease: "power2.inOut" },
          1.6,
        )
        .to(coreDot, { opacity: 0.55, duration: 0.8 }, 0.2)
        .to(coreDot, { opacity: 1, duration: 0.8 }, 1.0)
        .to(logs, { opacity: 0.6, stagger: 0.06, duration: 0.6 }, 0.4)
        .to(logs, { opacity: 0.95, stagger: 0.06, duration: 0.7 }, 1.2);
    }

    if (id === "tools") {
      const nodes = scopeEl.querySelectorAll(".vt_n");
      const pulses = scopeEl.querySelectorAll(".vt_p");
      const link = scopeEl.querySelector(".vt_link");
      tl.to(nodes, { y: -4, stagger: 0.08, duration: 1.0 }, 0)
        .to(nodes, { y: 4, stagger: 0.08, duration: 1.0 }, 1.0)
        .to(nodes, { y: 0, stagger: 0.08, duration: 0.9 }, 2.0)
        .to(
          pulses,
          {
            scale: 1.12,
            transformOrigin: "50% 50%",
            opacity: 0.22,
            duration: 1.2,
          },
          0.2,
        )
        .to(pulses, { scale: 1.0, opacity: 1, duration: 1.2 }, 1.4)
        .to(link, { opacity: 0.65, duration: 0.8 }, 0.4)
        .to(link, { opacity: 1, duration: 0.8 }, 1.4);
    }

    return tl;
  }

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(root.querySelectorAll(".buildCard"));
      cards.forEach((card) => {
        const id = card.dataset.id;
        const tl = createLoop(card, id, reduce);
        if (!tl) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          onEnter: () => tl.play(0),
          onEnterBack: () => tl.play(0),
          onLeave: () => tl.pause(0),
          onLeaveBack: () => tl.pause(0),
        });
      });
    }, root);

    return () => ctx.revert();
  }, [items]);

  useLayoutEffect(() => {
    if (!activeId) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const media = modalMediaRef.current;
    if (!media) return;

    const ctx = gsap.context(() => {
      const tl = createLoop(media, activeId, reduce);
      if (tl) tl.play(0);
    }, media);

    const modal = modalRef.current;
    if (modal) modal.focus();

    return () => ctx.revert();
  }, [activeId]);

  const core = items.filter((x) => x.group === "core");
  const ext = items.filter((x) => x.group === "ext");

  function onRequest(id) {
    const payload = ctaPayload(id, lang);
    const nextUrl = buildContactUrl(payload);
    closeModal();
    window.history.pushState({}, "", nextUrl);
    window.dispatchEvent(new Event("popstate"));
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const Card = ({ id, eyebrow, title, Visual }) => (
    <article
      className="buildCard buildCard--minimal"
      data-id={id}
      role="button"
      tabIndex={0}
      onClick={(e) => openModal(id, e)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(id, e);
        }
      }}
    >
      <div className="buildCard__media">
        <div className="build__mediaInner build__tilt">
          <Visual />
        </div>
        <div className="build__glare" aria-hidden="true" />
        <div className="build__film" aria-hidden="true" />
      </div>
      <div className="buildCard__body">
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="build__title">{title}</h3>
        <button
          type="button"
          className="buildLink"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal(id, e);
          }}
        >
          {viewLabel} <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );

  return (
    <section
      id="builds"
      className="builds builds--compact"
      aria-label={t("builds_aria")}
      ref={rootRef}
    >
      <div className="container builds__inner">
        <header className="builds__head">
          <p className="eyebrow">{lang === "es" ? "SERVICIOS" : "SERVICES"}</p>
          <h2 className="title">
            {lang === "es" ? "Core services." : "Core services."}
          </h2>
        </header>

        <div className="builds__grid">
          {core.map((it) => (
            <Card key={it.id} {...it} />
          ))}
        </div>

        <div className="builds__divider" aria-hidden="true" />

        <header className="builds__head builds__head--sub">
          <p className="eyebrow">
            {lang === "es" ? "EXTENSIONES" : "EXTENSIONS"}
          </p>
          <h2 className="title">
            {lang === "es" ? "System extensions." : "System extensions."}
          </h2>
        </header>

        <div className="builds__grid">
          {ext.map((it) => (
            <Card key={it.id} {...it} />
          ))}
        </div>
      </div>

      {["launch", "custom", "premium"].includes(activeId) ? (
        <ServiceModals
          activeId={activeId}
          onClose={closeModal}
          onRequest={onRequest}
          lang={lang}
        />
      ) : activeItem ? (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          <div className="modal__backdrop" onClick={closeModal} />
          <div className="modal__panel" ref={modalRef} tabIndex={-1}>
            <div className="modal__top">
              <div className="modal__traffic" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <button
                type="button"
                className="modal__close"
                onClick={closeModal}
              >
                {closeLabel}
              </button>
            </div>
            <div className="modal__media" ref={modalMediaRef}>
              <div className="build__mediaInner">
                <activeItem.Visual />
              </div>
              <div className="build__film" aria-hidden="true" />
            </div>
            <div className="modal__body">
              <p className="eyebrow">{activeItem.eyebrow}</p>
              <h3 className="modal__title">{activeItem.title}</h3>
              <p className="modal__meta">{activeItem.meta}</p>
              <p className="modal__note">{activeItem.note}</p>
              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => onRequest(activeItem.id)}
                >
                  {requestLabel} <span aria-hidden="true">→</span>
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={closeModal}
                >
                  {closeLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
