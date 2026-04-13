// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Contact endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, type, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const subject = `COREXA — ${type || "New"} request (${name})`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${type || "-"}`,
      ``,
      `Brief:`,
      message,
      ``,
      `— Sent from corexa site`,
    ].join("\n");

    const { data, error } = await resend.emails.send({
      from: "COREXA <onboarding@resend.dev>",
      to: ["lucashuenul11@icloud.com"],
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return res
        .status(500)
        .json({ ok: false, error: error.message || "Email send failed" });
    }

    return res.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ ok: false, error: "Server crashed" });
  }
});

// Analyze endpoint — uses Claude API
app.post("/api/analyze", async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: "Missing url" });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key not configured" });

    const prompt = `Analyze this website URL and provide a comprehensive audit: ${url}

Return ONLY a JSON object (no markdown, no code fences, no explanation) with this exact structure:
{
  "overallScore": <number 0-100>,
  "url": "${url}",
  "categories": [
    {
      "name": "Performance",
      "score": <number 0-100>,
      "findings": [
        { "type": "good" | "issue", "text": "<specific finding>" }
      ],
      "recommendations": ["<specific actionable recommendation>"]
    },
    { "name": "SEO", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Mobile", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Design & UX", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Copywriting", "score": <number>, "findings": [...], "recommendations": [...] },
    { "name": "Conversion", "score": <number>, "findings": [...], "recommendations": [...] }
  ]
}

Each category must have 2-4 findings and 1-3 recommendations. Be specific, honest, and actionable. Base your analysis on what you know about this URL, its industry, and common patterns.`;

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const apiData = await apiRes.json();

    if (!apiRes.ok) {
      console.error("CLAUDE API ERROR:", apiData);
      return res.status(502).json({ error: apiData?.error?.message || "Claude API error" });
    }

    const text = apiData.content?.[0]?.text || "";
    // Extract JSON from response (handle possible markdown fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(502).json({ error: "Invalid response from analysis" });
    }

    const report = JSON.parse(jsonMatch[0]);
    return res.json(report);
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    return res.status(500).json({ error: "Analysis failed" });
  }
});

// Port
const PORT = Number(process.env.PORT) || 8787;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
