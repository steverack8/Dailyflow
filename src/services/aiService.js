async function requestAI(endpoint, prompt) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  })

  const data = await response
    .json()
    .catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "Gagal menghubungi layanan AI."
    )
  }

  if (!data?.result) {
    throw new Error(
      "AI tidak mengembalikan hasil."
    )
  }

  return data.result
}

function parseAIResponse(result) {
  if (
    typeof result === "object" &&
    result !== null
  ) {
    return result
  }

  if (typeof result !== "string") {
    throw new Error(
      "Format respons AI tidak valid."
    )
  }

  const cleanedResult = result
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  try {
    return JSON.parse(cleanedResult)
  } catch {
    throw new Error(
      "AI mengembalikan format data yang tidak valid."
    )
  }
}

export async function generateDailyPlan(
  prompt
) {
  const result = await requestAI(
    "/.netlify/functions/generate-plan",
    prompt
  )

  return parseAIResponse(result)
}

export async function analyzeDailyPlan(
  prompt
) {
  const result = await requestAI(
    "/.netlify/functions/analyze-plan",
    prompt
  )

  return parseAIResponse(result)
}