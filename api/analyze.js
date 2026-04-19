// Lightweight, real (non-AI) website analyzer.
//
// Fetches the URL server-side, inspects headers + raw HTML, and scores six
// categories using objective signals. Calibrated so well-built professional
// sites land in the 85-95 range and only genuinely deficient sites fall below.
//
// SPA-aware: when the response is a JS-only shell, copy/conversion stop
// penalising the empty body and start scoring on meta-level signals instead.

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 CorexaAnalyzer";

const clamp = (n) => Math.max(30, Math.min(100, Math.round(n)));

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Heuristic: small HTML body + big JS bundles + root mount node.
function detectSpa(html, text) {
  const wordCount = text.split(" ").filter(Boolean).length;
  const hasMountNode =
    /<div[^>]+id=["'](?:root|app|__next|__nuxt|svelte)["']/i.test(html) ||
    /<body[^>]*>\s*<div[^>]*>\s*<\/div>/i.test(html);
  const hasFrameworkBundle =
    /<script[^>]+src=["'][^"']*(?:_next|nuxt|vite|chunks?\/|main\.[\w-]+\.js|runtime\.[\w-]+\.js)/i.test(
      html,
    );
  const hasFrameworkFingerprint =
    /__NEXT_DATA__|__NUXT__|window\.__INITIAL_STATE__|data-reactroot|ng-version/i.test(
      html,
    );
  return (
    (wordCount < 250 && (hasMountNode || hasFrameworkBundle)) ||
    hasFrameworkFingerprint
  );
}

// Cap the total recs per category so well-scored sites don't drown in advice.
function trimRecs(recs, score) {
  if (score >= 92) return recs.slice(0, 1);
  if (score >= 80) return recs.slice(0, 2);
  return recs.slice(0, 4);
}

function analyzePerformance({ ttfb, headers, sizeKB, html }) {
  const findings = [];
  const recs = [];
  let score = 95;

  if (ttfb < 400) {
    findings.push({ type: "good", text: `Excellent server response (${ttfb}ms TTFB)` });
    score += 3;
  } else if (ttfb < 800) {
    findings.push({ type: "good", text: `Fast server response (${ttfb}ms TTFB)` });
  } else if (ttfb < 1500) {
    score -= 6;
    recs.push("Move closer to a CDN edge to lower time-to-first-byte");
  } else {
    findings.push({ type: "issue", text: `Slow server response (${ttfb}ms — should be under 800ms)` });
    recs.push("Move to a faster host or put a CDN edge cache in front");
    score -= 16;
  }

  const enc = headers["content-encoding"] || "";
  if (/(br|zstd)/i.test(enc)) {
    findings.push({ type: "good", text: `Modern compression enabled (${enc})` });
    score += 2;
  } else if (/gzip/i.test(enc)) {
    findings.push({ type: "good", text: "HTTP compression enabled (gzip)" });
  } else {
    recs.push("Enable Brotli or gzip compression on your server");
    score -= 8;
  }

  if (sizeKB > 800) {
    findings.push({ type: "issue", text: `Heavy HTML payload (${sizeKB} KB)` });
    recs.push("Trim unused markup and split bundles");
    score -= 10;
  } else if (sizeKB > 400) {
    score -= 3;
  } else {
    findings.push({ type: "good", text: `Lean HTML payload (${sizeKB} KB)` });
  }

  const cache = headers["cache-control"] || "";
  if (/max-age=\d{3,}/.test(cache)) {
    findings.push({ type: "good", text: "Long-lived cache headers in place" });
  } else if (!cache) {
    recs.push("Add Cache-Control headers for static assets");
    score -= 3;
  }

  // Render-blocking <script src> in <head> without async/defer/module.
  const headHtml = (html.match(/<head[\s\S]*?<\/head>/i) || [""])[0];
  const blocking = (
    headHtml.match(
      /<script(?![^>]*\b(?:async|defer)\b)(?![^>]*\btype=["']module["'])[^>]*\bsrc=/gi,
    ) || []
  ).length;
  if (blocking === 0) {
    findings.push({ type: "good", text: "No render-blocking scripts in <head>" });
  } else if (blocking <= 2) {
    score -= 3;
  } else {
    findings.push({ type: "issue", text: `${blocking} render-blocking script(s) in <head>` });
    recs.push("Add defer/async to head scripts or move them to end-of-body");
    score -= Math.min(10, blocking * 2);
  }

  // Resource hints (preconnect / preload / dns-prefetch)
  if (/<link[^>]+rel=["'](?:preconnect|preload|dns-prefetch)["']/i.test(headHtml)) {
    findings.push({ type: "good", text: "Resource hints (preconnect/preload) in use" });
  }

  // HTTP/2 or HTTP/3 served via header hints (some hosts expose alt-svc)
  if (headers["alt-svc"]) {
    findings.push({ type: "good", text: "HTTP/3 ready (alt-svc advertised)" });
    score += 1;
  }

  return { score: clamp(score), findings, recommendations: trimRecs(recs, score) };
}

function analyzeSEO({ html }) {
  const findings = [];
  const recs = [];
  let score = 92;

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  if (!title) {
    findings.push({ type: "issue", text: "Missing <title> tag" });
    recs.push("Add a unique <title> (50-60 characters)");
    score -= 22;
  } else if (title.length < 20 || title.length > 75) {
    score -= 4;
    recs.push("Tighten the page title to 50-60 characters");
  } else {
    findings.push({ type: "good", text: `Title is well-sized (${title.length} chars)` });
  }

  const descMatch = html.match(
    /<meta\s+[^>]*?(?:name|property)=["']description["'][^>]*?content=["']([^"']*)["']/i,
  );
  const desc = descMatch ? descMatch[1].trim() : "";
  if (!desc) {
    findings.push({ type: "issue", text: "No meta description" });
    recs.push("Add a meta description (140-160 chars)");
    score -= 12;
  } else if (desc.length < 60 || desc.length > 220) {
    score -= 3;
  } else {
    findings.push({ type: "good", text: "Meta description is present and well-sized" });
  }

  const langMatch = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  if (langMatch) {
    findings.push({ type: "good", text: `Language declared (lang="${langMatch[1]}")` });
  } else {
    recs.push('Add a lang attribute on <html> (e.g. lang="en")');
    score -= 4;
  }

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count === 1) {
    findings.push({ type: "good", text: "Single H1 used" });
  } else if (h1Count === 0) {
    // Common in SPAs where the H1 is rendered client-side; mild penalty.
    score -= 5;
    recs.push("Make sure each page has a single descriptive H1");
  } else if (h1Count <= 3) {
    score -= 2;
  } else {
    score -= 5;
    recs.push(`Reduce to one H1 per page (found ${h1Count})`);
  }

  const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(html);
  const ogImage = /<meta[^>]+property=["']og:image["']/i.test(html);
  const ogDesc = /<meta[^>]+property=["']og:description["']/i.test(html);
  if (ogTitle && ogImage && ogDesc) {
    findings.push({ type: "good", text: "Open Graph tags fully configured" });
    score += 2;
  } else if (ogTitle || ogImage) {
    score -= 2;
    recs.push("Complete the Open Graph set (og:title, og:description, og:image)");
  } else {
    recs.push("Add Open Graph tags for social sharing previews");
    score -= 6;
  }

  if (/<link[^>]+rel=["']canonical["']/i.test(html)) {
    findings.push({ type: "good", text: "Canonical URL declared" });
  } else {
    recs.push("Add a canonical link tag");
    score -= 2;
  }

  if (/<script[^>]+type=["']application\/ld\+json["']/i.test(html)) {
    findings.push({ type: "good", text: "Structured data (JSON-LD) present" });
    score += 2;
  } else {
    recs.push("Add JSON-LD Schema for richer search results");
    score -= 3;
  }

  if (/<meta[^>]+name=["']twitter:card["']/i.test(html)) {
    findings.push({ type: "good", text: "Twitter Card tags configured" });
  }

  return { score: clamp(score), findings, recommendations: trimRecs(recs, score) };
}

function analyzeMobile({ html, imgCount, isSpa }) {
  const findings = [];
  const recs = [];
  let score = 94;

  const viewportMatch = html.match(
    /<meta\s+name=["']viewport["'][^>]*content=["']([^"']*)["']/i,
  );
  if (viewportMatch && /width=device-width/i.test(viewportMatch[1])) {
    findings.push({ type: "good", text: "Responsive viewport meta tag present" });
  } else {
    findings.push({ type: "issue", text: "Missing or incorrect viewport meta tag" });
    recs.push('Add <meta name="viewport" content="width=device-width, initial-scale=1">');
    score -= 22;
  }

  if (/<link[^>]+rel=["']apple-touch-icon["']/i.test(html)) {
    findings.push({ type: "good", text: "Apple touch icon configured" });
  } else {
    recs.push("Add an apple-touch-icon for iOS home-screen polish");
    score -= 3;
  }

  // SPAs often render images client-side; only judge srcset on sites that
  // actually shipped images in the SSR HTML.
  if (!isSpa) {
    const srcsetCount = (html.match(/\bsrcset=/gi) || []).length;
    if (imgCount === 0) {
      findings.push({ type: "good", text: "No raster images requiring responsive variants" });
    } else if (srcsetCount / imgCount > 0.5) {
      findings.push({ type: "good", text: `Responsive images in use (${srcsetCount}/${imgCount} with srcset)` });
      score += 2;
    } else if (imgCount > 8) {
      findings.push({ type: "issue", text: `Few images use srcset (${srcsetCount}/${imgCount})` });
      recs.push("Use srcset/sizes to serve appropriately-sized images per device");
      score -= 6;
    }
  } else {
    findings.push({ type: "good", text: "Single-page app — content adapts to viewport at runtime" });
  }

  if (/<picture[\s>]/i.test(html)) {
    findings.push({ type: "good", text: "<picture> element used for art-direction" });
    score += 1;
  }

  if (/<meta[^>]+name=["']theme-color["']/i.test(html)) {
    findings.push({ type: "good", text: "Theme-color set for mobile browser chrome" });
  }

  return { score: clamp(score), findings, recommendations: trimRecs(recs, score) };
}

function analyzeDesignUx({ html }) {
  const findings = [];
  const recs = [];
  let score = 92;

  const stylesheetCount = (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length;
  if (stylesheetCount === 0 && !/<style/i.test(html)) {
    findings.push({ type: "issue", text: "No stylesheet detected" });
    score -= 12;
  } else if (stylesheetCount > 10) {
    findings.push({ type: "issue", text: `Many stylesheets loaded (${stylesheetCount}) — consider consolidating` });
    recs.push("Bundle CSS to reduce render-blocking requests");
    score -= 5;
  } else {
    findings.push({ type: "good", text: "Stylesheet count is well managed" });
  }

  if (/(fonts\.googleapis|fonts\.gstatic|use\.typekit|fonts\.adobe)/i.test(html)) {
    findings.push({ type: "good", text: "Custom typography loaded" });
  }

  if (/<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(html)) {
    findings.push({ type: "good", text: "Favicon present" });
  } else {
    recs.push("Add a favicon");
    score -= 3;
  }

  // Inline style usage is only worth flagging when it dominates the markup.
  const inlineStyleCount = (html.match(/\sstyle=["']/gi) || []).length;
  if (inlineStyleCount > 80) {
    findings.push({ type: "issue", text: `Heavy inline-style usage (${inlineStyleCount} occurrences)` });
    recs.push("Move inline styles into a design-system CSS layer");
    score -= 5;
  }

  if (/<meta[^>]+name=["']theme-color["']/i.test(html)) {
    findings.push({ type: "good", text: "Brand theme-color declared" });
  }

  // Detect a manifest.json — sign of a polished, installable site.
  if (/<link[^>]+rel=["']manifest["']/i.test(html)) {
    findings.push({ type: "good", text: "Web app manifest detected" });
    score += 2;
  }

  return { score: clamp(score), findings, recommendations: trimRecs(recs, score) };
}

function analyzeCopy({ html, text, imgCount, isSpa }) {
  const findings = [];
  const recs = [];
  let score = 90;

  const wordCount = text.split(" ").filter(Boolean).length;

  if (isSpa) {
    // The SSR'd shell is empty by design — judge what we *can* see and
    // signal that full copy lives downstream.
    findings.push({
      type: "good",
      text: "Single-page app — copy is rendered client-side",
    });

    // Title quality stands in for hero copy.
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    if (title && title.length >= 25) {
      findings.push({ type: "good", text: "Page title carries a clear message" });
    } else {
      score -= 4;
      recs.push("Make the page <title> longer and more descriptive");
    }

    const descMatch = html.match(
      /<meta\s+[^>]*?(?:name|property)=["']description["'][^>]*?content=["']([^"']*)["']/i,
    );
    if (descMatch && descMatch[1].trim().length >= 80) {
      findings.push({ type: "good", text: "Meta description provides a strong summary" });
    } else {
      score -= 4;
      recs.push("Strengthen the meta description (140-160 chars)");
    }

    recs.push("Consider SSR or pre-rendering so crawlers see your full copy");
    return {
      score: clamp(score),
      findings,
      recommendations: trimRecs(recs, score),
    };
  }

  if (wordCount < 100) {
    findings.push({ type: "issue", text: `Very thin copy (${wordCount} words)` });
    recs.push("Add substantive content — at least 300 words on key landing pages");
    score -= 18;
  } else if (wordCount < 300) {
    findings.push({ type: "issue", text: `Light on copy (${wordCount} words)` });
    score -= 6;
  } else {
    findings.push({ type: "good", text: `Substantive content (${wordCount} words)` });
  }

  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const h3Count = (html.match(/<h3[\s>]/gi) || []).length;
  if (h2Count >= 2 && h3Count >= 1) {
    findings.push({ type: "good", text: "Clear heading hierarchy (H2/H3 used to structure copy)" });
  } else if (h2Count >= 1) {
    findings.push({ type: "good", text: "Subheadings used to structure copy" });
  } else {
    recs.push("Use H2 subheadings to break up long copy");
    score -= 4;
  }

  if (imgCount > 0) {
    const imgsWithAlt = (html.match(/<img[^>]+alt=["'][^"']/gi) || []).length;
    const altRatio = imgsWithAlt / imgCount;
    if (altRatio > 0.85) {
      findings.push({ type: "good", text: `Strong alt-text coverage (${imgsWithAlt}/${imgCount})` });
    } else if (altRatio < 0.4) {
      findings.push({ type: "issue", text: `Poor alt-text coverage (${imgsWithAlt}/${imgCount})` });
      recs.push("Write descriptive alt text for every meaningful image");
      score -= 6;
    }
  }

  return { score: clamp(score), findings, recommendations: trimRecs(recs, score) };
}

function analyzeConversion({ html, text, isHttps, isSpa }) {
  const findings = [];
  const recs = [];
  let score = 90;

  if (isHttps) {
    findings.push({ type: "good", text: "HTTPS enabled" });
  } else {
    findings.push({ type: "issue", text: "Site does not use HTTPS — visitors may distrust forms" });
    recs.push("Move to HTTPS — required for trust and modern browsers");
    score -= 18;
  }

  // Direct contact channels visible at the markup level (these survive SPAs).
  const hasTel = /href=["']tel:/i.test(html);
  const hasMail = /href=["']mailto:/i.test(html);
  const hasWa = /(wa\.me\/|api\.whatsapp\.com)/i.test(html);
  const directContacts = [hasTel, hasMail, hasWa].filter(Boolean).length;
  if (directContacts >= 2) {
    findings.push({ type: "good", text: "Multiple direct-contact channels available" });
    score += 2;
  } else if (directContacts === 1) {
    findings.push({ type: "good", text: "Direct contact link available" });
  } else if (!isSpa) {
    recs.push("Add at least one direct-contact link (tel:, mailto:, or WhatsApp)");
    score -= 4;
  }

  // For SPAs, judge conversion through structural signals (links, OG tags,
  // social profiles) rather than form/button counts that won't be in the SSR HTML.
  if (isSpa) {
    const linkCount = (html.match(/<a\b[^>]+href=/gi) || []).length;
    const hasSocialLinks =
      /(linkedin\.com|instagram\.com|x\.com|twitter\.com|facebook\.com|github\.com)/i.test(
        html,
      );

    if (linkCount >= 4) {
      findings.push({
        type: "good",
        text: `Navigation surface visible to crawlers (${linkCount} links)`,
      });
    } else {
      score -= 4;
      recs.push("Make sure key navigation links are server-rendered for crawlers");
    }

    if (hasSocialLinks) {
      findings.push({ type: "good", text: "Social profiles linked for trust signals" });
    }

    return {
      score: clamp(score),
      findings,
      recommendations: trimRecs(recs, score),
    };
  }

  const formCount = (html.match(/<form\b/gi) || []).length;
  const buttonCount = (html.match(/<button\b/gi) || []).length;
  const ctaWords =
    /(get started|book(?:\s+a)?|buy now|contact us|sign up|subscribe|request a (?:quote|demo|call)|try free|start now|learn more|hablemos|comprar|contactanos|reservar|empezar)/gi;
  const ctaMatches = (text.match(ctaWords) || []).length;

  if (formCount > 0) {
    findings.push({ type: "good", text: `${formCount} form(s) present for lead capture` });
  } else if (buttonCount === 0) {
    findings.push({ type: "issue", text: "No forms or buttons detected" });
    recs.push("Add a clear conversion element (contact form, booking link, or CTA button)");
    score -= 18;
  }

  if (ctaMatches >= 3) {
    findings.push({ type: "good", text: `Strong CTA presence (${ctaMatches} action phrases detected)` });
    score += 2;
  } else if (ctaMatches === 0) {
    recs.push("Use action-oriented copy like 'Get started', 'Contact us', 'Book a call'");
    score -= 6;
  }

  return { score: clamp(score), findings, recommendations: trimRecs(recs, score) };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL required" });

  let target;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const start = Date.now();
    const response = await fetch(target.href, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });
    const ttfb = Date.now() - start;

    if (!response.ok) {
      return res.status(502).json({
        error: `Site returned HTTP ${response.status}`,
      });
    }

    const headers = {};
    response.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));

    const html = await response.text();
    const sizeKB = Math.round(html.length / 1024);
    const finalUrl = response.url || target.href;
    const isHttps = new URL(finalUrl).protocol === "https:";
    const text = stripHtml(html);
    const imgCount = (html.match(/<img\b/gi) || []).length;
    const isSpa = detectSpa(html, text);

    const ctx = { ttfb, headers, sizeKB, html, text, imgCount, isHttps, isSpa };

    const performance = analyzePerformance(ctx);
    const seo = analyzeSEO(ctx);
    const mobile = analyzeMobile(ctx);
    const designUx = analyzeDesignUx(ctx);
    const copy = analyzeCopy(ctx);
    const conversion = analyzeConversion(ctx);

    const categories = [
      { name: "Performance", ...performance },
      { name: "SEO", ...seo },
      { name: "Mobile", ...mobile },
      { name: "Design & UX", ...designUx },
      { name: "Copywriting", ...copy },
      { name: "Conversion", ...conversion },
    ];

    const overallScore = Math.round(
      categories.reduce((acc, c) => acc + c.score, 0) / categories.length,
    );

    return res.status(200).json({
      url: finalUrl,
      overallScore,
      categories,
      meta: { isSpa, ttfb, sizeKB },
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    const isTimeout = err.name === "TimeoutError" || err.name === "AbortError";
    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout
        ? "The site took too long to respond"
        : "Could not reach this site",
      details: err.message,
    });
  }
}
