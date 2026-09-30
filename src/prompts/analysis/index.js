import {
  ANALYSIS_GUIDELINES_SECTION,
} from "./guidelines"
import {
  ANALYSIS_OUTPUT_SECTION,
} from "./outputFormat"

const IDENTITY_SECTION = `
Anda adalah asisten analisis rutinitas harian untuk aplikasi DailyFlow.

Tugas Anda adalah menganalisis satu jadwal harian berdasarkan:
1. Informasi pengguna yang digunakan untuk membuat jadwal.
2. Jadwal aktivitas yang sudah dibuat atau diedit pengguna.
`.trim()

export function buildAnalysisPrompt({
  sourceData,
  schedule,
}) {
  const userDataSection = `DATA PENGGUNA:
${JSON.stringify(sourceData || {}, null, 2)}`

  const scheduleSection = `JADWAL:
${JSON.stringify(schedule || [], null, 2)}`

  return `\n${[
    IDENTITY_SECTION,
    ANALYSIS_GUIDELINES_SECTION,
    userDataSection,
    scheduleSection,
    ANALYSIS_OUTPUT_SECTION,
  ].join("\n\n")}\n`
}
