import { useState } from "react";

function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const nextUrl = normalizeUrl(input);

    if (!nextUrl) {
      setError("Enter a website URL.");
      return;
    }

    try {
      new URL(nextUrl);
    } catch {
      setError("Enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/analyze?url=${encodeURIComponent(nextUrl)}`,
      );
      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Analysis failed");
      }

      setSubmittedUrl(data.url || nextUrl);
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not analyze this website.");
    } finally {
      setLoading(false);
    }
  }

  function onRequestAudit() {
    if (!result) return;

    const categories = result.categories
      .map((c) => `- ${c.label}: ${c.value}/100`)
      .join("\n");

    const issues = result.issues.map((i) => `- ${i}`).join("\n");

    const fullReport = `
Hi COREXA. I want an audit & restructure.

Website analyzed:
${submittedUrl}

Overall score:
${result.total}/100

Category scores:
${categories}

Issues detected:
${issues}

Page data:
Title: ${result.title || "Not detected"}
Meta description: ${result.metaDescription || "Not detected"}
Response time: ${result.responseTime ? result.responseTime + "ms" : "Unknown"}

Goal: __
`;

    const payload = {
      service: "Audit & Restructure",
      msg: fullReport.trim(),
    };

    sessionStorage.setItem("corexa_audit_request", JSON.stringify(payload));

    window.location.href = "/#contact";
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
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
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

                {result.responseTime ? (
                  <p className="analyzer__url">
                    Response time: {result.responseTime}ms
                  </p>
                ) : null}
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

                  <div className="analyzer__metaBlock">
                    <p className="eyebrow">PAGE DATA</p>
                    <p>
                      <strong>Title:</strong>{" "}
                      {result.title || "No title detected"}
                    </p>
                    <p>
                      <strong>Meta description:</strong>{" "}
                      {result.metaDescription || "No meta description detected"}
                    </p>
                  </div>

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
