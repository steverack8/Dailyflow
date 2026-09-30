export const ANALYSIS_OUTPUT_SECTION = `
Berikan hasil dalam struktur JSON berikut:

{
  "summary": "Ringkasan singkat kondisi jadwal.",
  "sleep": {
    "assessment": "Penilaian berdasarkan durasi dan waktu tidur.",
    "duration": "Durasi tidur berdasarkan jadwal.",
    "recommendation": "Saran terkait waktu tidur dan recovery."
  },
  "balance": {
    "assessment": "Penilaian pembagian waktu secara keseluruhan.",
    "strengths": [
      "Hal positif pertama",
      "Hal positif kedua"
    ],
    "concerns": [
      "Hal yang perlu diperhatikan pertama",
      "Hal yang perlu diperhatikan kedua"
    ]
  },
  "categories": {
    "work": "Analisis waktu kerja.",
    "study": "Analisis waktu belajar.",
    "exercise": "Analisis waktu olahraga.",
    "rest": "Analisis waktu istirahat.",
    "personal": "Analisis aktivitas personal.",
    "meal": "Analisis waktu makan.",
    "hobby": "Analisis waktu hobi."
  },
  "recommendations": [
    {
      "priority": "high",
      "title": "Judul rekomendasi",
      "description": "Penjelasan perubahan yang disarankan."
    },
    {
      "priority": "medium",
      "title": "Judul rekomendasi",
      "description": "Penjelasan perubahan yang disarankan."
    },
    {
      "priority": "low",
      "title": "Judul rekomendasi",
      "description": "Penjelasan perubahan yang disarankan."
    }
  ]
}

Pastikan response hanya berupa JSON valid.
- Seluruh nilai string dalam bahasa Indonesia.
`.trim()
