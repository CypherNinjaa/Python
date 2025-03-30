const axios = require("axios");

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const {
      name,
      email,
      subject,
      message,
      "g-recaptcha-response": recaptcha,
    } = req.body;

    // Verify required fields
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields" });
    }

    // Verify reCAPTCHA (if you want to use it)
    // You'll need to implement this part

    // Format the Telegram message
    const telegramMessage = `
    📩 *New Contact Form Submission* 📩
    
    *Name:* ${name}
    *Email:* ${email}
    *Subject:* ${subject || "No subject provided"}
    
    *Message:*
    ${message}
    `;

    // Send to Telegram
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: telegramMessage,
        parse_mode: "Markdown",
      }
    );

    res.status(200).json({ ok: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Telegram error:", error);
    res.status(500).json({ ok: false, message: "Failed to send message" });
  }
};
