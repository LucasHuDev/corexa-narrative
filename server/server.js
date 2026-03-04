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

// Port
const PORT = Number(process.env.PORT) || 8787;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
