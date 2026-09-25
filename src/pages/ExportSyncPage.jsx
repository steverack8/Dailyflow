import { useEffect, useMemo, useState } from "react"

import MaterialIcon from "../components/ui/MaterialIcon"
import { useAuth } from "../contexts/AuthContext"
import { getLatestDailyPlan } from "../services/firestoreService"

function ExportSyncPage() {
  const { user } = useAuth()

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    let mounted = true

    async function loadPlan() {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const latestPlan =
          await getLatestDailyPlan(user.uid)

        if (mounted) {
          setPlan(latestPlan)
        }
      } catch (loadError) {
        console.error(
          "Failed to load DailyFlow plan:",
          loadError
        )

        if (mounted) {
          setError(
            "Gagal mengambil jadwal DailyFlow."
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadPlan()

    return () => {
      mounted = false
    }
  }, [user?.uid])

  const activities = useMemo(() => {
    if (!plan?.schedule) {
      return []
    }

    return [...plan.schedule].sort((a, b) =>
      String(a.startTime).localeCompare(
        String(b.startTime)
      )
    )
  }, [plan])

  async function handleCopyText() {
    if (activities.length === 0) {
      return
    }

    const text = activities
      .map(
        (activity) =>
          `${activity.startTime} - ${activity.endTime}: ${activity.title}`
      )
      .join("\n")

    try {
      await navigator.clipboard.writeText(text)

      setError("")
      setMessage(
        "Daftar aktivitas berhasil disalin."
      )
    } catch (copyError) {
      console.error(
        "Failed to copy DailyFlow schedule:",
        copyError
      )

      setMessage("")
      setError(
        "Gagal menyalin daftar aktivitas."
      )
    }
  }

  function handleDownloadICS() {
    if (activities.length === 0) {
      return
    }

    const date = getTodayDate()

    const events = activities
      .map((activity, index) => {
        const uid =
          activity.id ||
          `${date}-${activity.startTime}-${index}`

        return `BEGIN:VEVENT
UID:${escapeICSValue(uid)}@dailyflow
DTSTAMP:${formatICSDateTimeUTC(new Date())}
SUMMARY:${escapeICSValue(activity.title)}
DESCRIPTION:${escapeICSValue(
          activity.description || ""
        )}
DTSTART;TZID=Asia/Jakarta:${formatICSDateTime(
          date,
          activity.startTime
        )}
DTEND;TZID=Asia/Jakarta:${formatICSDateTime(
          date,
          activity.endTime
        )}
END:VEVENT`
      })
      .join("\r\n")

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DailyFlow//Routine//ID
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-TIMEZONE:Asia/Jakarta
${events}
END:VCALENDAR`

    downloadFile(
      icsContent,
      "DailyFlow-Routine.ics",
      "text/calendar;charset=utf-8"
    )

    setError("")
    setMessage(
      "File DailyFlow-Routine.ics berhasil dibuat."
    )
  }

  function handleDownloadText() {
    if (activities.length === 0) {
      return
    }

    const text = [
      "Rutinitas DailyFlow",
      "",
      ...activities.map(
        (activity) =>
          `${activity.startTime} - ${activity.endTime} | ${activity.title}${
            activity.description
              ? `\n${activity.description}`
              : ""
          }`
      ),
    ].join("\n")

    downloadFile(
      text,
      "DailyFlow-Routine.txt",
      "text/plain;charset=utf-8"
    )

    setError("")
    setMessage(
      "File DailyFlow-Routine.txt berhasil dibuat."
    )
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-600">
            <MaterialIcon name="download" />
            Ekspor
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Ekspor DailyFlow
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Simpan jadwal DailyFlow atau
            tambahkan ke aplikasi kalender pilihanmu.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <MaterialIcon name="error" />
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <MaterialIcon name="check_circle" />
            <p>{message}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Jadwal DailyFlow
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ekspor jadwal yang sudah kamu buat.
              </p>
            </div>

            <div className="space-y-3 p-6">
              <button
                type="button"
                onClick={handleDownloadICS}
                disabled={activities.length === 0}
                className="flex w-full items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-left text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MaterialIcon
                  name="calendar_month"
                  className="text-blue-600"
                />

                <span>
                  <span className="block">
                    Unduh .ICS
                  </span>

                  <span className="mt-0.5 block text-xs font-normal text-blue-600">
                    Import ke Google Calendar,
                    Apple Calendar, atau aplikasi
                    kalender lainnya.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                disabled={activities.length === 0}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MaterialIcon
                  name="content_copy"
                  className="text-slate-500"
                />

                <span>Salin Daftar Aktivitas</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadText}
                disabled={activities.length === 0}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MaterialIcon
                  name="description"
                  className="text-slate-500"
                />

                <span>Unduh .TXT</span>
              </button>
            </div>

            <div className="border-t border-slate-200 px-6 py-5">
              <div className="flex gap-3">
                <MaterialIcon
                  name="info"
                  className="text-slate-400"
                />

                <p className="text-xs leading-5 text-slate-500">
                  File .ICS dapat diimpor ke berbagai
                  aplikasi kalender tanpa memberikan
                  DailyFlow akses ke kalender pribadimu.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Cara menggunakan .ICS
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Gunakan file kalender untuk memasukkan
                jadwal DailyFlow ke kalender.
              </p>
            </div>

            <div className="space-y-4 p-6">
              <Step
                number="1"
                title="Unduh .ICS"
                description="Unduh file jadwal dari DailyFlow."
              />

              <Step
                number="2"
                title="Buka aplikasi kalender"
                description="Gunakan Google Calendar atau aplikasi kalender lainnya."
              />

              <Step
                number="3"
                title="Impor file"
                description="Pilih file DailyFlow-Routine.ics untuk menambahkan jadwal."
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Daftar Aktivitas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Memuat jadwal..."
                  : `${activities.length} aktivitas dari jadwal terbaru`}
              </p>
            </div>

            <div className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 sm:block">
              {activities.length} Blok
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex min-h-40 items-center justify-center">
                <MaterialIcon
                  name="progress_activity"
                  className="text-slate-400"
                />
              </div>
            ) : activities.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <MaterialIcon name="event_note" />
                </div>

                <p className="text-sm font-medium text-slate-800">
                  Belum ada jadwal
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Buat jadwal DailyFlow terlebih dahulu.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activities.map(
                  (activity, index) => (
                    <ActivityRow
                      key={
                        activity.id ||
                        `${activity.startTime}-${index}`
                      }
                      activity={activity}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
        {number}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}

function ActivityRow({ activity }) {
  const categoryLabels = {
    sleep: "Tidur",
    work: "Kerja",
    study: "Belajar",
    exercise: "Olahraga",
    meal: "Makan",
    personal: "Personal",
    hobby: "Hobi",
    rest: "Istirahat",
    other: "Lainnya",
  }

  const categoryStyles = {
    sleep:
      "bg-slate-100 text-slate-700 border-slate-200",
    work:
      "bg-blue-50 text-blue-700 border-blue-200/60",
    study:
      "bg-amber-50 text-amber-700 border-amber-200/60",
    exercise:
      "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    meal:
      "bg-orange-50 text-orange-700 border-orange-200/60",
    personal:
      "bg-purple-50 text-purple-700 border-purple-200/60",
    hobby:
      "bg-pink-50 text-pink-700 border-pink-200/60",
    rest:
      "bg-slate-100 text-slate-600 border-slate-200",
    other:
      "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  }

  const category =
    activity.category || "other"

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-900">
            {activity.startTime} -{" "}
            {activity.endTime}
          </span>

          <span className="text-slate-300">
            •
          </span>

          <span className="truncate text-sm text-slate-700">
            {activity.title}
          </span>
        </div>

        {activity.description && (
          <p className="mt-1 truncate text-xs text-slate-500">
            {activity.description}
          </p>
        )}
      </div>

      <span
        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
          categoryStyles[category] ||
          categoryStyles.other
        }`}
      >
        {categoryLabels[category] ||
          categoryLabels.other}
      </span>
    </div>
  )
}

function getTodayDate() {
  const now = new Date()

  const formatter = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  )

  return formatter.format(now)
}

function formatICSDateTime(date, time) {
  return `${date.replace(
    /-/g,
    ""
  )}T${time.replace(":", "")}00`
}

function formatICSDateTimeUTC(date) {
  const year = date.getUTCFullYear()

  const month = String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")

  const day = String(
    date.getUTCDate()
  ).padStart(2, "0")

  const hours = String(
    date.getUTCHours()
  ).padStart(2, "0")

  const minutes = String(
    date.getUTCMinutes()
  ).padStart(2, "0")

  const seconds = String(
    date.getUTCSeconds()
  ).padStart(2, "0")

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

function escapeICSValue(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

function downloadFile(
  content,
  filename,
  type
) {
  const blob = new Blob([content], {
    type,
  })

  const url =
    window.URL.createObjectURL(blob)

  const link =
    document.createElement("a")

  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  window.URL.revokeObjectURL(url)
}

export default ExportSyncPage