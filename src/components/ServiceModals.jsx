import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

function ModalLaunch({ onClose, onRequest, lang }) {
  const ref = useRef(null);

  const c =
    lang === "es"
      ? {
          eyebrow: "SERVICIO 01",
          badge: "Entrega rápida",
          title: "Lanzamiento (WordPress).",
          desc: "Un sitio WordPress profesional construido bien desde el primer día. Arquitectura de tema limpia, SEO on-page correcto, imágenes optimizadas y una estructura que tu equipo puede gestionar sin tocar código.",
          forLabel: "Ideal para",
          forText:
            "Negocios locales, proveedores de servicios y marcas personales que necesitan presencia online creíble rápidamente.",
          inclTitle: "Qué incluye",
          items: [
            "Setup de WordPress y tema personalizado",
            "Hasta 6 secciones / páginas",
            "SEO foundations (meta, OG, sitemap)",
            "Layout responsive mobile-first",
            "Formulario de contacto con email routing",
            "Pase de rendimiento antes de la entrega",
          ],
          tlLabel: "Entrega estimada",
          tlValue: "5–8 días hábiles",
          fitTitle: "¿Es para vos?",
          yes: [
            "Necesitás presencia online en menos de 2 semanas",
            "Tu equipo actualiza contenido sin tocar código",
            "Sos un negocio local o proveedor de servicios",
            "Querés una base sólida que pueda crecer con el tiempo",
          ],
          no: [
            "Necesitás un diseño totalmente custom con interacciones únicas",
            "Tu sitio es una app web compleja o producto SaaS",
            "Querés propiedad total del código sin depender de una plataforma",
            "El rendimiento y las animaciones son centrales a tu marca",
          ],
          when: "Elegí esto cuando tenés un deadline y necesitás algo en vivo rápido sin sacrificar profesionalismo. WordPress te da un sitio manejable y listo para SEO desde el primer día. Si lo superás después, podemos migrarlo a un build custom sin fricción.",
          cta: "Solicitar este servicio →",
          ctaQuote: "Obtener cotización →",
          close: "Cerrar",
          backLabel: "← Volver a Corexa",
        }
      : {
          eyebrow: "CORE SERVICE 01",
          badge: "Fast delivery",
          title: "Launch (WordPress).",
          desc: "A professional WordPress site built right from day one. Clean theme architecture, on-page SEO foundations, optimised images, and a structure your team can manage without touching code.",
          forLabel: "Best for",
          forText:
            "Local businesses, service providers, and personal brands that need a credible online presence fast.",
          inclTitle: "What's included",
          items: [
            "Custom WordPress setup & theme",
            "Up to 6 sections / pages",
            "SEO foundations (meta, OG, sitemap)",
            "Mobile-first responsive layout",
            "Contact form with email routing",
            "Performance pass before delivery",
          ],
          tlLabel: "Estimated delivery",
          tlValue: "5–8 business days",
          fitTitle: "Is this right for you?",
          yes: [
            "You need a professional site live in under 2 weeks",
            "Your team needs to edit content without developer help",
            "You're a local business or service provider",
            "You want a solid, manageable base that can grow",
          ],
          no: [
            "You need a fully custom design with unique interactions",
            "Your site is a complex web app or SaaS product",
            "You want full code ownership with no platform dependency",
            "Performance and animation are core to your brand identity",
          ],
          when: "Choose this when you have a deadline and need something live fast without sacrificing professionalism. WordPress gives you a manageable, SEO-ready site from day one. If you outgrow it later, we can migrate to a custom build with zero friction.",
          cta: "Request this build →",
          ctaQuote: "Get a quote →",
          close: "Close",
          backLabel: "← Back to Corexa",
        };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(".lm-in");
    gsap.set(items, { opacity: 0, y: 16 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.065,
      ease: "power3.out",
      delay: 0.05,
    });
  }, []);

  return (
    <div className="sm-page sm-page--launch" ref={ref}>
      <div className="lm-grid" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="lm-grid-col" />
        ))}
      </div>
      <div className="sm-nav lm-in">
        <div className="sm-traffic" aria-hidden="true">
          <span className="sm-dot sm-dot--r" />
          <span className="sm-dot sm-dot--y" />
          <span className="sm-dot sm-dot--g" />
        </div>
        <span className="sm-nav-logo">
          Corexa<span>.</span>
        </span>
      </div>
      <div className="sm-hero">
        <div className="lm-badge lm-in">
          <span className="lm-badge-dot" />
          <span>{c.eyebrow}</span>
        </div>
        <h1 className="sm-h1 lm-in">{c.title}</h1>
        <p className="sm-desc lm-in">{c.desc}</p>
        <div className="sm-for lm-in">
          <span className="sm-for-label">{c.forLabel}</span>
          <p className="sm-for-text">{c.forText}</p>
        </div>
        <div className="sm-btns lm-in">
          <button
            className="sm-btn-p lm-btn-p"
            onClick={() => onRequest("launch")}
          >
            {c.cta}
          </button>
        </div>
      </div>
      <div className="sm-body">
        <p className="sm-section-label lm-in">{c.inclTitle}</p>
        <div className="lm-cards lm-in">
          {c.items.map((item, i) => (
            <div className="lm-card" key={i}>
              <div className="lm-card-num">0{i + 1}</div>
              <div className="lm-card-text">{item}</div>
            </div>
          ))}
        </div>
        <div className="sm-tl lm-in">
          <span className="sm-tl-label">{c.tlLabel}</span>
          <span className="sm-tl-value">{c.tlValue}</span>
        </div>
        <div className="sm-fit lm-in">
          <p className="sm-section-label">{c.fitTitle}</p>
          <div className="sm-fit-grid">
            <div className="sm-fit-col sm-fit-yes">
              <div className="sm-fit-head">
                <span className="sm-fit-icon">✓</span>
                <span className="sm-fit-title">
                  {lang === "es"
                    ? "Es para vos si..."
                    : "This is for you if..."}
                </span>
              </div>
              {c.yes.map((t, i) => (
                <div className="sm-fit-row" key={i}>
                  <span className="sm-fit-dot" />
                  <p className="sm-fit-txt">{t}</p>
                </div>
              ))}
            </div>
            <div className="sm-fit-col sm-fit-no">
              <div className="sm-fit-head">
                <span className="sm-fit-icon">✕</span>
                <span className="sm-fit-title">
                  {lang === "es" ? "No es para vos si..." : "Not for you if..."}
                </span>
              </div>
              {c.no.map((t, i) => (
                <div className="sm-fit-row" key={i}>
                  <span className="sm-fit-dot" />
                  <p className="sm-fit-txt">{t}</p>
                </div>
              ))}
            </div>
            <div className="sm-fit-col sm-fit-when">
              <div className="sm-fit-head">
                <span className="sm-fit-icon">→</span>
                <span className="sm-fit-title">
                  {lang === "es" ? "Cuándo elegirlo" : "When to choose this"}
                </span>
              </div>
              <p className="sm-fit-when-text">{c.when}</p>
            </div>
          </div>
        </div>
        <div className="lm-cta lm-in">
          <div>
            <p className="lm-cta-title">
              {lang === "es" ? "¿Listo para lanzar?" : "Ready to launch?"}
            </p>
            <p className="lm-cta-sub">
              {lang === "es"
                ? "Respondemos en 24–48h. Scope + timeline antes de empezar."
                : "Reply in 24–48h. Scope + timeline before we start."}
            </p>
          </div>
          <button
            className="sm-btn-p lm-btn-p"
            onClick={() => onRequest("launch")}
          >
            {c.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalCustom({ onClose, onRequest, lang }) {
  const canvasRef = useRef(null);
  const [typed, setTyped] = useState("");
  const titleFull =
    lang === "es" ? "Frontend personalizado." : "Custom Frontend.";

  const c =
    lang === "es"
      ? {
          eyebrow: "// core_service_02",
          title: titleFull,
          tags: [
            "HTML5",
            "CSS Custom",
            "Vanilla JS",
            "Sin CMS",
            "Deploy estático",
            "WCAG AA",
          ],
          desc: "Código hecho a mano. Sin frameworks que no pediste. Control total sobre cada píxel — construido para durar y fácil de extender por cualquier desarrollador.",
          items: [
            { name: "HTML5 semántico", type: "// markup accesible" },
            { name: "Sistema CSS custom", type: "// variables + responsive" },
            {
              name: "Interacciones Vanilla JS",
              type: "// sin overhead de framework",
            },
            {
              name: "Pipeline de assets",
              type: "// imágenes, fuentes, optimizado",
            },
            {
              name: "Accesibilidad WCAG AA",
              type: "// teclado + focus listos",
            },
            {
              name: "Package deploy-ready",
              type: "// netlify o cualquier CDN",
            },
          ],
          stats: [
            { val: "2400+", label: "Líneas de código limpio" },
            { val: "98", label: "Score de performance" },
            { val: "0", label: "Dependencias" },
          ],
          tlLabel: "Entrega",
          tlValue: "7–12",
          tlNote: "días hábiles",
          fitTitle: "// is_this_right_for_you()",
          yes: [
            "Querés propiedad total del código sin depender de una plataforma",
            "La precisión de diseño importa — tenés brand guidelines que seguir",
            "Necesitás un sitio rápido y liviano sin overhead de CMS",
            "Un desarrollador o agencia lo va a mantener largo plazo",
          ],
          no: [
            "Tu equipo necesita editar contenido sin tocar código",
            "Necesitás una app compleja con auth o datos en tiempo real",
            "Necesitás animaciones GSAP o arquitectura de componentes React",
            "Estás lanzando un SaaS que un equipo de devs va a escalar",
          ],
          when: "Elegí esto cuando necesitás máxima libertad de diseño sin comprometerte con un framework. La opción más limpia para landing pages y sitios de marketing donde el rendimiento importa — y donde un desarrollador gestiona las actualizaciones.",
          cta: "$ request_build →",
          close: "Cerrar",
        }
      : {
          eyebrow: "// core_service_02",
          title: titleFull,
          tags: [
            "HTML5",
            "CSS Custom",
            "Vanilla JS",
            "No CMS",
            "Static Deploy",
            "WCAG AA",
          ],
          desc: "Handcrafted code. No frameworks you didn't ask for. Full pixel-level control — built to last and easy for any developer to extend or maintain.",
          items: [
            { name: "Semantic HTML5", type: "// accessible markup" },
            { name: "Custom CSS system", type: "// variables + responsive" },
            {
              name: "Vanilla JS interactions",
              type: "// no framework overhead",
            },
            { name: "Asset pipeline", type: "// images, fonts, optimised" },
            {
              name: "WCAG AA accessibility",
              type: "// keyboard + focus ready",
            },
            { name: "Deploy-ready package", type: "// netlify or any CDN" },
          ],
          stats: [
            { val: "2400+", label: "Lines of clean code" },
            { val: "98", label: "Performance score" },
            { val: "0", label: "Dependencies" },
          ],
          tlLabel: "Delivery",
          tlValue: "7–12",
          tlNote: "business days",
          fitTitle: "// is_this_right_for_you()",
          yes: [
            "You want full code ownership with no platform dependency",
            "Design precision matters — you have brand guidelines to follow",
            "You need a fast, lightweight site with no CMS overhead",
            "A developer or agency will maintain it long-term",
          ],
          no: [
            "Your team needs to edit content without touching code",
            "You need a complex app with auth or real-time data",
            "You need GSAP animations or React component architecture",
            "You're launching a SaaS that a dev team will scale",
          ],
          when: "Choose this when you need maximum design freedom without committing to a framework. The cleanest option for landing pages and marketing sites where performance matters — and where a developer manages updates.",
          cta: "$ request_build →",
          close: "Close",
        };

  useEffect(() => {
    let i = 0;
    setTyped("");
    const iv = setInterval(() => {
      if (i <= titleFull.length) {
        setTyped(titleFull.slice(0, i));
        i++;
      } else clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    const CHARS = "HTMLCSSJSvar(){}[];=>functionreturnconst";
    const cols = Math.floor(canvas.width / 18);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    function draw() {
      ctx.fillStyle = "rgba(6,8,7,.055)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(126,232,84,.16)";
      ctx.font = "11px Courier New";
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * 18, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.97) drops[i] = 0;
        else drops[i] += 0.38;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="sm-page sm-page--custom">
      <canvas ref={canvasRef} className="cf-canvas" aria-hidden="true" />
      <div className="cf-scanlines" aria-hidden="true" />
      <div className="sm-nav" style={{ position: "relative", zIndex: 10 }}>
        <div className="sm-traffic" aria-hidden="true">
          <span className="sm-dot sm-dot--r" />
          <span className="sm-dot sm-dot--y" />
          <span className="sm-dot sm-dot--g" />
        </div>
        <span className="sm-nav-logo cf-logo">
          COREXA<span className="cf-cursor">_</span>
        </span>
        <div className="cf-nav-tags" aria-hidden="true">
          <span className="cf-tag-small">HTML</span>
          <span className="cf-tag-small">CSS</span>
          <span className="cf-tag-small">JS</span>
        </div>
      </div>
      <div className="sm-hero" style={{ position: "relative", zIndex: 1 }}>
        <p className="cf-eyebrow">{c.eyebrow}</p>
        <div className="cf-glitch-wrap">
          <h1 className="sm-h1 cf-h1">
            {typed}
            <span className="cf-cursor" aria-hidden="true">
              |
            </span>
          </h1>
          <div className="cf-h1-ghost cf-ghost-r" aria-hidden="true">
            {titleFull}
          </div>
          <div className="cf-h1-ghost cf-ghost-g" aria-hidden="true">
            {titleFull}
          </div>
        </div>
        <div className="cf-tags">
          {c.tags.map((t, i) => (
            <span className="cf-tag" key={i}>
              {t}
            </span>
          ))}
        </div>
        <p className="sm-desc cf-desc">{c.desc}</p>
        <button className="cf-cta-btn" onClick={() => onRequest("custom")}>
          {c.cta}
        </button>
      </div>
      <div className="sm-body" style={{ position: "relative", zIndex: 1 }}>
        <div className="cf-stats">
          {c.stats.map((s, i) => (
            <div className="cf-stat" key={i}>
              <span className="cf-stat-val">{s.val}</span>
              <span className="cf-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <p className="sm-section-label cf-slabel">// deliverables[]</p>
        <div className="cf-terminal">
          <div className="cf-terminal-bar">
            <span className="cf-t-dot cf-t-r" />
            <span className="cf-t-dot cf-t-y" />
            <span className="cf-t-dot cf-t-g" />
            <span className="cf-t-title">corexa — deliverables.sh</span>
          </div>
          <div className="cf-terminal-body">
            {c.items.map((item, i) => (
              <div className="cf-del-item" key={i}>
                <span className="cf-del-prompt">$</span>
                <span className="cf-del-name">{item.name}</span>
                <span className="cf-del-type">{item.type}</span>
                <span className="cf-del-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cf-tl-row">
          <div className="cf-tl-box">
            <p className="cf-tl-key">{c.tlLabel}</p>
            <p className="cf-tl-val">{c.tlValue}</p>
            <p className="cf-tl-note">{c.tlNote}</p>
          </div>
          <div className="cf-tl-box">
            <p className="cf-tl-key">
              {lang === "es" ? "Revisiones" : "Revisions"}
            </p>
            <p className="cf-tl-val">2x</p>
            <p className="cf-tl-note">
              {lang === "es" ? "incluidas" : "included"}
            </p>
          </div>
          <div className="cf-tl-box">
            <p className="cf-tl-key">Handoff</p>
            <p className="cf-tl-val">Full</p>
            <p className="cf-tl-note">
              {lang === "es" ? "docs + guía de deploy" : "docs + deploy guide"}
            </p>
          </div>
        </div>
        <p className="sm-section-label cf-slabel">{c.fitTitle}</p>
        <div className="sm-fit-grid">
          <div className="sm-fit-col sm-fit-yes cf-fit-yes">
            <div className="sm-fit-head">
              <span className="sm-fit-icon">✓</span>
              <span className="sm-fit-title">
                {lang === "es" ? "Es para vos si..." : "This is for you if..."}
              </span>
            </div>
            {c.yes.map((t, i) => (
              <div className="sm-fit-row" key={i}>
                <span className="sm-fit-dot" />
                <p className="sm-fit-txt">{t}</p>
              </div>
            ))}
          </div>
          <div className="sm-fit-col sm-fit-no cf-fit-no">
            <div className="sm-fit-head">
              <span className="sm-fit-icon">✕</span>
              <span className="sm-fit-title">
                {lang === "es" ? "No es para vos si..." : "Not for you if..."}
              </span>
            </div>
            {c.no.map((t, i) => (
              <div className="sm-fit-row" key={i}>
                <span className="sm-fit-dot" />
                <p className="sm-fit-txt">{t}</p>
              </div>
            ))}
          </div>
          <div className="sm-fit-col sm-fit-when cf-fit-when">
            <div className="sm-fit-head">
              <span className="sm-fit-icon">→</span>
              <span className="sm-fit-title">
                {lang === "es" ? "Cuándo elegirlo" : "When to choose this"}
              </span>
            </div>
            <p className="sm-fit-when-text">{c.when}</p>
          </div>
        </div>
        <div className="cf-cta-bar">
          <div>
            <p className="cf-cta-bar-title">
              {lang === "es" ? "Construyámoslo bien." : "Let's build it right."}
            </p>
            <p className="cf-cta-bar-sub">
              {lang === "es"
                ? "Sin retainers. Sin sorpresas. Respondemos en 24–48h."
                : "No retainers. No surprises. Reply in 24–48h."}
            </p>
          </div>
          <button className="cf-cta-btn" onClick={() => onRequest("custom")}>
            {c.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalPremium({ onClose, onRequest, lang }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const curRef = useRef(null);
  const ringRef = useRef(null);

  const c =
    lang === "es"
      ? {
          eyebrow: "SERVICIO 03",
          badge: "Cotización personalizada",
          kicker: "Servicio Premium",
          title: ["Premium", "System.", "Construido", "para escalar."],
          desc: "Un sistema web de nivel producto con narrativa scroll-driven, movimiento ingenierizado y arquitectura de componentes diseñada para rendir en el extremo superior del mercado.",
          statsData: [
            {
              id: "n1",
              val: 97,
              suffix: "",
              label: "Lighthouse promedio",
              sub: "en todos los builds",
            },
            {
              id: "n2",
              val: 40,
              suffix: "+",
              label: "Componentes",
              sub: "por sistema premium",
            },
            {
              id: "n3",
              val: 30,
              suffix: "d",
              label: "Soporte post-lanzamiento",
              sub: "incluido de base",
            },
            {
              id: "n4",
              val: 48,
              suffix: "h",
              label: "Primera respuesta",
              sub: "respuesta garantizada",
            },
          ],
          inclTitle: "Qué incluye",
          cards: [
            {
              num: "01",
              tag: "Core",
              title: "Arquitectura React + Vite",
              desc: "Sistema de componentes para escalar. Mantenible, extensible, completamente tuyo.",
            },
            {
              num: "02",
              tag: "Motion",
              title: "Sistema de motion GSAP",
              desc: "Animaciones scroll-driven, reveals de entrada, micro-interacciones que se ganan su lugar.",
            },
            {
              num: "03",
              tag: "System",
              title: "Sistema de design tokens",
              desc: "Variables CSS, escala tipográfica, spacing — consistente del primer componente al último.",
            },
            {
              num: "04",
              tag: "Global",
              title: "Listo para i18n",
              desc: "Estructura multiidioma integrada desde el inicio — no pegada después como parche.",
            },
            {
              num: "05",
              tag: "Performance",
              title: "Core Web Vitals",
              desc: "Performance presupuestado. Cada asset y animación medida contra métricas reales de usuario.",
            },
            {
              num: "06",
              tag: "Deploy",
              title: "Deploy Vercel + CI",
              desc: "Pipeline de deploy, entornos de preview y config de producción — listos desde el día uno.",
            },
          ],
          fitTitle: "¿Es para vos?",
          yes: [
            "Tu marca compite en el extremo superior y necesita verse así",
            "El movimiento y scroll interactions son centrales a la experiencia del producto",
            "Estás construyendo un sistema que un equipo de devs va a extender",
            "Necesitás multiidioma y arquitectura de componentes desde el día uno",
          ],
          no: [
            "Necesitás un sitio en vivo en menos de una semana",
            "Tu equipo de contenido gestiona todo sin un desarrollador",
            "Estás en etapa temprana y validando el negocio",
            "El presupuesto es la restricción principal — esto es una inversión",
          ],
          when: "Elegí Premium cuando el sitio en sí es parte de la experiencia del producto. Cuando alguien llegando a tu página debería sentir inmediatamente la calidad de lo que construís.",
          forKicker: "Ideal para",
          forTitle: "Estudios, agencias y productos SaaS",
          forText:
            "Construido para marcas que compiten en el extremo superior de su mercado. Cuando los templates genéricos no son una opción y cada píxel necesita ganarse su lugar en el sistema.",
          stack: [
            {
              tech: "React + Vite",
              desc: "Arquitectura de componentes",
              badge: "Core",
            },
            {
              tech: "GSAP ScrollTrigger",
              desc: "Movimiento scroll",
              badge: "Motion",
            },
            {
              tech: "Design tokens",
              desc: "Sistema de variables CSS",
              badge: "System",
            },
            { tech: "i18n provider", desc: "Multiidioma", badge: "Global" },
            {
              tech: "Vercel + CI",
              desc: "Pipeline de deploy",
              badge: "Deploy",
            },
          ],
          tl: [
            { key: "Entrega", big: "14–21", note: "días hábiles" },
            { key: "Revisiones", big: "3x", note: "incluidas" },
            { key: "Soporte", big: "30d", note: "post-lanzamiento" },
            { key: "Handoff", big: "Full", note: "docs + deploy" },
          ],
          ctaPretitle: "Empezá la conversación",
          ctaTitle: ["Todo proyecto se", "cotiza junto."],
          ctaSub:
            "No hacemos listas de precios — hacemos conversaciones. Contanos qué estás construyendo y te decimos exactamente qué implica, por qué cuesta lo que cuesta, y qué recibís a cambio.",
          steps: [
            "Mandás un brief — tan detallado o vago como tengas",
            "Respondemos en 24–48h con scope, timeline y cotización clara",
            "Vos decidís — sin presión, sin lock-in, sin sorpresas",
          ],
          cta: "Obtener cotización →",
          ctaNote: "Sin compromiso requerido",
          pills: ["Respuesta en 24–48h", "Scope primero", "Precio fijo"],
          close: "Cerrar",
        }
      : {
          eyebrow: "CORE SERVICE 03",
          badge: "Custom scoped",
          kicker: "Premium System",
          title: ["Premium", "System.", "Built", "to scale."],
          desc: "A product-grade web system with scroll-driven narrative, engineered motion, and component architecture designed to perform at the absolute top end of the market.",
          statsData: [
            {
              id: "n1",
              val: 97,
              suffix: "",
              label: "Avg. Lighthouse",
              sub: "across all builds",
            },
            {
              id: "n2",
              val: 40,
              suffix: "+",
              label: "Components built",
              sub: "per premium system",
            },
            {
              id: "n3",
              val: 30,
              suffix: "d",
              label: "Post-launch support",
              sub: "included as standard",
            },
            {
              id: "n4",
              val: 48,
              suffix: "h",
              label: "First reply",
              sub: "guaranteed response",
            },
          ],
          inclTitle: "What's included",
          cards: [
            {
              num: "01",
              tag: "Core",
              title: "React + Vite architecture",
              desc: "Component system built to scale. Maintainable, extensible, owned completely by your team.",
            },
            {
              num: "02",
              tag: "Motion",
              title: "GSAP motion system",
              desc: "Scroll-driven animations, entrance reveals, micro-interactions — motion that earns its place.",
            },
            {
              num: "03",
              tag: "System",
              title: "Design token system",
              desc: "CSS variables, typography scale, spacing — consistent from first component to last.",
            },
            {
              num: "04",
              tag: "Global",
              title: "i18n ready",
              desc: "Multi-language structure baked in from the start. Your site, any language, zero friction.",
            },
            {
              num: "05",
              tag: "Performance",
              title: "Core Web Vitals",
              desc: "Performance budgeted. Every asset and animation measured against real user metrics.",
            },
            {
              num: "06",
              tag: "Deploy",
              title: "Vercel deploy + CI",
              desc: "Pipeline, preview environments, and production config — ready and running from day one.",
            },
          ],
          fitTitle: "Is this right for you?",
          yes: [
            "Your brand competes at the top end and needs to look like it",
            "Motion and scroll interactions are core to the product experience",
            "You're building a system a dev team will extend long-term",
            "You need multi-language and architecture from day one",
          ],
          no: [
            "You need a site live in under a week",
            "Your content team manages everything without a developer",
            "You're early-stage and still validating the business",
            "You need a quick deliverable, not a long-term system",
          ],
          when: "Choose Premium when the site itself is part of the product. When someone landing on your page should immediately feel the quality of what you build.",
          forKicker: "Best for",
          forTitle: "Studios, agencies & SaaS products",
          forText:
            "Built for brands competing at the top end of their market. When generic templates aren't an option and every pixel needs to earn its place in the system.",
          stack: [
            {
              tech: "React + Vite",
              desc: "Component architecture",
              badge: "Core",
            },
            {
              tech: "GSAP ScrollTrigger",
              desc: "Scroll motion",
              badge: "Motion",
            },
            {
              tech: "Design tokens",
              desc: "CSS variable system",
              badge: "System",
            },
            { tech: "i18n provider", desc: "Multi-language", badge: "Global" },
            { tech: "Vercel + CI", desc: "Deploy pipeline", badge: "Deploy" },
          ],
          tl: [
            { key: "Delivery", big: "14–21", note: "business days" },
            { key: "Revisions", big: "3x", note: "included" },
            { key: "Support", big: "30d", note: "post-launch" },
            { key: "Handoff", big: "Full", note: "docs + deploy" },
          ],
          ctaPretitle: "Start the conversation",
          ctaTitle: ["Every project is", "scoped together."],
          ctaSub:
            "We don't do price lists — we do conversations. Tell us what you're building and we'll tell you exactly what it takes, why it costs what it costs, and what you'll get in return.",
          steps: [
            "You send a brief — as detailed or as vague as you have",
            "We reply in 24–48h with scope, timeline, and a clear quote",
            "You decide — no pressure, no lock-in, no surprises",
          ],
          cta: "Get a quote →",
          ctaNote: "No commitment required",
          pills: ["24–48h reply", "Scope first", "Fixed price"],
          close: "Close",
        };

  useEffect(() => {
    const root = rootRef.current;
    const cur = curRef.current;
    const ring = ringRef.current;
    if (!root || !cur || !ring) return;
    let mx = 300,
      my = 300,
      rx = 300,
      ry = 300;
    const onMove = (e) => {
      const b = root.getBoundingClientRect();
      mx = e.clientX - b.left;
      my = e.clientY - b.top;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";
    };
    const onLeave = () => {
      cur.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      cur.style.opacity = "1";
      ring.style.opacity = "1";
    };
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("mouseenter", onEnter);
    let raf;
    const loop = () => {
      rx += (mx - rx) * 0.09;
      ry += (my - ry) * 0.09;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const cur = curRef.current;
    const ring = ringRef.current;
    if (!root) return;
    const cleanups = [];
    root.querySelectorAll(".pm-card-3d").forEach((card) => {
      let raf,
        tx = 0,
        ty = 0,
        cx = 50,
        cy = 50,
        tX = 0,
        tY = 0,
        tCX = 50,
        tCY = 50,
        hovered = false;
      const onEnter = () => {
        hovered = true;
        if (cur) {
          cur.classList.add("pm-cur-big");
          ring.classList.add("pm-ring-big");
        }
      };
      const onMove = (e) => {
        const b = card.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        tX = (px - 0.5) * 22;
        tY = -(py - 0.5) * 16;
        tCX = px * 100;
        tCY = py * 100;
      };
      const onLeave = () => {
        hovered = false;
        tX = 0;
        tY = 0;
        tCX = 50;
        tCY = 50;
        if (cur) {
          cur.classList.remove("pm-cur-big");
          ring.classList.remove("pm-ring-big");
        }
      };
      const loop = () => {
        tx += (tX - tx) * 0.12;
        ty += (tY - ty) * 0.12;
        cx += (tCX - cx) * 0.12;
        cy += (tCY - cy) * 0.12;
        card.style.transform = `perspective(900px) rotateY(${tx}deg) rotateX(${ty}deg) translateZ(${hovered ? 12 : 0}px)`;
        card.style.boxShadow = hovered
          ? `0 ${20 + Math.abs(ty) * 2}px ${50 + Math.abs(tx) * 2}px rgba(0,0,0,.65), 0 0 0 1px rgba(200,180,255,.12)`
          : "";
        const spot = card.querySelector(".pm-card-spot");
        if (spot) {
          spot.style.setProperty("--cx", cx + "%");
          spot.style.setProperty("--cy", cy + "%");
          spot.style.opacity = hovered ? "1" : "0";
        }
        raf = requestAnimationFrame(loop);
      };
      loop();
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    root.querySelectorAll("[data-pm-cur]").forEach((el) => {
      const e1 = () => {
        if (cur) cur.classList.add("pm-cur-big");
        if (ring) ring.classList.add("pm-ring-big");
      };
      const e2 = () => {
        if (cur) cur.classList.remove("pm-cur-big");
        if (ring) ring.classList.remove("pm-ring-big");
      };
      el.addEventListener("mouseenter", e1);
      el.addEventListener("mouseleave", e2);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", e1);
        el.removeEventListener("mouseleave", e2);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = root.offsetWidth;
      canvas.height = root.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const N = 65;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: 0.4 + Math.random() * 1.0,
      o: 0.04 + Math.random() * 0.09,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,184,255,${p.o})`;
        ctx.fill();
      });
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 88) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(180,140,255,${0.055 * (1 - d / 88)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const timer = setTimeout(() => {
      c.statsData.forEach(({ id, val, suffix }) => {
        const el = root.querySelector(`#sm-${id}`);
        if (!el) return;
        let st = null;
        const step = (ts) => {
          if (!st) st = ts;
          const p = Math.min((ts - st) / 1400, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * val) + (suffix || "");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <div className="sm-page sm-page--premium" ref={rootRef}>
      <canvas ref={canvasRef} className="pm-canvas" aria-hidden="true" />
      <div className="pm-orb pm-orb-a" aria-hidden="true" />
      <div className="pm-orb pm-orb-b" aria-hidden="true" />
      <div className="pm-cur" ref={curRef} aria-hidden="true" />
      <div className="pm-ring" ref={ringRef} aria-hidden="true" />
      <div className="pm-accent-line" aria-hidden="true" />
      <div
        className="sm-nav pm-nav"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="sm-traffic" aria-hidden="true">
          <span className="sm-dot sm-dot--r" />
          <span className="sm-dot sm-dot--y" />
          <span className="sm-dot sm-dot--g" />
        </div>
        <div className="pm-nav-pill">
          <span className="pm-nav-dot" />
          <span className="pm-nav-label">{c.kicker}</span>
        </div>
      </div>
      <div
        className="sm-hero pm-hero"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="pm-kicker-row">
          <span className="pm-kicker-line" />
          <span className="pm-kicker-txt">{c.eyebrow}</span>
          <span className="pm-kicker-badge">{c.badge}</span>
        </div>
        <div className="pm-headline">
          <div className="pm-headline-row">
            <span
              className="pm-hw pm-hw-solid"
              style={{ animationDelay: ".04s" }}
            >
              {c.title[0]}
            </span>
            <span
              className="pm-hw pm-hw-outline"
              style={{ animationDelay: ".16s" }}
            >
              {c.title[1]}
            </span>
          </div>
          <div className="pm-headline-row">
            <span
              className="pm-hw pm-hw-grad"
              style={{ animationDelay: ".30s" }}
            >
              {c.title[2]}
            </span>
            <span
              className="pm-hw pm-hw-ghost"
              style={{ animationDelay: ".42s" }}
            >
              {c.title[3]}
            </span>
          </div>
        </div>
        <p className="sm-desc pm-desc">{c.desc}</p>
        <div className="pm-numbers">
          {c.statsData.map((s) => (
            <div className="pm-num-cell" key={s.id}>
              <span className="pm-num-big" id={`sm-${s.id}`}>
                0{s.suffix}
              </span>
              <span className="pm-num-label">{s.label}</span>
              <span className="pm-num-sub">{s.sub}</span>
            </div>
          ))}
        </div>
        <div className="sm-btns">
          <button
            className="pm-btn-p"
            onClick={() => onRequest("premium")}
            data-pm-cur
          >
            {c.cta}
          </button>
          <button className="pm-btn-g" data-pm-cur>
            {lang === "es" ? "Ver casos de estudio" : "View case studies"}
          </button>
        </div>
      </div>
      <div className="pm-marquee-wrap" aria-hidden="true">
        <div className="pm-marquee">
          {[
            "React + Vite",
            "GSAP ScrollTrigger",
            "Design Tokens",
            "i18n Ready",
            "Core Web Vitals",
            "Vercel CI/CD",
            "Motion System",
            "Component Architecture",
            "React + Vite",
            "GSAP ScrollTrigger",
            "Design Tokens",
            "i18n Ready",
            "Core Web Vitals",
            "Vercel CI/CD",
            "Motion System",
            "Component Architecture",
          ].map((item, i) => (
            <span className="pm-mq-item" key={i}>
              {item}
              <span className="pm-mq-sep" />
            </span>
          ))}
        </div>
      </div>
      <div
        className="sm-body pm-body"
        style={{ position: "relative", zIndex: 1 }}
      >
        <p className="sm-section-label pm-slabel">{c.inclTitle}</p>
        <div className="pm-cards">
          {c.cards.map((card, i) => (
            <div className="pm-card-3d" key={i} data-pm-cur>
              <div className="pm-card-spot" />
              <div className="pm-card-inner">
                <div className="pm-card-row">
                  <span className="pm-card-num">{card.num}</span>
                  <span className="pm-card-tag">{card.tag}</span>
                </div>
                <p className="pm-card-title">{card.title}</p>
                <p className="pm-card-desc">{card.desc}</p>
                <div className="pm-card-footer">
                  <span className="pm-card-line" />
                  <span className="pm-card-arrow">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="sm-section-label pm-slabel">{c.fitTitle}</p>
        <div className="sm-fit-grid pm-fit-grid">
          <div className="sm-fit-col sm-fit-yes pm-fit-yes">
            <div className="sm-fit-head">
              <span className="sm-fit-icon">✓</span>
              <span className="sm-fit-title">
                {lang === "es" ? "Es para vos si..." : "This is for you if..."}
              </span>
            </div>
            {c.yes.map((t, i) => (
              <div className="sm-fit-row" key={i}>
                <span className="sm-fit-dot" />
                <p className="sm-fit-txt">{t}</p>
              </div>
            ))}
          </div>
          <div className="sm-fit-col sm-fit-no pm-fit-no">
            <div className="sm-fit-head">
              <span className="sm-fit-icon">✕</span>
              <span className="sm-fit-title">
                {lang === "es" ? "No es para vos si..." : "Not for you if..."}
              </span>
            </div>
            {c.no.map((t, i) => (
              <div className="sm-fit-row" key={i}>
                <span className="sm-fit-dot" />
                <p className="sm-fit-txt">{t}</p>
              </div>
            ))}
          </div>
          <div className="sm-fit-col sm-fit-when pm-fit-when">
            <div className="sm-fit-head">
              <span className="sm-fit-icon">→</span>
              <span className="sm-fit-title">
                {lang === "es" ? "Cuándo elegirlo" : "When to choose this"}
              </span>
            </div>
            <p className="sm-fit-when-text">{c.when}</p>
          </div>
        </div>
        <div className="pm-info-grid">
          <div>
            <p className="sm-section-label pm-slabel">
              {lang === "es" ? "Para quién es" : "Who this is for"}
            </p>
            <div className="pm-for">
              <p className="pm-for-kicker">{c.forKicker}</p>
              <p className="pm-for-title">{c.forTitle}</p>
              <p className="pm-for-text">{c.forText}</p>
            </div>
          </div>
          <div>
            <p className="sm-section-label pm-slabel">
              {lang === "es" ? "Stack del sistema" : "System stack"}
            </p>
            <div className="pm-stack">
              {c.stack.map((s, i) => (
                <div className="pm-stack-row" key={i} data-pm-cur>
                  <span className="pm-stack-tech">{s.tech}</span>
                  <span className="pm-stack-desc">{s.desc}</span>
                  <span className="pm-stack-badge">{s.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="sm-section-label pm-slabel">
          {lang === "es" ? "Timeline y alcance" : "Timeline & scope"}
        </p>
        <div className="pm-tl">
          {c.tl.map((t, i) => (
            <div className="pm-tl-cell" key={i} data-pm-cur>
              <p className="pm-tl-key">{t.key}</p>
              <p className="pm-tl-big">{t.big}</p>
              <p className="pm-tl-note">{t.note}</p>
            </div>
          ))}
        </div>
        <div className="pm-cta">
          <div className="pm-cta-bg" aria-hidden="true" />
          <div className="pm-cta-grid-bg" aria-hidden="true" />
          <div className="pm-cta-inner">
            <div className="pm-cta-left">
              <p className="pm-cta-pretitle">{c.ctaPretitle}</p>
              <p className="pm-cta-title">
                {c.ctaTitle[0]}
                <br />
                <span>{c.ctaTitle[1]}</span>
              </p>
              <p className="pm-cta-sub">{c.ctaSub}</p>
              <div className="pm-cta-steps">
                {c.steps.map((s, i) => (
                  <div className="pm-cta-step" key={i}>
                    <span className="pm-cta-step-num">{i + 1}</span>
                    <span className="pm-cta-step-txt">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pm-cta-right">
              <button
                className="pm-cta-btn"
                onClick={() => onRequest("premium")}
                data-pm-cur
              >
                {c.cta}
              </button>
              <span className="pm-cta-note">{c.ctaNote}</span>
              <div className="pm-cta-pills">
                {c.pills.map((p, i) => (
                  <span className="pm-cta-pill" key={i}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceModals({ activeId, onClose, onRequest, lang }) {
  useEffect(() => {
    if (!activeId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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

  const backLabel = lang === "es" ? "← Volver a Corexa" : "← Back to Corexa";
  const props = { onClose, onRequest, lang };

  return (
    <div className="sm-overlay" role="dialog" aria-modal="true">
      <button className="sm-close-fixed-back" onClick={onClose}>
        ← {lang === "es" ? "Volver a Corexa" : "Back to Corexa"}
      </button>
      {activeId === "launch" && <ModalLaunch {...props} />}
      {activeId === "custom" && <ModalCustom {...props} />}
      {activeId === "premium" && <ModalPremium {...props} />}
    </div>
  );
}
