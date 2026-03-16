import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

function animateIn(container) {
  if (!container) return;
  const top = container.querySelector(".co-calc-top");
  const inners = container.querySelectorAll(".co-h1-inner");
  const blocks = container.querySelectorAll(".co-q-block, .co-slider-block");
  const rc = container.querySelector(".co-result-col");
  if (top) {
    top.classList.remove("in");
    requestAnimationFrame(() => top.classList.add("in"));
  }
  inners.forEach((el, i) => {
    el.style.animation = "none";
    requestAnimationFrame(() => {
      el.style.animation = `co-slideup .6s cubic-bezier(.22,1,.36,1) ${0.04 + i * 0.12}s forwards`;
    });
  });
  blocks.forEach((b, i) => {
    b.classList.remove("in");
    setTimeout(() => b.classList.add("in"), 180 + i * 70);
  });
  if (rc) {
    rc.classList.remove("in");
    setTimeout(() => rc.classList.add("in"), 280);
  }
}

function selOpt(el, groupId, container) {
  container
    .querySelectorAll(`#${groupId} .co-opt`)
    .forEach((o) => o.classList.remove("selected"));
  el.classList.add("selected");
}

function getVal(groupId, container) {
  const s = container.querySelector(`#${groupId} .co-opt.selected`);
  return s ? s.dataset.val : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT — Amber
// ─────────────────────────────────────────────────────────────────────────────

function ModalAudit({ onRequest, lang }) {
  const ref = useRef(null);
  const ACCENT = "rgba(240,160,60,1)";
  const ACCENT_RGB = "240,160,60";

  const c =
    lang === "es"
      ? {
          eyebrow: "AUDIT & RESTRUCTURE · Calculadora",
          title: ["¿Tu sitio te está", "costando clientes?"],
          desc: "Tres preguntas simples. Sin tecnicismos. Te mostramos cuántas personas llegaron y se fueron sin contactarte.",
          q1: "¿Cuánta gente entra a tu sitio por mes?",
          q1hint: "No necesitás saber el número exacto",
          q1opts: [
            { val: "200", label: "Poca — menos de 500 visitas" },
            {
              val: "1500",
              label: "Algunas — entre 500 y 2.000 visitas",
              sel: true,
            },
            { val: "5000", label: "Bastante — más de 2.000 visitas" },
          ],
          q2: "De cada 100 personas, ¿cuántas te escriben o compran?",
          q2hint: "Si no sabés, elegí la última opción",
          q2opts: [
            { val: "0.5", label: "Casi ninguna — 1 o 2 de cada 100" },
            { val: "2", label: "Algunas — 3 a 5 de cada 100", sel: true },
            { val: "7", label: "Bastantes — más de 5 de cada 100" },
            { val: "1", label: "No lo sé" },
          ],
          q3: "¿Cuál es tu mayor problema con el sitio?",
          q3opts: [
            {
              val: "conv",
              label: "La gente entra pero no contacta ni compra",
              sel: true,
            },
            { val: "old", label: "Se ve desactualizado o poco profesional" },
            { val: "slow", label: "Tarda mucho en cargar" },
            {
              val: "unsure",
              label: "No sé qué está mal, pero algo no funciona",
            },
          ],
          resultLabel: "personas se fueron sin contactarte este mes",
          rows: [
            "Visitas este mes",
            "Te contactaron",
            "Se fueron sin contactarte",
            "Potencial con sitio optimizado",
          ],
          cta: "Solicitar auditoría →",
          ctaSub: "Auditoría en 4–6 días hábiles",
          ctaTitle: "Descubrí qué los está frenando",
        }
      : {
          eyebrow: "AUDIT & RESTRUCTURE · Calculator",
          title: ["Is your site", "costing you clients?"],
          desc: "Three simple questions. No jargon. We show you how many people arrived and left without contacting you.",
          q1: "How much traffic does your site get per month?",
          q1hint: "No need to know the exact number",
          q1opts: [
            { val: "200", label: "Not much — under 500 visits" },
            { val: "1500", label: "Some — between 500 and 2,000", sel: true },
            { val: "5000", label: "A lot — more than 2,000 visits" },
          ],
          q2: "Out of every 100 visitors, how many contact or buy from you?",
          q2hint: "If you're not sure, pick the last option",
          q2opts: [
            { val: "0.5", label: "Almost none — 1 or 2 out of 100" },
            { val: "2", label: "Some — 3 to 5 out of 100", sel: true },
            { val: "7", label: "Quite a few — more than 5 out of 100" },
            { val: "1", label: "I don't know" },
          ],
          q3: "What's your biggest problem with the site?",
          q3opts: [
            {
              val: "conv",
              label: "People visit but don't contact or buy",
              sel: true,
            },
            { val: "old", label: "It looks outdated or unprofessional" },
            { val: "slow", label: "It takes too long to load" },
            {
              val: "unsure",
              label: "I don't know what's wrong, but something isn't working",
            },
          ],
          resultLabel:
            "people left your site without contacting you this month",
          rows: [
            "Visits this month",
            "Contacted you",
            "Left without contacting",
            "Potential with optimised site",
          ],
          cta: "Request an audit →",
          ctaSub: "Full audit in 4–6 business days",
          ctaTitle: "Find out what's stopping them",
        };

  function calc() {
    const el = ref.current;
    if (!el) return;
    const traffic = parseFloat(getVal("a-traffic", el) || 1500);
    const conv = parseFloat(getVal("a-conv", el) || 2);
    const prob = getVal("a-prob", el) || "conv";
    const contacted = Math.round((traffic * conv) / 100);
    const lost = traffic - contacted;
    const potential = Math.round((traffic * (conv + 3)) / 100) - contacted;
    const big = el.querySelector("#a-big");
    if (big) big.textContent = lost.toLocaleString();
    const r = el.querySelectorAll(".a-rv");
    if (r[0]) r[0].textContent = traffic.toLocaleString();
    if (r[1]) r[1].textContent = contacted.toLocaleString();
    if (r[2]) {
      r[2].textContent = lost.toLocaleString();
      r[2].style.color = ACCENT;
    }
    if (r[3]) {
      r[3].textContent =
        "+" + potential + (lang === "es" ? " contactos" : " contacts");
      r[3].style.color = ACCENT;
    }
    const msgs = {
      conv:
        lang === "es"
          ? "La mayoría <strong>sí tenían intención de contactarte</strong>. Algo los frenó. Eso es exactamente lo que detecta una auditoría."
          : "Most of them <strong>did intend to contact you</strong>. Something stopped them. That's exactly what an audit finds.",
      old:
        lang === "es"
          ? "Un sitio desactualizado genera <strong>desconfianza antes de que lean una palabra</strong>."
          : "An outdated site creates <strong>distrust before anyone reads a word</strong>.",
      slow:
        lang === "es"
          ? "Cada segundo extra de carga <strong>pierde visitantes antes de que vean tu contenido</strong>."
          : "Every extra second of load time <strong>loses visitors before they see your content</strong>.",
      unsure:
        lang === "es"
          ? 'Que algo "no funcione" pero no sepas qué <strong>es exactamente para lo que existe la auditoría</strong>.'
          : "Not knowing what's wrong <strong>is exactly what the audit is designed to diagnose</strong>.",
    };
    const msg = el.querySelector("#a-msg");
    if (msg) msg.innerHTML = msgs[prob] || msgs.conv;
  }

  useLayoutEffect(() => {
    animateIn(ref.current);
  }, []);
  useEffect(() => {
    calc();
  }, [lang]);

  return (
    <div
      className="co-page"
      ref={ref}
      style={{ "--co-accent": ACCENT, "--co-accent-rgb": ACCENT_RGB }}
    >
      <div
        className="co-orb co-orb-a"
        style={{ background: "rgba(240,160,60,1)" }}
      />
      <div
        className="co-orb co-orb-b"
        style={{ background: "rgba(180,100,20,1)" }}
      />
      <div
        className="co-orb co-orb-c"
        style={{ background: "rgba(255,200,80,1)" }}
      />
      <div className="co-grid-bg" />
      <div
        className="co-accent-line"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(240,160,60,.7),transparent)",
        }}
      />
      <div className="co-page-inner">
        <div className="co-page-top">
          <div className="co-calc-top">
            <div className="co-eyebrow-row">
              <span
                className="co-eyebrow-line"
                style={{ background: "rgba(240,160,60,.5)" }}
              />
              {c.eyebrow}
            </div>
            <div className="co-h1">
              <span className="co-h1-line">
                <span className="co-h1-inner slide">{c.title[0]}</span>
              </span>
              <span className="co-h1-line">
                <span
                  className="co-h1-inner slide"
                  style={{ color: ACCENT, animationDelay: ".12s" }}
                >
                  {c.title[1]}
                </span>
              </span>
            </div>
            <p className="co-desc">{c.desc}</p>
          </div>
        </div>
        <div className="co-calc-grid">
          <div className="co-inputs-col">
            <div className="co-q-block">
              <span className="co-q-label">{c.q1}</span>
              <span className="co-q-hint">{c.q1hint}</span>
              <div className="co-options-row" id="a-traffic">
                {c.q1opts.map((o, i) => (
                  <div
                    key={i}
                    className={`co-opt${o.sel ? " selected" : ""}`}
                    data-val={o.val}
                    onClick={(e) => {
                      selOpt(e.currentTarget, "a-traffic", ref.current);
                      calc();
                    }}
                  >
                    <span className="co-opt-radio" />
                    <span className="co-opt-text">{o.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="co-q-block">
              <span className="co-q-label">{c.q2}</span>
              <span className="co-q-hint">{c.q2hint}</span>
              <div className="co-options-row" id="a-conv">
                {c.q2opts.map((o, i) => (
                  <div
                    key={i}
                    className={`co-opt${o.sel ? " selected" : ""}`}
                    data-val={o.val}
                    onClick={(e) => {
                      selOpt(e.currentTarget, "a-conv", ref.current);
                      calc();
                    }}
                  >
                    <span className="co-opt-radio" />
                    <span className="co-opt-text">{o.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="co-q-block">
              <span className="co-q-label">{c.q3}</span>
              <div className="co-options-row" id="a-prob">
                {c.q3opts.map((o, i) => (
                  <div
                    key={i}
                    className={`co-opt${o.sel ? " selected" : ""}`}
                    data-val={o.val}
                    onClick={(e) => {
                      selOpt(e.currentTarget, "a-prob", ref.current);
                      calc();
                    }}
                  >
                    <span className="co-opt-radio" />
                    <span className="co-opt-text">{o.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="co-result-col">
            <div
              className="co-result-card"
              style={{ borderColor: "rgba(240,160,60,0.18)" }}
            >
              <div className="co-result-glow" />
              <div className="co-result-headline">
                <span
                  className="co-result-num"
                  id="a-big"
                  style={{ color: ACCENT }}
                >
                  1,470
                </span>
                <span className="co-result-num-label">{c.resultLabel}</span>
              </div>
              <div className="co-result-rows">
                {c.rows.map((label, i) => (
                  <div className="co-rr" key={i}>
                    <span className="co-rr-l">{label}</span>
                    <span className="co-rr-v a-rv">
                      {["1,500", "30", "1,470", "+45"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="co-callout" id="a-msg">
                La mayoría <strong>sí tenían intención de contactarte</strong>.
                Algo los frenó.
              </div>
            </div>
            <div
              className="co-cta-strip"
              style={{
                borderColor: "rgba(240,160,60,0.16)",
                background: "rgba(240,160,60,0.03)",
              }}
            >
              <div>
                <p className="co-cta-strip-text">{c.ctaTitle}</p>
                <p className="co-cta-strip-sub">{c.ctaSub}</p>
              </div>
              <button
                className="co-cta-btn"
                style={{ background: ACCENT, color: "#060400" }}
                onClick={() => onRequest("audit")}
              >
                {c.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAINTENANCE — Teal
// ─────────────────────────────────────────────────────────────────────────────

function ModalMaintenance({ onRequest, lang }) {
  const ref = useRef(null);
  const ACCENT = "rgba(45,200,160,1)";
  const ACCENT_RGB = "45,200,160";

  const c =
    lang === "es"
      ? {
          eyebrow: "MAINTENANCE · Calculadora",
          title: ["¿Cuándo fue la última vez", "que alguien revisó tu sitio?"],
          desc: "Tres preguntas simples. Te decimos en qué estado está y qué riesgos tiene ahora mismo.",
          q1: "¿Cuándo fue la última actualización o revisión?",
          q1opts: [
            { val: "0", label: "Hace poco — este mes" },
            {
              val: "2",
              label: "Hace unos meses — entre 3 y 6 meses",
              sel: true,
            },
            { val: "4", label: "Hace bastante — más de 6 meses" },
            { val: "5", label: "No me acuerdo" },
          ],
          q2: "Si el sitio se cae, ¿qué tan grave es para el negocio?",
          q2opts: [
            { val: "1", label: "Poco grave — es solo informativo" },
            {
              val: "2",
              label: "Bastante grave — pierdo consultas y clientes",
              sel: true,
            },
            { val: "3", label: "Muy grave — es mi canal principal de ventas" },
          ],
          q3: "¿Tu sitio tiene copias de seguridad automáticas?",
          q3opts: [
            { val: "0", label: "Sí, todo configurado" },
            { val: "2", label: "A veces hago copias manuales" },
            { val: "4", label: "No sé / no creo tener", sel: true },
          ],
          barLow: "Sin riesgo",
          barHigh: "Riesgo crítico",
          rows: [
            "Estado general",
            "Si algo se rompe ahora",
            "Respaldo disponible",
            "Recomendación",
          ],
          cta: "Consultar →",
          ctaSub: "Sin contratos largos",
          ctaTitle: "Que alguien lo cuide cada mes",
        }
      : {
          eyebrow: "MAINTENANCE · Calculator",
          title: ["When did someone last", "check your site?"],
          desc: "Three simple questions. We tell you what state it's in and what risks it has right now.",
          q1: "When was the last update or review?",
          q1opts: [
            { val: "0", label: "Recently — this month" },
            { val: "2", label: "A few months ago — 3 to 6 months", sel: true },
            { val: "4", label: "A while ago — more than 6 months" },
            { val: "5", label: "I can't remember" },
          ],
          q2: "If the site goes down, how serious is it for the business?",
          q2opts: [
            { val: "1", label: "Not very — it's just informational" },
            {
              val: "2",
              label: "Pretty serious — I lose enquiries and clients",
              sel: true,
            },
            { val: "3", label: "Very serious — it's my main sales channel" },
          ],
          q3: "Does your site have automatic backups?",
          q3opts: [
            { val: "0", label: "Yes, all configured" },
            { val: "2", label: "I do manual backups sometimes" },
            { val: "4", label: "I don't know / I don't think so", sel: true },
          ],
          barLow: "No risk",
          barHigh: "Critical risk",
          rows: [
            "Overall status",
            "If something breaks now",
            "Backup available",
            "Recommendation",
          ],
          cta: "Enquire →",
          ctaSub: "No long-term contracts",
          ctaTitle: "Let someone take care of it monthly",
        };

  function calc() {
    const el = ref.current;
    if (!el) return;
    const u = parseInt(getVal("m-update", el) || 2);
    const i = parseInt(getVal("m-impact", el) || 2);
    const b = parseInt(getVal("m-backup", el) || 4);
    const score = Math.min((u + i + b) * 10, 100);
    let emoji, title, sub, estado, siRompe, respaldo, rec, msg, barColor;
    if (score <= 20) {
      emoji = "🟢";
      title =
        lang === "es"
          ? "Tu sitio está en buen estado"
          : "Your site is in good shape";
      sub =
        lang === "es"
          ? "Bien mantenido y con bajo riesgo."
          : "Well maintained and low risk.";
      estado = lang === "es" ? "Bueno" : "Good";
      siRompe = lang === "es" ? "Fácil de recuperar" : "Easy to recover";
      respaldo =
        b === 0
          ? lang === "es"
            ? "Confirmado"
            : "Confirmed"
          : lang === "es"
            ? "A verificar"
            : "To verify";
      rec = lang === "es" ? "Mantener rutina" : "Keep current routine";
      barColor = "rgba(45,200,160,1)";
      msg =
        lang === "es"
          ? "Tu sitio está bien cuidado. <strong>El mantenimiento preventivo</strong> es exactamente lo que lo mantiene así."
          : "Your site is well cared for. <strong>Preventive maintenance</strong> is exactly what keeps it that way.";
    } else if (score <= 55) {
      emoji = "🟡";
      title =
        lang === "es"
          ? "Tu sitio tiene riesgo moderado"
          : "Your site has moderate risk";
      sub =
        lang === "es"
          ? "Funciona, pero hay cosas que podrían fallar sin aviso."
          : "It works, but things could fail without warning.";
      estado = lang === "es" ? "Moderado" : "Moderate";
      siRompe = lang === "es" ? "Difícil de recuperar" : "Hard to recover";
      respaldo =
        b === 0
          ? lang === "es"
            ? "Confirmado"
            : "Confirmed"
          : lang === "es"
            ? "No confirmado"
            : "Not confirmed";
      rec = lang === "es" ? "Revisión este mes" : "Review this month";
      barColor = "rgba(240,160,60,1)";
      msg =
        lang === "es"
          ? "Un sitio sin mantenimiento es como un auto sin service. <strong>Funciona hasta que deja de funcionar</strong> — y siempre en el peor momento."
          : "A site without maintenance is like a car without a service. <strong>It works until it doesn't</strong> — always at the worst time.";
    } else {
      emoji = "🔴";
      title =
        lang === "es"
          ? "Tu sitio tiene riesgo alto"
          : "Your site has high risk";
      sub =
        lang === "es"
          ? "Hay condiciones que pueden causar problemas en cualquier momento."
          : "Conditions exist that could cause serious problems at any time.";
      estado = lang === "es" ? "Alto" : "High";
      siRompe =
        lang === "es" ? "Muy difícil sin backup" : "Very hard without backup";
      respaldo = lang === "es" ? "No confirmado" : "Not confirmed";
      rec = lang === "es" ? "Acción urgente" : "Urgent action needed";
      barColor = "rgba(255,80,60,1)";
      msg =
        lang === "es"
          ? "<strong>Riesgo alto</strong>. Sin backups y sin mantenimiento, un problema puede significar perder el sitio completo."
          : "<strong>High risk</strong>. Without backups and maintenance, a problem could mean losing the entire site.";
    }
    const setT = (id, val) => {
      const e = el.querySelector(id);
      if (e) e.textContent = val;
    };
    const setH = (id, val) => {
      const e = el.querySelector(id);
      if (e) e.innerHTML = val;
    };
    setT("#m-emoji", emoji);
    setT("#m-title", title);
    setT("#m-sub", sub);
    const rvs = el.querySelectorAll(".m-rv");
    if (rvs[0]) rvs[0].textContent = estado;
    if (rvs[1]) {
      rvs[1].textContent = siRompe;
      rvs[1].style.color = barColor;
    }
    if (rvs[2]) rvs[2].textContent = respaldo;
    if (rvs[3]) rvs[3].textContent = rec;
    setH("#m-msg", msg);
    const bar = el.querySelector("#m-bar");
    if (bar) {
      bar.style.width = score + "%";
      bar.style.background = barColor;
    }
  }

  useLayoutEffect(() => {
    animateIn(ref.current);
  }, []);
  useEffect(() => {
    calc();
  }, [lang]);

  return (
    <div
      className="co-page"
      ref={ref}
      style={{ "--co-accent": ACCENT, "--co-accent-rgb": ACCENT_RGB }}
    >
      <div
        className="co-orb co-orb-a"
        style={{ background: "rgba(45,200,160,1)" }}
      />
      <div
        className="co-orb co-orb-b"
        style={{ background: "rgba(20,130,100,1)" }}
      />
      <div
        className="co-orb co-orb-c"
        style={{ background: "rgba(80,220,180,1)" }}
      />
      <div className="co-grid-bg" />
      <div
        className="co-accent-line"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(45,200,160,.7),transparent)",
        }}
      />
      <div className="co-page-inner">
        <div className="co-page-top">
          <div className="co-calc-top">
            <div className="co-eyebrow-row">
              <span
                className="co-eyebrow-line"
                style={{ background: "rgba(45,200,160,.5)" }}
              />
              {c.eyebrow}
            </div>
            <div className="co-h1">
              <span className="co-h1-line">
                <span className="co-h1-inner slide">{c.title[0]}</span>
              </span>
              <span className="co-h1-line">
                <span
                  className="co-h1-inner slide"
                  style={{ color: ACCENT, animationDelay: ".12s" }}
                >
                  {c.title[1]}
                </span>
              </span>
            </div>
            <p className="co-desc">{c.desc}</p>
          </div>
        </div>
        <div className="co-calc-grid">
          <div className="co-inputs-col">
            {[
              ["m-update", c.q1, null, c.q1opts],
              ["m-impact", c.q2, null, c.q2opts],
              ["m-backup", c.q3, null, c.q3opts],
            ].map(([id, label, hint, opts], qi) => (
              <div className="co-q-block" key={qi}>
                <span className="co-q-label">{label}</span>
                {hint && <span className="co-q-hint">{hint}</span>}
                <div className="co-options-row" id={id}>
                  {opts.map((o, i) => (
                    <div
                      key={i}
                      className={`co-opt${o.sel ? " selected" : ""}`}
                      data-val={o.val}
                      onClick={(e) => {
                        selOpt(e.currentTarget, id, ref.current);
                        calc();
                      }}
                    >
                      <span className="co-opt-radio" />
                      <span className="co-opt-text">{o.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="co-result-col">
            <div
              className="co-result-card"
              style={{ borderColor: "rgba(45,200,160,0.18)" }}
            >
              <div className="co-result-glow" />
              <div className="co-semaphore">
                <span className="co-sem-emoji" id="m-emoji">
                  🟡
                </span>
                <div>
                  <div className="co-sem-title" id="m-title">
                    {lang === "es"
                      ? "Tu sitio tiene riesgo moderado"
                      : "Your site has moderate risk"}
                  </div>
                  <div className="co-sem-sub" id="m-sub">
                    {lang === "es"
                      ? "Funciona, pero hay cosas que podrían fallar sin aviso."
                      : "It works, but things could fail without warning."}
                  </div>
                </div>
              </div>
              <div className="co-bar-wrap">
                <div className="co-bar-labels">
                  <span>{c.barLow}</span>
                  <span>{c.barHigh}</span>
                </div>
                <div className="co-bar-track">
                  <div
                    className="co-bar-fill"
                    id="m-bar"
                    style={{ width: "52%", background: "rgba(240,160,60,1)" }}
                  />
                </div>
              </div>
              <div className="co-result-rows">
                {c.rows.map((label, i) => (
                  <div className="co-rr" key={i}>
                    <span className="co-rr-l">{label}</span>
                    <span className="co-rr-v m-rv">
                      {
                        [
                          "Moderado",
                          "Difícil de recuperar",
                          "No confirmado",
                          "Revisión este mes",
                        ][i]
                      }
                    </span>
                  </div>
                ))}
              </div>
              <div className="co-callout" id="m-msg">
                Un sitio sin mantenimiento es como un auto sin service.{" "}
                <strong>Funciona hasta que deja de funcionar</strong>.
              </div>
            </div>
            <div
              className="co-cta-strip"
              style={{
                borderColor: "rgba(45,200,160,0.16)",
                background: "rgba(45,200,160,0.03)",
              }}
            >
              <div>
                <p className="co-cta-strip-text">{c.ctaTitle}</p>
                <p className="co-cta-strip-sub">{c.ctaSub}</p>
              </div>
              <button
                className="co-cta-btn"
                style={{ background: ACCENT, color: "#020a08" }}
                onClick={() => onRequest("maintenance")}
              >
                {c.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS — Cyan
// ─────────────────────────────────────────────────────────────────────────────

function ModalTools({ onRequest, lang }) {
  const ref = useRef(null);
  const ACCENT = "rgba(80,180,255,1)";
  const ACCENT_RGB = "80,180,255";

  const c =
    lang === "es"
      ? {
          eyebrow: "TOOLS & AUTOMATION · Calculadora",
          title: ["¿Cuánto tiempo perdés", "haciendo lo mismo a mano?"],
          desc: "Sin tecnicismos. Elegí la tarea, ajustá la frecuencia y te mostramos exactamente cuánto recuperarías.",
          q1: "¿Qué tarea te consume más tiempo?",
          q1opts: [
            {
              val: "stock",
              label: "Llevar el control de stock o inventario",
              sel: true,
            },
            {
              val: "orders",
              label: "Registrar y hacer seguimiento de pedidos",
            },
            { val: "reports", label: "Armar reportes o planillas cada semana" },
            {
              val: "invoices",
              label: "Facturar o cargar datos de clientes a mano",
            },
          ],
          s1label: "¿Cuántas veces hacés esto por semana?",
          s1unit: "×",
          s1min: "1 vez",
          s1max: "30 veces",
          s2label: "¿Cuánto tardás cada vez?",
          s2unit: " min",
          s2min: "5 min",
          s2max: "2 horas",
          resultLabel: "perdidas por mes en esta tarea",
          rows: [
            "Tiempo por semana",
            "Tiempo por año",
            "Con automatización",
            "Tiempo recuperado",
          ],
          cta: "Consultar →",
          ctaSub: "Propuesta en 24–48h",
          ctaTitle: "Recuperá esas horas este mes",
        }
      : {
          eyebrow: "TOOLS & AUTOMATION · Calculator",
          title: [
            "How much time do you lose",
            "doing the same thing manually?",
          ],
          desc: "No jargon. Pick the task, set the frequency, and we'll show you exactly how much time you'd get back.",
          q1: "What task takes up most of your time?",
          q1opts: [
            {
              val: "stock",
              label: "Managing stock or inventory control",
              sel: true,
            },
            { val: "orders", label: "Recording and tracking orders" },
            {
              val: "reports",
              label: "Building reports or spreadsheets every week",
            },
            {
              val: "invoices",
              label: "Invoicing or entering client data manually",
            },
          ],
          s1label: "How many times do you do this per week?",
          s1unit: "×",
          s1min: "1 time",
          s1max: "30 times",
          s2label: "How long does it take each time?",
          s2unit: " min",
          s2min: "5 min",
          s2max: "2 hours",
          resultLabel: "lost per month on this task",
          rows: [
            "Time per week",
            "Time per year",
            "With automation",
            "Time recovered",
          ],
          cta: "Enquire →",
          ctaSub: "Proposal in 24–48h",
          ctaTitle: "Get those hours back this month",
        };

  function calc() {
    const el = ref.current;
    if (!el) return;
    const task = getVal("t-task", el) || "stock";
    const freqEl = el.querySelector("#t-freq");
    const durEl = el.querySelector("#t-dur");
    if (!freqEl || !durEl) return;
    const freq = parseInt(freqEl.value);
    const dur = parseInt(durEl.value);
    const perWeekM = freq * dur;
    const perMonthM = perWeekM * 4.3;
    const perMonthH = perMonthM / 60;
    const perYearH = Math.round(perMonthH * 12);
    const autoMin = Math.max(15, Math.round(perMonthM * 0.04));
    const fmt = (h) =>
      h >= 1 ? Math.round(h) + "h" : Math.round(h * 60) + "min";
    const fmtW = (m) => {
      const h = Math.floor(m / 60);
      const mn = m % 60;
      return h > 0 ? (mn > 0 ? h + "h " + mn + "min" : h + "h") : mn + "min";
    };
    const big = el.querySelector("#t-big");
    if (big) big.textContent = fmt(perMonthH);
    const rvs = el.querySelectorAll(".t-rv");
    if (rvs[0]) rvs[0].textContent = fmtW(perWeekM);
    if (rvs[1]) rvs[1].textContent = perYearH + "h";
    if (rvs[2]) {
      rvs[2].textContent =
        autoMin < 60
          ? "~" + autoMin + " min / mes"
          : "~" + Math.round(autoMin / 60) + "h / mes";
      rvs[2].style.color = ACCENT;
    }
    if (rvs[3]) {
      rvs[3].textContent =
        "~" +
        fmt(perMonthH - autoMin / 60) +
        (lang === "es" ? " libres" : " free");
      rvs[3].style.color = ACCENT;
    }
    const msgs = {
      stock:
        lang === "es"
          ? "Con <strong>control de stock automatizado</strong>, el sistema actualiza solo. Vos solo revisás cuando querés."
          : "With <strong>automated stock control</strong>, the system updates itself. You only check when you want to.",
      orders:
        lang === "es"
          ? "Con <strong>gestión de pedidos automatizada</strong>, cada pedido se registra solo sin cargar datos a mano."
          : "With <strong>automated order management</strong>, every order is logged automatically — no manual data entry.",
      reports:
        lang === "es"
          ? "Con <strong>reportes automáticos</strong>, los números se generan solos en el horario que definís."
          : "With <strong>automated reports</strong>, the numbers generate themselves on the schedule you set.",
      invoices:
        lang === "es"
          ? "Con <strong>facturación automatizada</strong>, cada venta genera su comprobante sin intervención manual."
          : "With <strong>automated invoicing</strong>, every sale generates its receipt without manual intervention.",
    };
    const msg = el.querySelector("#t-msg");
    if (msg) msg.innerHTML = msgs[task] || msgs.stock;
  }

  useLayoutEffect(() => {
    animateIn(ref.current);
  }, []);
  useEffect(() => {
    calc();
  }, [lang]);

  return (
    <div
      className="co-page"
      ref={ref}
      style={{ "--co-accent": ACCENT, "--co-accent-rgb": ACCENT_RGB }}
    >
      <div
        className="co-orb co-orb-a"
        style={{ background: "rgba(80,180,255,1)" }}
      />
      <div
        className="co-orb co-orb-b"
        style={{ background: "rgba(40,100,200,1)" }}
      />
      <div
        className="co-orb co-orb-c"
        style={{ background: "rgba(120,200,255,1)" }}
      />
      <div className="co-grid-bg" />
      <div
        className="co-accent-line"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(80,180,255,.7),transparent)",
        }}
      />
      <div className="co-page-inner">
        <div className="co-page-top">
          <div className="co-calc-top">
            <div className="co-eyebrow-row">
              <span
                className="co-eyebrow-line"
                style={{ background: "rgba(80,180,255,.5)" }}
              />
              {c.eyebrow}
            </div>
            <div className="co-h1">
              <span className="co-h1-line">
                <span className="co-h1-inner slide">{c.title[0]}</span>
              </span>
              <span className="co-h1-line">
                <span
                  className="co-h1-inner slide"
                  style={{ color: ACCENT, animationDelay: ".12s" }}
                >
                  {c.title[1]}
                </span>
              </span>
            </div>
            <p className="co-desc">{c.desc}</p>
          </div>
        </div>
        <div className="co-calc-grid">
          <div className="co-inputs-col">
            <div className="co-q-block">
              <span className="co-q-label">{c.q1}</span>
              <div className="co-options-row" id="t-task">
                {c.q1opts.map((o, i) => (
                  <div
                    key={i}
                    className={`co-opt${o.sel ? " selected" : ""}`}
                    data-val={o.val}
                    onClick={(e) => {
                      selOpt(e.currentTarget, "t-task", ref.current);
                      calc();
                    }}
                  >
                    <span className="co-opt-radio" />
                    <span className="co-opt-text">{o.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="co-slider-block">
              <div className="co-slider-top">
                <span className="co-slider-label">{c.s1label}</span>
                <span
                  className="co-slider-val"
                  id="t-fv"
                  style={{ color: ACCENT }}
                >
                  5{c.s1unit}
                </span>
              </div>
              <input
                id="t-freq"
                className="co-range"
                type="range"
                min="1"
                max="30"
                step="1"
                defaultValue="5"
                style={{ accentColor: ACCENT }}
                onInput={(e) => {
                  const v = e.currentTarget.value;
                  const el = ref.current.querySelector("#t-fv");
                  if (el) el.textContent = v + c.s1unit;
                  calc();
                }}
              />
              <div className="co-slider-labels">
                <span>{c.s1min}</span>
                <span>{c.s1max}</span>
              </div>
            </div>
            <div className="co-slider-block">
              <div className="co-slider-top">
                <span className="co-slider-label">{c.s2label}</span>
                <span
                  className="co-slider-val"
                  id="t-dv"
                  style={{ color: ACCENT }}
                >
                  20{c.s2unit}
                </span>
              </div>
              <input
                id="t-dur"
                className="co-range"
                type="range"
                min="5"
                max="120"
                step="5"
                defaultValue="20"
                style={{ accentColor: ACCENT }}
                onInput={(e) => {
                  const v = e.currentTarget.value;
                  const el = ref.current.querySelector("#t-dv");
                  if (el) el.textContent = v + c.s2unit;
                  calc();
                }}
              />
              <div className="co-slider-labels">
                <span>{c.s2min}</span>
                <span>{c.s2max}</span>
              </div>
            </div>
          </div>
          <div className="co-result-col">
            <div
              className="co-result-card"
              style={{ borderColor: "rgba(80,180,255,0.18)" }}
            >
              <div className="co-result-glow" />
              <div className="co-result-headline">
                <span
                  className="co-result-num"
                  id="t-big"
                  style={{ color: ACCENT }}
                >
                  7h
                </span>
                <span className="co-result-num-label">{c.resultLabel}</span>
              </div>
              <div className="co-result-rows">
                {c.rows.map((label, i) => (
                  <div className="co-rr" key={i}>
                    <span className="co-rr-l">{label}</span>
                    <span className="co-rr-v t-rv">
                      {["1h 40min", "86h", "~15 min / mes", "~7h libres"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="co-callout" id="t-msg">
                Con <strong>control de stock automatizado</strong>, el sistema
                actualiza solo.
              </div>
            </div>
            <div
              className="co-cta-strip"
              style={{
                borderColor: "rgba(80,180,255,0.16)",
                background: "rgba(80,180,255,0.03)",
              }}
            >
              <div>
                <p className="co-cta-strip-text">{c.ctaTitle}</p>
                <p className="co-cta-strip-sub">{c.ctaSub}</p>
              </div>
              <button
                className="co-cta-btn"
                style={{ background: ACCENT, color: "#020810" }}
                onClick={() => onRequest("tools")}
              >
                {c.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export default function ExtensionModals({
  activeId,
  onClose,
  onRequest,
  lang,
}) {
  useEffect(() => {
    if (!activeId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const topbar = document.querySelector(".topbar");
    if (topbar) topbar.style.visibility = "hidden";
    return () => {
      document.body.style.overflow = prev;
      const tb = document.querySelector(".topbar");
      if (tb) tb.style.visibility = "visible";
    };
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeId, onClose]);

  if (!activeId) return null;

  const backLabel = lang === "es" ? "Volver a Corexa" : "Back to Corexa";
  const props = { onClose, onRequest, lang };

  const closeBtn = createPortal(
    <button className="sm-close-fixed-back" onClick={onClose}>
      ← {backLabel}
    </button>,
    document.body,
  );

  return (
    <>
      {closeBtn}
      <div className="sm-overlay" role="dialog" aria-modal="true">
        {activeId === "audit" && <ModalAudit {...props} />}
        {activeId === "maintenance" && <ModalMaintenance {...props} />}
        {activeId === "tools" && <ModalTools {...props} />}
      </div>
    </>
  );
}
