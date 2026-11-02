require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { message, subject = "General", history = [] } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Please enter a question." });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "Gemini API key is missing. Add it to your .env file and restart the server."
      });
    }

    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];
    const contents = safeHistory
      .filter(item => item && ["user", "model"].includes(item.role) && typeof item.text === "string")
      .map(item => ({ role: item.role, parts: [{ text: item.text.slice(0, 4000) }] }));

    contents.push({
      role: "user",
      parts: [{
        text: `Subject: ${subject}. Explain clearly at a student's level. Use simple language, examples, and steps where useful. If this is homework, guide learning rather than encouraging copying. Question: ${message.trim()}`
      }]
    });

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({
        error: data?.error?.message || "The AI service could not answer. Check your API key and model."
      });
    }

    const answer = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!answer) return res.status(502).json({ error: "The AI returned an empty response. Try again." });
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`AI Study Buddy is running at http://localhost:${PORT}`);
});
