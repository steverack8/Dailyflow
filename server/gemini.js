import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config({ path: "server/.env" })

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"

const planSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
    },
    schedule: {
      type: "array",
      items: {
        type: "object",
        properties: {
          startTime: {
            type: "string",
          },
          endTime: {
            type: "string",
          },
          activity: {
            type: "string",
          },
          category: {
            type: "string",
            enum: [
              "sleep",
              "work",
              "study",
              "exercise",
              "meal",
              "personal",
              "hobby",
              "rest",
              "other",
            ],
          },
          description: {
            type: "string",
          },
        },
        required: [
          "startTime",
          "endTime",
          "activity",
          "category",
          "description",
        ],
      },
    },
  },
  required: ["summary", "schedule"],
}

export async function generateContent(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is required.")
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: planSchema,
    },
  })

  const text = response.text

  if (!text) {
    throw new Error("Gemini returned an empty response.")
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error("Gemini returned invalid JSON.")
  }
}