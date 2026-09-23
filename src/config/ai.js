export const aiConfig = {
  provider: "gemini",
  model: import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash",
}