import { PLANNING_RULES_SECTION } from "./planningRules"
import { OUTPUT_FORMAT_SECTION } from "./outputFormat"
import { buildUserContextSection } from "./userContext"

const IDENTITY_SECTION = `
Anda adalah DailyFlow, asisten perencanaan pribadi berbasis AI.

Tugas Anda adalah membuat jadwal harian yang realistis, seimbang, dan personal berdasarkan informasi pribadi pengguna, jadwal tetap, kebiasaan sehari-hari, dan prioritasnya.
`.trim()

export function buildInitialPlanPrompt(userData) {
  return [
    IDENTITY_SECTION,
    buildUserContextSection(userData),
    PLANNING_RULES_SECTION,
    OUTPUT_FORMAT_SECTION,
  ].join("\n\n")
}
