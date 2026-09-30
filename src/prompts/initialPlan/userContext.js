export function buildUserContextSection(userData) {
  const priorities = userData.goals?.length
    ? userData.goals.map((goal) => `- ${goal}`).join("\n")
    : "- Tidak ada prioritas khusus"

  const workDays = userData.workDays?.length
    ? userData.workDays.join(", ")
    : "Tidak disebutkan"

  return `
INFORMASI PENGGUNA:
- Usia: ${userData.age || "Tidak disebutkan"}
- Jenis kelamin: ${userData.gender || "Tidak disebutkan"}
- Tinggi badan: ${userData.height || "Tidak disebutkan"} cm
- Berat badan: ${userData.weight || "Tidak disebutkan"} kg

JADWAL TETAP:
- Kegiatan utama: ${userData.mainActivity || "Tidak disebutkan"}
- Jenis kegiatan: ${userData.activityType || "Tidak disebutkan"}
- Hari kerja/belajar: ${workDays}
- Mulai kerja/belajar: ${userData.workStart || "Tidak disebutkan"}
- Selesai kerja/belajar: ${userData.workEnd || "Tidak disebutkan"}
- Perjalanan diaktifkan: ${userData.commuteEnabled ? "Ya" : "Tidak"}
- Durasi perjalanan: ${userData.commuteDuration || "0"} menit

KESEHARIAN:
- Bangun tidur: ${userData.wakeTime || "Tidak disebutkan"}
- Tidur: ${userData.sleepTime || "Tidak disebutkan"}
- Sarapan: ${userData.breakfastTime || "Tidak disebutkan"}
- Makan siang: ${userData.lunchTime || "Tidak disebutkan"}
- Makan malam: ${userData.dinnerTime || "Tidak disebutkan"}
- Frekuensi olahraga: ${userData.exerciseFrequency || "Tidak disebutkan"} kali per minggu
- Durasi olahraga: ${userData.exerciseDuration || "Tidak disebutkan"} menit
- Waktu ibadah diaktifkan: ${userData.prayerEnabled ? "Ya" : "Tidak"}
- Preferensi pagi: ${userData.morningPreference || "Tidak disebutkan"}
- Preferensi jeda: ${userData.breakPreference || "Tidak disebutkan"}
- Rutinitas lain: ${userData.otherRoutine || "Tidak disebutkan"}

PRIORITAS:
${priorities}
`.trim()
}
