import { useState } from "react"
import MaterialIcon from "../components/ui/MaterialIcon"

const activities = [
  {
    time: "05:00 - 05:30",
    title: "Sholat Subuh & Doa",
    category: "Spiritual",
    style: "purple",
  },
  {
    time: "06:00 - 06:30",
    title: "Bangun & Persiapan Pagi",
    category: "Personal",
    style: "slate",
  },
  {
    time: "08:00 - 12:00",
    title: "Fokus Kerja Sesi 1",
    category: "Work",
    style: "blue",
  },
  {
    time: "12:00 - 13:00",
    title: "Sholat Dzuhur & Makan Siang (Ishoma)",
    category: "Break / Spiritual",
    style: "purple",
  },
  {
    time: "13:00 - 17:00",
    title: "Fokus Kerja Sesi 2",
    category: "Work",
    style: "blue",
  },
  {
    time: "18:00 - 18:45",
    title: "Olahraga Sore",
    category: "Flexible",
    style: "emerald",
  },
  {
    time: "18:45 - 19:15",
    title: "Sholat Maghrib",
    category: "Spiritual",
    style: "purple",
  },
  {
    time: "19:30 - 20:00",
    title: "Sholat Isya & Makan Malam",
    category: "Spiritual / Meal",
    style: "purple",
  },
  {
    time: "20:30 - 21:30",
    title: "Belajar / Membaca",
    category: "Learning",
    style: "amber",
  },
  {
    time: "22:30 - 06:00",
    title: "Tidur Malam",
    category: "Sleep",
    style: "slate",
  },
]

function ExportSyncPage() {
  const [period, setPeriod] = useState("weekly")
  const [autoShift, setAutoShift] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)

  const dateRange =
    period === "weekly"
      ? "1 Apr 2025 - 7 Apr 2025"
      : "1 Apr 2025 - 30 Apr 2025"

  const periodBadge = period === "weekly" ? "7 Hari" : "30 Hari"

  const handleSync = () => {
    if (syncing) return

    setSyncing(true)
    setSyncSuccess(false)

    setTimeout(() => {
      setSyncing(false)
      setSyncSuccess(true)

      setTimeout(() => {
        setSyncSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleCopyText = async () => {
    const text = activities
      .map(
        (activity) =>
          `${activity.time}: ${activity.title} (${activity.category})`
      )
      .join("\n")

    try {
      await navigator.clipboard.writeText(text)
      alert("Daftar teks aktivitas berhasil disalin ke clipboard.")
    } catch {
      alert("Gagal menyalin daftar aktivitas.")
    }
  }

  const handleDownloadICS = () => {
    const icsContent =
      "BEGIN:VCALENDAR\n" +
      "VERSION:2.0\n" +
      "PRODID:-//DailyFlow//Routine Layer//ID\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "BEGIN:VEVENT\n" +
      "SUMMARY:Fokus Kerja Sesi 1\n" +
      "DTSTART;TZID=Asia/Jakarta:20250401T080000\n" +
      "DTEND;TZID=Asia/Jakarta:20250401T120000\n" +
      "END:VEVENT\n" +
      "END:VCALENDAR"

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8;",
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.setAttribute("download", "DailyFlow-Routine.ics")

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full bg-slate-50">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Export &amp; Sinkronisasi Google Calendar
            </h1>

            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Kirim daftar aktivitas langsung ke akun Google Calendar Anda
              dengan penataan jadwal presisi otomatis.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left Column */}
            <section className="flex flex-col gap-5 lg:col-span-5">
              {/* Sync Parameters */}
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Parameter Sinkronisasi
                  </h2>

                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    API v3 Ready
                  </span>
                </div>

                {/* Period */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-800">
                    Pilihan Periode Sinkronisasi
                  </label>

                  <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setPeriod("weekly")}
                      className={`rounded-lg px-3 py-2 text-center text-xs transition-colors ${
                        period === "weekly"
                          ? "border border-slate-200 bg-white font-semibold text-blue-700 shadow-sm"
                          : "font-medium text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Harian (1 - 7 Hari)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPeriod("monthly")}
                      className={`rounded-lg px-3 py-2 text-center text-xs transition-colors ${
                        period === "monthly"
                          ? "border border-slate-200 bg-white font-semibold text-blue-700 shadow-sm"
                          : "font-medium text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Bulanan (30 Hari)
                    </button>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="date-range-display"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Rentang Tanggal
                  </label>

                  <div className="relative flex items-center">
                    <MaterialIcon className="pointer-events-none absolute left-3 text-[18px] text-slate-400">
                      calendar_month
                    </MaterialIcon>

                    <input
                      id="date-range-display"
                      type="text"
                      readOnly
                      value={dateRange}
                      className="w-full cursor-default rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-14 font-mono text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />

                    <span className="absolute right-3 text-[11px] font-medium text-slate-500">
                      {periodBadge}
                    </span>
                  </div>
                </div>

                {/* Target Calendar */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="target-calendar"
                    className="text-xs font-semibold text-slate-800"
                  >
                    Target Google Calendar
                  </label>

                  <div className="relative">
                    <select
                      id="target-calendar"
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-9 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="routine">
                        DailyFlow (Routine Layer)
                      </option>

                      <option value="primary">
                        Primary (alex.tech@gmail.com)
                      </option>

                      <option value="work">
                        Work &amp; Professional Sprints
                      </option>
                    </select>

                    <MaterialIcon className="pointer-events-none absolute right-2.5 top-2.5 text-[18px] text-slate-400">
                      expand_more
                    </MaterialIcon>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Jadwal akan dimasukkan sebagai kalender layer khusus tanpa
                    menimpa data primer.
                  </p>
                </div>

                {/* Auto Shift */}
                <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-800">
                      Otomatis geser habit jika ada meeting mendadak
                    </span>

                    <span className="text-[11px] text-slate-500">
                      Mendeteksi bentrok jadwal dan merelokasi blok fleksibel.
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoShift}
                    onClick={() => setAutoShift((current) => !current)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-in-out focus:outline-none ${
                      autoShift ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none ml-0.5 mt-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-150 ease-in-out ${
                        autoShift ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Sync Button */}
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <MaterialIcon
                    className={`text-[18px] ${
                      syncing ? "animate-spin" : ""
                    }`}
                  >
                    {syncing
                      ? "progress_activity"
                      : syncSuccess
                        ? "check"
                        : "sync"}
                  </MaterialIcon>

                  <span>
                    {syncing
                      ? "Menghubungkan ke Google Calendar..."
                      : syncSuccess
                        ? "Sinkronisasi Selesai"
                        : "Sinkronkan ke Google Calendar"}
                  </span>
                </button>

                {/* Sync Success */}
                {syncSuccess && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                    <MaterialIcon className="text-[18px] text-blue-600">
                      check_circle
                    </MaterialIcon>

                    <span>
                      10 entri berhasil diantrekan ke Google Calendar
                      (Routine Layer).
                    </span>
                  </div>
                )}
              </div>

              {/* Alternative Export */}
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ekspor Alternatif
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <MaterialIcon className="text-[16px] text-slate-500">
                      content_copy
                    </MaterialIcon>

                    <span>Salin Teks</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadICS}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <MaterialIcon className="text-[16px] text-slate-500">
                      download
                    </MaterialIcon>

                    <span>Download .ICS</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Right Column */}
            <section className="flex flex-col gap-4 lg:col-span-7">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                {/* Activity Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Daftar Aktivitas Siap Ekspor
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      10 blok jadwal siap ditulis ulang ke rutinitas mingguan
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    10 Blok / Hari
                  </span>
                </div>

                {/* Activity List */}
                <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {activities.map((activity) => (
                    <ActivityRow
                      key={`${activity.time}-${activity.title}`}
                      activity={activity}
                    />
                  ))}
                </div>

                {/* Activity Footer */}
                <div className="flex flex-col justify-between gap-2 pt-2 text-xs text-slate-500 sm:flex-row sm:items-center">
                  <span className="flex items-center gap-1.5">
                    <MaterialIcon className="text-[16px] text-blue-600">
                      verified_user
                    </MaterialIcon>

                    <span>
                      Format kompatibel penuh dengan RFC 5545 &amp; Google Cal
                      API
                    </span>
                  </span>

                  <span className="font-mono text-[11px] text-slate-500">
                    UTC+07:00 (WIB)
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function ActivityRow({ activity }) {
  const categoryStyles = {
    purple: "bg-purple-50 text-purple-700 border-purple-200/60",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200/60",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200/60",
  }

  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-slate-50">
      <div className="flex min-w-0 items-center gap-3">
        <span className="whitespace-nowrap font-mono text-xs font-medium text-slate-600">
          {activity.time}
        </span>

        <span className="text-slate-300">•</span>

        <span className="truncate text-xs font-medium text-slate-900">
          {activity.title}
        </span>
      </div>

      <span
        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${categoryStyles[activity.style]}`}
      >
        {activity.category}
      </span>
    </div>
  )
}

export default ExportSyncPage