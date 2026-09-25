import { GoogleGenAI } from "@google/genai"

const model = process.env.GEMINI_MODEL || "gemini-3.6-flash"

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
          title: {
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
          "title",
          "category",
          "description",
        ],
      },
    },
  },
  required: ["summary", "schedule"],
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Metode tidak diizinkan.",
      }),
    }
  }

  try {
    const { prompt } = JSON.parse(
      event.body || "{}"
    )

    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          message: "Prompt wajib diisi.",
        }),
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is not configured."
      )
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })

    console.log(
      `Generating daily plan with model: ${model}`
    )

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
      throw new Error(
        "Gemini returned an empty response."
      )
    }

    let plan

    try {
      plan = JSON.parse(text)
    } catch {
      throw new Error(
        "Gemini returned invalid JSON."
      )
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        result: plan,
      }),
    }
  } catch (error) {
    console.error(
      "Generate plan error:",
      error
    )

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error:
          error?.message ||
          "Gagal membuat rencana harian.",
      }),
    }
  }
}