export async function generateDailyPlan(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is required.")
  }

  const response = await fetch("http://localhost:3001/api/generate-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to generate daily plan."
    )
  }

  if (!data?.success || !data?.plan) {
    throw new Error("Invalid plan response from server.")
  }

  return data.plan
}