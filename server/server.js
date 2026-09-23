import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import { generateContent } from "./gemini.js"

dotenv.config({ path: "server/.env" })

const app = express()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: "http://localhost:5173",
  })
)

app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DailyFlow server is running.",
  })
})

app.post("/api/generate-plan", async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      })
    }

    const plan = await generateContent(prompt)

    return res.json({
      success: true,
      plan,
    })
  } catch (error) {
    console.error("Generate plan error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to generate daily plan.",
    })
  }
})

app.listen(PORT, () => {
  console.log(`DailyFlow server running on http://localhost:${PORT}`)
})