export const OUTPUT_FORMAT_SECTION = `
SYARAT KELUARAN:
Kembalikan HANYA JSON yang valid.

Gunakan persis struktur berikut:

{
  "summary": "Ringkasan singkat rencana harian yang dibuat",
  "schedule": [
    {
      "startTime": "06:00",
      "endTime": "06:30",
      "title": "Bangun & Persiapan Pagi",
      "category": "personal",
      "description": "Bangun tidur, membersihkan diri, dan mempersiapkan diri untuk memulai hari."
    }
  ]
}

KATEGORI HARUS SALAH SATU DARI:
- sleep
- work
- study
- exercise
- meal
- personal
- hobby
- rest
- other

PENTING:
- Gunakan format jam 24 jam (JJ:mm).
- startTime harus lebih awal dari endTime untuk aktivitas pada hari yang sama.
- Pertahankan urutan jadwal secara kronologis.
- Jangan membuat blok waktu yang bertumpang tindih.
- Gunakan jam yang diberikan pengguna bila memungkinkan.
- Setiap item jadwal WAJIB memiliki kolom "title".
- Setiap "title" WAJIB berupa nama aktivitas yang spesifik.
- JANGAN PERNAH menggunakan "Aktivitas" sebagai judul.
- JANGAN PERNAH menggunakan "Kegiatan" sebagai judul.
- JANGAN PERNAH menggunakan "Activity" sebagai judul.
- JANGAN PERNAH menggunakan "Routine" sebagai judul.
- JANGAN PERNAH menggunakan "Task" sebagai judul.
- Jangan menaruh nama aktivitas sebenarnya hanya di dalam "description".
- "description" harus memberikan konteks tambahan tentang aktivitas.
- Jangan sertakan markdown.
- Jangan sertakan code fence.
- Jangan sertakan teks apa pun di luar objek JSON.
- Seluruh nilai string harus dalam bahasa Indonesia.
`.trim()
