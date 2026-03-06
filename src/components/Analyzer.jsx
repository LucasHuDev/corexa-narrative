import { useMemo, useState } from "react";

function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function fakeAnalyze(url) {
  const seed = url.length;

  const performance = Math.max(52, Math.min(94, 62 + (seed % 19)));
  const seo = Math.max(48, Math.min(96, 58 + ((seed * 3) % 23)));
  const structure = Math.max(55, Math.min(95, 61 + ((seed * 5) % 21)));
  const security = url.startsWith("https://") ? 92 : 64;
  const mobile = Math.max(50, Math.min(93, 57 + ((seed * 7) % 24)));

  const total = Math.round(
    (performance + seo + structure + security + mobile) / 5,
  );

  const issues = [];

  if (performance < 75) issues.push("Slow loading speed");
  if (seo < 75) issues.push("Weak SEO foundation");
  if (structure < 75) issues.push("Unclear information structure");
  if (security < 75) issues.push("Security setup could be improved");
  if (mobile < 75) issues.push("Mobile experience needs refinement");

  if (!issues.length) {
    issues.push("Strong base, but there is still room to improve conversion.");
  }

  return {
    total,
    categories: [
      { label: "Performance", value: performance },
      { label: "SEO", value: seo },
      { label: "Structure", value: structure },
      { label: "Security", value: security },
      { label: "Mobile", value: mobile },
    ],
    issues,
  };
}

function ScoreBar({ label, value }) {
  return (
    <div className="analyzer__metric">
      <div className="analyzer__metricTop">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="analyzer__bar">
        <div className="analyzer__barFill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function Analyzer() {
  const [input, setInput] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!submittedUrl) return null;
    return fakeAnalyze(submittedUrl);
  }, [submittedUrl]);

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    const nextUrl = normalizeUrl(input);

    if (!nextUrl) {
      setError("Enter a website URL.");
      return;
    }

    try {
      new URL(nextUrl);
      setSubmittedUrl(nextUrl);
    } catch {
      setError("Enter a valid URL.");
    }
  }

  function onRequestAudit() {
    const url = new URL(window.location.origin);
    url.searchParams.set("service", "Audit & Restructure");
    url.searchParams.set(
      "msg",
      `Hi COREXA. I want an audit & restructure.\n\nCurrent URL: ${submittedUrl}\nMain issue: __\nGoal: __`,
    );
    url.hash = "contact";
    window.location.assign(url.toString());
  }

  return (
    <section className="section analyzer" aria-label="Website Analyzer">
      <div className="sectionContent">
        <div className="container analyzer__inner">
          <p className="eyebrow">FREE ANALYSIS</p>
          <h1 className="analyzer__title">Analyze your website.</h1>
          <p className="analyzer__lead">
            Get a quick technical snapshot of performance, SEO, structure,
            security and mobile readiness.
          </p>

          <form className="analyzer__form" onSubmit={onSubmit}>
            <input
              type="text"
              className="input analyzer__input"
              placeholder="Enter website URL"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">
              Analyze
            </button>
          </form>

          {error ? <p className="analyzer__error">{error}</p> : null}

          {result ? (
            <div className="analyzer__result">
              <div className="analyzer__scoreCard">
                <p className="eyebrow">COREXA ANALYSIS</p>
                <div className="analyzer__score">{result.total}</div>
                <p className="analyzer__scoreLabel">Website Score</p>
                <p className="analyzer__url">{submittedUrl}</p>
              </div>

              <div className="analyzer__details">
                <div className="analyzer__metrics">
                  {result.categories.map((item) => (
                    <ScoreBar
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </div>

                <div className="analyzer__issues">
                  <p className="eyebrow">KEY FINDINGS</p>
                  <ul>
                    {result.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>

                  <div className="analyzer__actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={onRequestAudit}
                    >
                      Request a rebuild →
                    </button>

                    <a href="/" className="buildLink">
                      Back to COREXA →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
