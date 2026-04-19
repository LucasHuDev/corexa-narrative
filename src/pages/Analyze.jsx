import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import useH2Reveal from "../utils/useH2Reveal.js";
import { useT } from "../i18n/I18nProvider";
import { t as Trans } from "../i18n/translations";

/* ── Constants ── */
const CATEGORIES = [
  { key: "Performance", icon: "bolt", trans: "performance" },
  { key: "SEO", icon: "search", trans: "seo" },
  { key: "Mobile", icon: "phone", trans: "mobile" },
  { key: "Design & UX", icon: "palette", trans: "design" },
  { key: "Copywriting", icon: "edit", trans: "copy" },
  { key: "Conversion", icon: "target", trans: "conversion" },
];

const LOADING_STEPS = [
  "Fetching your site...",
  "Analyzing performance...",
  "Checking SEO signals...",
  "Reviewing mobile experience...",
  "Evaluating copy & conversion...",
  "Generating report...",
];

function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function scoreColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
}

/* ── SVG icons (inline, tiny) ── */
function CategoryIcon({ type }) {
  const icons = {
    bolt: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    ),
    phone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
    ),
    palette: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    ),
    target: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
    ),
  };
  return <span className="az-cat-icon">{icons[type]}</span>;
}

/* ── Score ring (SVG) ── */
function ScoreRing({ score, size = 140 }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} className="az-score-ring">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="#fff" fontSize={size * 0.3} fontFamily="var(--font-display)" fontWeight="600">
        {score}
      </text>
    </svg>
  );
}

/* ── PDF Generator ── */
function generatePDF(report) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const MX = 20;
  const contentW = W - MX * 2;

  function drawPageBase(doc) {
    doc.setFillColor(2, 2, 2);
    doc.rect(0, 0, W, H, "F");
    // Logo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("COREXA", MX, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("STUDIO", MX + doc.getTextWidth("COREXA") + 1, 15);
    // Line
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(MX, 20, W - MX, 20);
  }

  // ── PAGE 1: Cover ──
  drawPageBase(doc);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text("WEBSITE", MX, 80);
  doc.text("AUDIT REPORT", MX, 95);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.text(report.url, MX, 115);

  // Score circle (simplified as text)
  const sc = report.overallScore;
  const [sr, sg, sb] = sc >= 75 ? [34, 197, 94] : sc >= 50 ? [234, 179, 8] : [239, 68, 68];
  doc.setFontSize(64);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(sr, sg, sb);
  doc.text(String(sc), W / 2, 170, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(140, 140, 140);
  doc.text("/ 100", W / 2 + 28, 170, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text("Overall Score", W / 2, 182, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), MX, 220);

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text("Prepared by CorexaStudio \u2014 corexastudio.com", MX, 270);

  // ── PAGES 2-7: One per category ──
  report.categories.forEach((cat, i) => {
    doc.addPage();
    drawPageBase(doc);

    const catSc = cat.score;
    const [cr, cg, cb] = catSc >= 75 ? [34, 197, 94] : catSc >= 50 ? [234, 179, 8] : [239, 68, 68];

    // Category number + name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`0${i + 1}`, MX, 40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(cat.name.toUpperCase(), MX, 52);

    // Score
    doc.setFontSize(48);
    doc.setTextColor(cr, cg, cb);
    doc.text(String(catSc), W - MX, 52, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("/ 100", W - MX, 60, { align: "right" });

    // Score bar
    const barY = 68;
    doc.setFillColor(30, 30, 30);
    doc.roundedRect(MX, barY, contentW, 4, 2, 2, "F");
    doc.setFillColor(cr, cg, cb);
    doc.roundedRect(MX, barY, contentW * (catSc / 100), 4, 2, 2, "F");

    // Findings
    let y = 86;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("FINDINGS", MX, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    cat.findings.forEach((f) => {
      if (y > 240) return;
      const icon = f.type === "good" ? "\u2713" : "\u2717";
      const [fr, fg, fb] = f.type === "good" ? [34, 197, 94] : [239, 68, 68];
      doc.setTextColor(fr, fg, fb);
      doc.text(icon, MX, y);
      doc.setTextColor(200, 200, 200);
      const lines = doc.splitTextToSize(f.text, contentW - 10);
      doc.text(lines, MX + 8, y);
      y += lines.length * 5 + 4;
    });

    // Recommendations
    y += 6;
    if (y < 230) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("RECOMMENDATIONS", MX, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(180, 180, 180);
      cat.recommendations.forEach((rec) => {
        if (y > 260) return;
        const lines = doc.splitTextToSize(`\u2022  ${rec}`, contentW);
        doc.text(lines, MX, y);
        y += lines.length * 5 + 3;
      });
    }
  });

  // ── LAST PAGE: CTA ──
  doc.addPage();
  drawPageBase(doc);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text("READY TO", MX, 100);
  doc.text("FIX THIS?", MX, 116);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.text("corexastudio@gmail.com", MX, 145);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("corexastudio.com", MX, 158);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text("COREXA STUDIO", MX, 270);

  // Save
  const slug = report.url.replace(/https?:\/\//, "").replace(/[^a-z0-9]/gi, "-").replace(/-+$/, "");
  doc.save(`audit-${slug}.pdf`);
}

/* ── Main Component ── */
export default function Analyze() {
  useH2Reveal();
  const T = useT();

  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState("input"); // input | loading | results | error
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  // Loading step animation
  useEffect(() => {
    if (phase !== "loading") return;
    setLoadingStep(0);
    const iv = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 1500);
    return () => clearInterval(iv);
  }, [phase]);

  // Scroll to results when report arrives
  useEffect(() => {
    if (phase === "results" && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [phase]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setReport(null);

    const normalized = normalizeUrl(url);
    if (!normalized) { setError(T(Trans.analyze.urlError)); return; }
    try { new URL(normalized); } catch { setError(T(Trans.analyze.urlInvalid)); return; }

    setPhase("loading");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Analysis failed");

      setReport(data);
      setPhase("results");
    } catch (err) {
      setError(err.message || "Could not analyze this website.");
      setPhase("error");
    }
  }

  return (
    <>
      {/* ── HERO / INPUT ── */}
      <section className="az-hero" aria-label="Website Analyzer">
        <div className="container az-hero__inner">
          <span className="section-label" aria-hidden="true">{T(Trans.analyze.sectionLabel)}</span>

          <h1 className="az-hero__title">
            {T(Trans.analyze.title)}
          </h1>
          <p className="az-hero__sub">
            {T(Trans.analyze.subtitle)}
          </p>

          <form className="az-form" onSubmit={onSubmit}>
            <div className="az-form__row">
              <input
                type="url"
                className="az-form__input"
                placeholder={T(Trans.analyze.urlPlaceholder)}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={phase === "loading"}
                autoFocus
              />
              <button
                type="submit"
                className="az-form__btn"
                disabled={phase === "loading"}
              >
                {phase === "loading" ? T(Trans.analyze.analyzing) : T(Trans.analyze.cta)}
              </button>
            </div>
            {(error || phase === "error") && (
              <p className="az-form__error">{error}</p>
            )}
          </form>

          <div className="az-cats">
            {CATEGORIES.map((c) => (
              <div className="az-cats__item" key={c.key}>
                <CategoryIcon type={c.icon} />
                <span>{T(Trans.analyze.cats[c.trans])}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOADING ── */}
      {phase === "loading" && (
        <section className="az-loading" aria-label="Analyzing">
          <div className="container az-loading__inner">
            <div className="az-loading__bar">
              <div
                className="az-loading__fill"
                style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="az-loading__text">{LOADING_STEPS[loadingStep]}</p>
          </div>
        </section>
      )}

      {/* ── RESULTS ── */}
      {phase === "results" && report && (
        <section className="az-results" ref={resultsRef} aria-label="Audit Results">
          <div className="container az-results__inner">

            {/* Header */}
            <div className="az-results__header">
              <div className="az-results__meta">
                <span className="section-label" aria-hidden="true">{T(Trans.analyze.reportSection)}</span>
                <h2 className="az-results__url">{report.url}</h2>
                <p className="az-results__date">
                  {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <ScoreRing score={report.overallScore} />
            </div>

            {/* Categories */}
            <div className="az-categories">
              {report.categories.map((cat, i) => {
                const color = scoreColor(cat.score);
                return (
                  <div className="az-cat" key={cat.name}>
                    <div className="az-cat__head">
                      <div className="az-cat__title-row">
                        <span className="az-cat__num">0{i + 1}</span>
                        <h3 className="az-cat__name">{cat.name}</h3>
                      </div>
                      <span className="az-cat__score" style={{ color }}>{cat.score}</span>
                    </div>

                    <div className="az-cat__bar">
                      <div className="az-cat__bar-fill" style={{ width: `${cat.score}%`, background: color }} />
                    </div>

                    <ul className="az-cat__findings">
                      {cat.findings.map((f, j) => (
                        <li key={j} className={`az-finding az-finding--${f.type}`}>
                          <span className="az-finding__icon">{f.type === "good" ? "\u2713" : "\u2717"}</span>
                          {f.text}
                        </li>
                      ))}
                    </ul>

                    {cat.recommendations.length > 0 && (
                      <div className="az-cat__recs">
                        <p className="az-cat__recs-title">{T(Trans.analyze.recommendations)}</p>
                        <ul>
                          {cat.recommendations.map((rec, j) => (
                            <li key={j} className="az-rec">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="az-cta">
              <h2 className="az-cta__title">{T(Trans.analyze.ctaTitle)}</h2>
              <p className="az-cta__sub">{T(Trans.analyze.ctaSub)}</p>
              <div className="az-cta__actions">
                <Link
                  to="/contact?service=audit"
                  className="btn-primary az-cta__btn"
                  data-cursor="cta"
                >
                  {T(Trans.analyze.getFixed)}
                </Link>
                <button
                  className="az-cta__download"
                  onClick={() => generatePDF(report)}
                  type="button"
                >
                  {T(Trans.analyze.downloadPdf)}
                </button>
              </div>
            </div>

          </div>
        </section>
      )}
    </>
  );
}
