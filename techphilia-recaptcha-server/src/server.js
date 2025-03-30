require("dotenv").config();
const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/verify-recaptcha", limiter);

// reCAPTCHA verification endpoint
app.post("/verify-recaptcha", async (req, res) => {
  try {
    const { recaptchaResponse } = req.body;

    if (!recaptchaResponse) {
      return res.status(400).json({
        success: false,
        error: "Missing reCAPTCHA response",
      });
    }

    const verification = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaResponse,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!verification.data.success) {
      console.log("reCAPTCHA failed:", verification.data["error-codes"]);
      return res.status(400).json({
        success: false,
        errors: verification.data["error-codes"],
      });
    }

    res.json({
      success: true,
      score: verification.data.score,
      timestamp: new Date(verification.data.challenge_ts * 1000),
    });
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during verification",
    });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Techphilia reCAPTCHA verification service is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
