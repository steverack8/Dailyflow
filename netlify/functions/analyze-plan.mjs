import { GoogleGenAI } from "@google/genai"

const model =
  process.env.GEMINI_MODEL || "gemini-3.6-flash"

const analysisSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
    },

    sleep: {
      type: "object",
      properties: {
        assessment: {
          type: "string",
        },
        duration: {
          type: "string",
        },
        recommendation: {
          type: "string",
        },
      },
      required: [
        "assessment",
        "duration",
        "recommendation",
      ],
    },

    balance: {
      type: "object",
      properties: {
        assessment: {
          type: "string",
        },
        strengths: {
          type: "array",
          items: {
            type: "string",
          },
        },
        concerns: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "assessment",
        "strengths",
        "concerns",
      ],
    },

    categories: {
      type: "object",
      properties: {
        work: {
          type: "string",
        },
        study: {
          type: "string",
        },
        exercise: {
          type: "string",
        },
        rest: {
          type: "string",
        },
        personal: {
          type: "string",
        },
        meal: {
          type: "string",
        },
        hobby: {
          type: "string",
        },
      },
      required: [
        "work",
        "study",
        "exercise",
        "rest",
        "personal",
        "meal",
        "hobby",
      ],
    },

    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          priority: {
            type: "string",
            enum: [
              "high",
              "medium",
              "low",
            ],
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
        required: [
          "priority",
          "title",
          "description",
        ],
      },
    },
  },

  required: [
    "summary",
    "sleep",
    "balance",
    "categories",
    "recommendations",
  ],
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
        message: "Method not allowed.",
      }),
    }
  }

  try {
    const { prompt } = JSON.parse(
      event.body || "{}"
    )

    if (
      !prompt ||
      typeof prompt !== "string"
    ) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          message: "Prompt is required.",
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
      `Analyzing daily plan with model: ${model}`
    )

    const response =
      await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
        },
      })

    const text = response.text

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      )
    }

    let analysis

    try {
      analysis = JSON.parse(text)
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
        result: analysis,
      }),
    }
  } catch (error) {
    console.error(
      "Analyze plan error:",
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
          "Failed to analyze daily plan.",
      }),
    }
  }
}