import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, type, message } = req.body || {};

    // Validación básica
    if (!name || !String(name).trim())
      return res.status(400).json({ ok: false, error: "Missing name" });

    if (!email || !String(email).trim() || !isEmail(email))
      return res.status(400).json({ ok: false, error: "Invalid email" });

    if (!message || !String(message).trim())
      return res.status(400).json({ ok: false, error: "Missing message" });

    const to = "corexastudio@gmail.com";

    // ⚠️ IMPORTANTE:
    // Cambiá este "from" por el que te permita Resend en tu cuenta.
    // Ideal cuando verifiques dominio: "COREXA <corexastudio@gmail.com>"
    const from = "COREXA <onboarding@resend.dev>";

    const subject = `COREXA — ${type || "Service"} request (${name})`;

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

    await resend.emails.send({
      from,
      to,
      replyTo: email, // clave: cuando respondés, le respondés al lead
      subject,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Email send failed" });
  }
}
