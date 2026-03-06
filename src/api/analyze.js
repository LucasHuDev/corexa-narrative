export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const rawUrl = req.query.url;

  if (!rawUrl || typeof rawUrl !== "string") {
    return res.status(400).json({ ok: false, error: "Missing url parameter" });
  }

  let targetUrl = rawUrl.trim();

  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid URL" });
  }

  const startedAt = Date.now();

  try {
    const response = await fetch(parsed.toString(), {
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const responseTime = Date.now() - startedAt;
    const contentType = response.headers.get("content-type") || "";
    const isHtml = contentType.includes("text/html");

    const html = isHtml ? await response.text() : "";

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const metaDescriptionMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
    );

    const title = titleMatch?.[1]?.replace(/\s+/g, " ").trim() || "";
    const metaDescription =
      metaDescriptionMatch?.[1]?.replace(/\s+/g, " ").trim() || "";

    const checks = {
      reachable: response.ok,
      https: parsed.protocol === "https:",
      html: isHtml,
      hasTitle: Boolean(title),
      hasMetaDescription: Boolean(metaDescription),
      fastResponse: responseTime < 1800,
    };

    let performance = 55;
    if (checks.fastResponse) performance += 28;
    else if (responseTime < 3000) performance += 12;

    let seo = 45;
    if (checks.hasTitle) seo += 25;
    if (checks.hasMetaDescription) seo += 22;
    if (checks.https) seo += 8;

    let structure = 52;
    if (checks.html) structure += 18;
    if (checks.hasTitle) structure += 12;
    if (html.length > 5000) structure += 10;

    let security = 38;
    if (checks.https) security += 42;
    if (checks.reachable) security += 12;

    let mobile = 58;
    if (checks.hasMetaDescription) mobile += 8;
    if (checks.fastResponse) mobile += 12;
    if (html.toLowerCase().includes("viewport")) mobile += 10;

    performance = clamp(performance);
    seo = clamp(seo);
    structure = clamp(structure);
    security = clamp(security);
    mobile = clamp(mobile);

    const total = Math.round(
      (performance + seo + structure + security + mobile) / 5,
    );

    const issues = [];

    if (!checks.reachable) issues.push("Website is not responding correctly");
    if (!checks.https) issues.push("Website is not using HTTPS");
    if (!checks.html) issues.push("Page is not returning clean HTML content");
    if (!checks.hasTitle) issues.push("Missing SEO title tag");
    if (!checks.hasMetaDescription) issues.push("Missing meta description");
    if (!checks.fastResponse) issues.push("Slow response time detected");

    if (!issues.length) {
      issues.push("Strong technical base, with room to improve conversion.");
    }

    return res.status(200).json({
      ok: true,
      url: parsed.toString(),
      total,
      title,
      metaDescription,
      responseTime,
      categories: [
        { label: "Performance", value: performance },
        { label: "SEO", value: seo },
        { label: "Structure", value: structure },
        { label: "Security", value: security },
        { label: "Mobile", value: mobile },
      ],
      issues,
    });
  } catch {
    return res.status(500).json({
      ok: false,
      error: "Could not analyze this website",
    });
  }
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
