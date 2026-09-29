import { useEffect, useMemo, useState } from "react"

import MaterialIcon from "../components/ui/MaterialIcon"
import { useToast } from "../components/ui/ToastProvider"
import { useAuth } from "../contexts/AuthContext"
import { getLatestDailyPlan } from "../services/firestoreService"
import {
  getGoogleTasksClientId,
  getSavedGoogleTasksConnection,
  requestGoogleTasksToken,
  saveGoogleTasksConnection,
  syncScheduleToGoogleTasks,
} from "../services/googleTasksService"

const SYNC_RANGE_OPTIONS = [
  { value: 1, label: "Hari ini" },
  { value: 7, label: "7 hari" },
  { value: 30, label: "30 hari" },
  { value: 90, label: "90 hari" },
]

function ExportSyncPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  const [tokenState, setTokenState] = useState({
    uid: null,
    token: null,
  })
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(null)
  const [syncDays, setSyncDays] = useState(1)

  useEffect(() => {
    let mounted = true

    async function loadPlan() {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

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
          toast.error(
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
  }, [user?.uid, toast])

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

  useEffect(() => {
    if (!syncing) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [syncing])

  const userId = user?.uid

  const savedConnection = useMemo(
    () =>
      userId
        ? getSavedGoogleTasksConnection(userId)
        : null,
    [userId]
  )

  const googleToken =
    tokenState.uid === userId ? tokenState.token : null

  const connectionEmail =
    googleToken?.email || savedConnection?.email || null

  const isConnected = Boolean(
    googleToken?.accessToken || savedConnection
  )

  const clientIdConfigured = Boolean(
    getGoogleTasksClientId()
  )

  async function handleConnectGoogle() {
    if (connecting) {
      return
    }

    setConnecting(true)

    try {
      const token = await requestGoogleTasksToken({
        loginHint: user?.email || undefined,
        uid: user?.uid || undefined,
      })

      setTokenState({
        uid: user?.uid || null,
        token,
      })

      if (user?.uid) {
        saveGoogleTasksConnection(
          user.uid,
          token.email || user.email || ""
        )
      }

      toast.success(
        token.email
          ? `Terhubung sebagai ${token.email}.`
          : "Akun Google berhasil terhubung ke Google Tasks."
      )
    } catch (connectError) {
      console.error(
        "Failed to connect Google Tasks:",
        connectError
      )

      toast.error(
        connectError?.message ||
          "Gagal terhubung ke Google Tasks."
      )
    } finally {
      setConnecting(false)
    }
  }

  async function handleSyncToGoogleTasks() {
    if (syncing || activities.length === 0) {
      return
    }

    setSyncing(true)

    try {
      let token = googleToken

      if (
        !token?.accessToken ||
        token.expiresAt <= Date.now()
      ) {
        token = await requestGoogleTasksToken({
          loginHint: user?.email || undefined,
          uid: user?.uid || undefined,
        })

        setTokenState({
          uid: user?.uid || null,
          token,
        })
      }

      const result = await syncScheduleToGoogleTasks({
        token: token.accessToken,
        activities,
        date: getTodayDate(),
        days: syncDays,
        onProgress: (current, total) =>
          setSyncProgress({ current, total }),
      })

      if (result.verified === 0) {
        toast.error(
          "Sinkronisasi tidak terbaca di Google Tasks. Coba lagi."
        )
        return
      }

      toast.success(
        `${result.verified} tugas (${result.days} hari) tersimpan di daftar "${result.listTitle}". Buka Google Tasks lalu pilih daftar "${result.listTitle}".`
      )
    } catch (syncError) {
      console.error(
        "Failed to sync to Google Tasks:",
        syncError
      )

      toast.error(
        syncError?.message ||
          "Gagal sinkron ke Google Tasks."
      )
    } finally {
      setSyncing(false)
      setSyncProgress(null)
    }
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-600">
            <MaterialIcon name="sync" />
            Sinkronisasi
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Sinkron ke Google Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Sinkronkan jadwal DailyFlow kamu ke
            Google Tasks.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Jadwal DailyFlow
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Kirim jadwal hari ini ke daftar
                    tugas Google kamu.
                  </p>
                </div>

                <span
                  className={`max-w-[220px] shrink-0 truncate rounded-full border px-2.5 py-1 text-xs font-medium ${
                    isConnected
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {isConnected
                    ? connectionEmail
                      ? `Terhubung · ${connectionEmail}`
                      : "Terhubung"
                    : "Belum terhubung"}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-6">
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500">
                  Rentang sinkronisasi
                </p>

                <div className="flex gap-2">
                  {SYNC_RANGE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setSyncDays(option.value)
                      }
                      disabled={syncing}
                      className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        syncDays === option.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={
                  isConnected
                    ? handleSyncToGoogleTasks
                    : handleConnectGoogle
                }
                disabled={
                  connecting ||
                  syncing ||
                  !clientIdConfigured ||
                  (isConnected &&
                    activities.length === 0)
                }
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isConnected
                    ? "border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700"
                    : "border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700"
                }`}
              >
                <MaterialIcon
                  name={
                    syncing
                      ? "progress_activity"
                      : isConnected
                        ? "sync"
                        : "login"
                  }
                  className="text-white"
                />

                <span>
                  <span className="block">
                    {connecting
                      ? "Menghubungkan..."
                      : syncing
                        ? "Menyinkronkan..."
                        : isConnected
                          ? "Sinkronkan ke Google Tasks"
                          : "Login & Hubungkan Google"}
                  </span>

                  <span
                    className={`mt-0.5 block text-xs font-normal ${
                      isConnected
                        ? "text-emerald-100"
                        : "text-blue-100"
                    }`}
                  >
                    {syncing && syncProgress
                      ? `Mengirim ${syncProgress.current} dari ${syncProgress.total} aktivitas...`
                      : isConnected
                        ? `Kirim ${activities.length * syncDays} aktivitas (${syncDays === 1 ? "hari ini" : `${syncDays} hari`}) ke daftar "DailyFlow".`
                        : "Login dengan akun Google dan izinkan akses Tugas."}
                  </span>
                </span>
              </button>

              <a
                href="https://tasks.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <MaterialIcon
                  name="open_in_new"
                  className="text-slate-500"
                />

                <span>Buka Google Tasks</span>
              </a>

              <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MaterialIcon
                  name="info"
                  className="text-slate-400"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Di Google Tasks, pilih daftar
                  "DailyFlow" lewat menu daftar di
                  kiri. Pastikan akun Google yang dibuka
                  sama dengan akun yang dipilih saat
                  sinkron.
                </p>
              </div>

              {!clientIdConfigured && (
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <MaterialIcon
                    name="warning"
                    className="text-amber-600"
                  />

                  <p className="text-xs leading-5 text-amber-700">
                    Fitur sinkron Google Tasks belum
                    aktif. Silakan coba lagi nanti.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-5">
              <div className="flex gap-3">
                <MaterialIcon
                  name="info"
                  className="text-slate-400"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Sinkronisasi hanya menulis ke daftar
                  tugas "DailyFlow" di Google Tasks dan
                  tidak menyentuh kalender kamu.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Cara sinkron ke Google Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tiga langkah untuk memindahkan jadwal
                DailyFlow ke Google Tasks.
              </p>
            </div>

            <div className="space-y-4 p-6">
              <Step
                number="1"
                title="Hubungkan akun Google"
                description="Pilih akun Google dan izinkan akses ke Tugas."
              />

              <Step
                number="2"
                title="Siapkan jadwal"
                description="Pastikan jadwal DailyFlow sudah tersedia di daftar aktivitas."
              />

              <Step
                number="3"
                title="Klik Sinkronkan"
                description="Aktivitas muncul di daftar tugas DailyFlow pada aplikasi Google Tasks."
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
                  : syncing
                    ? "Menyinkronkan ke Google Tasks..."
                    : `${activities.length} aktivitas dari jadwal terbaru`}
              </p>
            </div>

            <div className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 sm:block">
              {activities.length} Blok
            </div>
          </div>

          <div className="relative p-6">
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
              <div
                className={`divide-y divide-slate-100 ${
                  syncing
                    ? "pointer-events-none opacity-40"
                    : ""
                }`}
              >
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

      {syncing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-busy="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <MaterialIcon
              name="progress_activity"
              className="text-[32px] text-blue-600"
            />

            <p className="mt-3 text-base font-semibold text-slate-900">
              Menyinkronkan ke Google Tasks
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {syncProgress
                ? `Mengirim ${syncProgress.current} dari ${syncProgress.total} aktivitas...`
                : "Mohon tunggu sebentar..."}
            </p>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${
                    syncProgress?.total
                      ? Math.round(
                          (syncProgress.current /
                            syncProgress.total) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Jangan tutup atau pindah halaman.
            </p>
          </div>
        </div>
      )}
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

export default ExportSyncPage