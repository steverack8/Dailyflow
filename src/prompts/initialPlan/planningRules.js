export const PLANNING_RULES_SECTION = `
ATURAN PERENCANAAN:
1. Buat jadwal harian yang lengkap.
2. Hormati waktu bangun tidur dan waktu tidur pengguna.
3. Hormati jam kerja atau jam belajar pengguna.
4. Jadwalkan kerja/belajar hanya pada hari kerja yang ditentukan pengguna jika relevan.
5. Sertakan jam makan yang disukai pengguna.
6. Sertakan olahraga sesuai frekuensi dan durasi olahraga pengguna.
7. Sertakan jeda dan waktu transisi yang wajar.
8. Sertakan waktu perjalanan jika perjalanan diaktifkan.
9. Sertakan aktivitas ibadah jika ibadah diaktifkan.
10. Berikan perhatian yang tepat pada prioritas yang disebutkan pengguna.
11. Pertimbangkan preferensi pagi dan jeda pengguna.
12. Sertakan rutinitas lain pengguna jika memang cocok.
13. Jangan membuat aktivitas yang bertumpang tindih.
14. Pertahankan jadwal yang realistis dan berkelanjutan.
15. Setiap aktivitas harus memiliki waktu mulai dan selesai yang jelas.
16. Jadwal harus mencakup hari pengguna dari bangun tidur sampai tidur.
17. Jangan mengarang informasi sangat spesifik yang tidak diberikan pengguna.
18. Buat nama aktivitas yang spesifik dan bermakna.
19. Jangan menggunakan nama aktivitas generik seperti "Aktivitas", "Activity", "Kegiatan", "Routine", atau "Task".
20. Nama aktivitas harus menjelaskan apa yang sebenarnya dilakukan pengguna.
21. Setiap aktivitas sebaiknya memiliki nama yang berbeda dan deskriptif bila memungkinkan.
22. Letakkan nama aktivitas utama di kolom "title", bukan hanya di deskripsi.

CONTOH NAMA AKTIVITAS:
- "Bangun & Persiapan Pagi"
- "Sholat Subuh"
- "Mandi Pagi"
- "Sarapan Pagi"
- "Persiapan Kerja"
- "Perjalanan ke Kantor"
- "Fokus Kerja Pagi"
- "Meeting Tim"
- "Makan Siang"
- "Istirahat Siang"
- "Sholat Dzuhur"
- "Lanjutan Pekerjaan"
- "Olahraga Sore"
- "Perjalanan Pulang"
- "Mandi Sore"
- "Makan Malam"
- "Waktu Bersama Keluarga"
- "Membaca Buku"
- "Waktu Santai"
- "Persiapan Tidur"
- "Tidur Malam"

CONTOH BURUK:
{
  "title": "Aktivitas",
  "category": "work",
  "description": "Kegiatan kerja atau belajar yang fokus."
}

CONTOH BAIK:
{
  "title": "Fokus Kerja Pagi",
  "category": "work",
  "description": "Menyelesaikan pekerjaan utama dengan fokus pada pagi hari."
}
`.trim()
