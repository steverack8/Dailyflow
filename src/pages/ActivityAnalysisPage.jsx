import { useEffect, useMemo, useState } from "react"

import MaterialIcon from "../components/ui/MaterialIcon"
import { useAuth } from "../contexts/AuthContext"
import { getLatestDailyPlan } from "../services/firestoreService"
import { analyzeDailyPlan } from "../services/aiService"
import { buildAnalysisPrompt } from "../prompts/analysisPrompt"

const CATEGORY_CONFIG = {
  sleep: {
    label: "Tidur",
    icon: "bedtime",
  },
  work: {
    label: "Kerja",
    icon: "work",
  },
  study: {
    label: "Belajar",
    icon: "school",
  },
  exercise: {
    label: "Olahraga",
    icon: "fitness_center",
  },
  meal: {
    label: "Makan",
    icon: "restaurant",
  },
  personal: {
    label: "Personal",
    icon: "person",
  },
  hobby: {
    label: "Hobi",
    icon: "sports_esports",
  },
  rest: {
    label: "Istirahat",
    icon: "self_improvement",
  },
  other: {
    label: "Lainnya",
    icon: "more_horiz",
  },
}

function timeToMinutes(time) {
  if (!time || typeof time !== "string") {
    return null
  }

  const [hours, minutes] =
    time.split(":").map(Number)

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null
  }

  return hours * 60 + minutes
}

function getDurationMinutes(
  startTime,
  endTime
) {
  const start =
    timeToMinutes(startTime)

  const end =
    timeToMinutes(endTime)

  if (start === null || end === null) {
    return 0
  }

  if (end >= start) {
    return end - start
  }

  return 24 * 60 - start + end
}

function formatDuration(minutes) {
  if (!minutes || minutes <= 0) {
    return "0 jam"
  }

  const hours = Math.floor(
    minutes / 60
  )

  const remainingMinutes =
    minutes % 60

  if (!hours) {
    return `${remainingMinutes} menit`
  }

  if (!remainingMinutes) {
    return `${hours} jam`
  }

  return `${hours} jam ${remainingMinutes} mnt`
}

function getCategoryConfig(category) {
  return (
    CATEGORY_CONFIG[category] ||
    CATEGORY_CONFIG.other
  )
}

function ActivityAnalysisPage() {
  const { user } = useAuth()

  const [plan, setPlan] = useState(null)
  const [isLoading, setIsLoading] =
    useState(true)

  const [isAnalyzing, setIsAnalyzing] =
    useState(false)

  const [analysis, setAnalysis] =
    useState(null)

  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadPlan() {
      if (!user?.uid) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError("")

        const latestPlan =
          await getLatestDailyPlan(
            user.uid
          )

        if (!isMounted) {
          return
        }

        setPlan(latestPlan || null)
      } catch (loadError) {
        console.error(
          "Failed to load plan for analysis:",
          loadError
        )

        if (isMounted) {
          setError(
            "Gagal memuat rutinitas harian."
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPlan()

    return () => {
      isMounted = false
    }
  }, [user?.uid])

  const schedule = useMemo(() => {
    if (!Array.isArray(plan?.schedule)) {
      return []
    }

    return [...plan.schedule].sort(
      (a, b) =>
        (timeToMinutes(a.startTime) ??
          0) -
        (timeToMinutes(b.startTime) ??
          0)
    )
  }, [plan])

  const statistics = useMemo(() => {
    const categories = Object.keys(
      CATEGORY_CONFIG
    ).reduce((result, category) => {
      result[category] = 0
      return result
    }, {})

    let totalMinutes = 0

    schedule.forEach((item) => {
      const duration =
        getDurationMinutes(
          item.startTime,
          item.endTime
        )

      const category =
        CATEGORY_CONFIG[item.category]
          ? item.category
          : "other"

      categories[category] += duration
      totalMinutes += duration
    })

    return {
      categories,
      totalMinutes,
      sleepMinutes:
        categories.sleep || 0,
      workMinutes:
        categories.work || 0,
      studyMinutes:
        categories.study || 0,
      exerciseMinutes:
        categories.exercise || 0,
      restMinutes:
        categories.rest || 0,
    }
  }, [schedule])

  const maxCategoryMinutes = useMemo(
    () =>
      Math.max(
        ...Object.values(
          statistics.categories
        ),
        1
      ),
    [statistics.categories]
  )

  const handleAnalyze = async () => {
    if (!plan) {
      return
    }

    try {
      setIsAnalyzing(true)
      setError("")

      const prompt =
        buildAnalysisPrompt({
          sourceData:
            plan.sourceData || {},
          schedule,
        })

      const result =
        await analyzeDailyPlan(prompt)

      setAnalysis(result)
    } catch (analysisError) {
      console.error(
        "Failed to analyze daily plan:",
        analysisError
      )

      setError(
        analysisError?.message ||
          "Gagal menganalisis jadwal. Silakan coba lagi."
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#f8f9ff]">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-6">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <MaterialIcon className="animate-spin text-[20px]">
              progress_activity
            </MaterialIcon>

            Memuat analisis...
          </div>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#f8f9ff]">
        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MaterialIcon className="text-[28px]">
                analytics
              </MaterialIcon>
            </div>

            <h1 className="mt-5 text-xl font-semibold text-slate-900">
              Belum ada rutinitas untuk dianalisis
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Buat rutinitas harian terlebih dahulu
              sebelum melihat analisis aktivitas.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8f9ff]">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-600">
              DailyFlow
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Analisis Aktivitas
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Lihat bagaimana waktu Anda terbagi
              dalam satu hari dan dapatkan analisis
              dari AI.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MaterialIcon
              className={
                isAnalyzing
                  ? "animate-spin text-[18px]"
                  : "text-[18px]"
              }
            >
              {isAnalyzing
                ? "progress_activity"
                : "auto_awesome"}
            </MaterialIcon>

            {isAnalyzing
              ? "Menganalisis..."
              : "Analisis dengan AI"}
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <MaterialIcon className="mt-0.5 text-[19px]">
              error
            </MaterialIcon>

            <p>{error}</p>
          </div>
        )}

        {/* Overview */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="schedule"
            label="Aktivitas terjadwal"
            value={schedule.length}
            suffix="aktivitas"
          />

          <StatCard
            icon="bedtime"
            label="Waktu tidur"
            value={formatDuration(
              statistics.sleepMinutes
            )}
          />

          <StatCard
            icon="work"
            label="Waktu kerja"
            value={formatDuration(
              statistics.workMinutes
            )}
          />

          <StatCard
            icon="self_improvement"
            label="Waktu istirahat"
            value={formatDuration(
              statistics.restMinutes
            )}
          />
        </section>

        {/* Category analysis */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Pembagian Aktivitas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Durasi berdasarkan kategori aktivitas
              dalam jadwal Anda.
            </p>
          </div>

          <div className="space-y-5">
            {Object.entries(
              statistics.categories
            )
              .filter(([, minutes]) => minutes > 0)
              .map(
                ([category, minutes]) => {
                  const config =
                    getCategoryConfig(
                      category
                    )

                  const percentage =
                    Math.round(
                      (minutes /
                        maxCategoryMinutes) *
                        100
                    )

                  return (
                    <div
                      key={category}
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-2">
                          <MaterialIcon className="text-[19px] text-slate-500">
                            {config.icon}
                          </MaterialIcon>

                          <span className="text-sm font-medium text-slate-700">
                            {config.label}
                          </span>
                        </div>

                        <span className="shrink-0 text-sm text-slate-500">
                          {formatDuration(
                            minutes
                          )}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                }
              )}
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Timeline Harian
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Aktivitas yang tersusun dalam satu hari.
            </p>
          </div>

          <div className="space-y-3">
            {schedule.map(
              (item, index) => {
                const config =
                  getCategoryConfig(
                    item.category
                  )

                const duration =
                  getDurationMinutes(
                    item.startTime,
                    item.endTime
                  )

                return (
                  <div
                    key={
                      item.id ||
                      `timeline-${index}`
                    }
                    className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="w-24 shrink-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.startTime}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.endTime}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1 border-l border-slate-200 pl-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </h3>

                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                          {config.label}
                        </span>
                      </div>

                      {item.description && (
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDuration(
                          duration
                        )}
                      </p>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </section>

        {/* AI Analysis */}
        {analysis && (
          <>
            <section className="mt-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MaterialIcon className="text-[21px]">
                    auto_awesome
                  </MaterialIcon>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Analisis AI
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {analysis.summary}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <AnalysisCard
                icon="bedtime"
                title="Tidur & Pemulihan"
              >
                <p className="text-sm leading-6 text-slate-600">
                  {analysis.sleep
                    ?.assessment}
                </p>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Durasi berdasarkan jadwal
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {analysis.sleep
                      ?.duration || "-"}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {analysis.sleep
                    ?.recommendation}
                </p>
              </AnalysisCard>

              <AnalysisCard
                icon="balance"
                title="Keseimbangan Jadwal"
              >
                <p className="text-sm leading-6 text-slate-600">
                  {analysis.balance
                    ?.assessment}
                </p>

                {analysis.balance
                  ?.strengths
                  ?.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Yang sudah baik
                    </p>

                    <ul className="space-y-2">
                      {analysis.balance.strengths.map(
                        (item, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm leading-5 text-slate-600"
                          >
                            <MaterialIcon className="mt-0.5 text-[17px] text-emerald-600">
                              check_circle
                            </MaterialIcon>

                            <span>
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {analysis.balance
                  ?.concerns
                  ?.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Perlu diperhatikan
                    </p>

                    <ul className="space-y-2">
                      {analysis.balance.concerns.map(
                        (item, index) => (
                          <li
                            key={index}
                            className="flex gap-2 text-sm leading-5 text-slate-600"
                          >
                            <MaterialIcon className="mt-0.5 text-[17px] text-amber-500">
                              info
                            </MaterialIcon>

                            <span>
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </AnalysisCard>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Analisis Kategori
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Catatan AI berdasarkan pembagian aktivitas.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(
                  analysis.categories || {}
                ).map(
                  ([category, text]) => {
                    const config =
                      getCategoryConfig(
                        category
                      )

                    if (!text) {
                      return null
                    }

                    return (
                      <div
                        key={category}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                      >
                        <div className="flex items-center gap-2">
                          <MaterialIcon className="text-[19px] text-slate-500">
                            {config.icon}
                          </MaterialIcon>

                          <h3 className="text-sm font-semibold text-slate-900">
                            {config.label}
                          </h3>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {text}
                        </p>
                      </div>
                    )
                  }
                )}
              </div>
            </section>

            {analysis.recommendations
              ?.length > 0 && (
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Rekomendasi
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Beberapa perubahan yang dapat
                    dipertimbangkan berdasarkan analisis.
                  </p>
                </div>

                <div className="space-y-3">
                  {analysis.recommendations.map(
                    (
                      recommendation,
                      index
                    ) => (
                      <RecommendationItem
                        key={index}
                        recommendation={
                          recommendation
                        }
                      />
                    )
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  suffix,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <MaterialIcon className="text-[20px]">
          {icon}
        </MaterialIcon>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-slate-900">
        {value}
      </p>

      {suffix && (
        <p className="mt-1 text-xs text-slate-400">
          {suffix}
        </p>
      )}
    </div>
  )
}

function AnalysisCard({
  icon,
  title,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <MaterialIcon className="text-[20px]">
            {icon}
          </MaterialIcon>
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      {children}
    </div>
  )
}

function RecommendationItem({
  recommendation,
}) {
  const priorityStyles = {
    high: {
      label: "Prioritas tinggi",
      className:
        "bg-red-50 text-red-600",
    },
    medium: {
      label: "Prioritas sedang",
      className:
        "bg-amber-50 text-amber-600",
    },
    low: {
      label: "Prioritas rendah",
      className:
        "bg-slate-100 text-slate-500",
    },
  }

  const priority =
    priorityStyles[
      recommendation?.priority
    ] || priorityStyles.low

  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {recommendation?.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {recommendation?.description}
          </p>
        </div>

        <span
          className={`shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-medium ${priority.className}`}
        >
          {priority.label}
        </span>
      </div>
    </div>
  )
}

export default ActivityAnalysisPage