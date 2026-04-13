import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Simple daily rate limit (resets on cold start — fine for beta)
const dailyCount = { date: "", count: 0 };
const DAILY_LIMIT = 20;

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  // Rate limit
  const today = new Date().toISOString().split("T")[0];
  if (dailyCount.date !== today) {
    dailyCount.date = today;
    dailyCount.count = 0;
  }

  if (dailyCount.count >= DAILY_LIMIT) {
    return res.status(429).json({
      error: "daily_limit",
      message: "Beta limit reached for today. Back tomorrow!",
    });
  }

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    dailyCount.count++;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: `Analyze this website and provide a comprehensive audit: ${url}

Return ONLY a valid JSON object, no markdown, no explanation, no backticks. Exact structure:
{
  "overallScore": <number 0-100>,
  "url": "${url}",
  "categories": [
    {
      "name": "Performance",
      "score": <number 0-100>,
      "findings": [
        { "type": "good", "text": "<positive finding>" },
        { "type": "issue", "text": "<problem found>" }
      ],
      "recommendations": ["<specific actionable recommendation>", "<another one>"]
    },
    { "name": "SEO", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Mobile", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Design & UX", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Copywriting", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Conversion", "score": <number>, "findings": [...], "recommendations": [...] }
  ]
}

Each category must have 2-4 findings and 1-3 recommendations. Be specific, honest, and actionable. Base analysis on what you know about this URL and business type.`,
        },
      ],
    });

    const text = response.content[0].text.trim();
    // Extract JSON in case of stray text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res
        .status(502)
        .json({ error: "Invalid response from analysis engine" });
    }

    const report = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      report,
      remaining: DAILY_LIMIT - dailyCount.count,
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    dailyCount.count = Math.max(0, dailyCount.count - 1);
    return res
      .status(500)
      .json({ error: "Analysis failed", details: err.message });
  }
}
