import { useMemo, useState } from "react"
import MaterialIcon from "../ui/MaterialIcon"

function getScheduleType(category) {
  if (category === "work" || category === "study") {
    return "core"
  }

  if (
    category === "sleep" ||
    category === "meal"
  ) {
    return "locked"
  }

  if (
    category === "rest" ||
    category === "hobby"
  ) {
    return "flexible"
  }

  return "scheduled"
}

function getScheduleStatus(category) {
  if (
    category === "sleep" ||
    category === "meal"
  ) {
    return "Terkunci"
  }

  if (
    category === "rest" ||
    category === "hobby"
  ) {
    return "Fleksibel"
  }

  if (
    category === "work" ||
    category === "study"
  ) {
    return "Inti"
  }

  return "Terjadwal"
}

function getCategoryLabel(category) {
  const labels = {
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

  return labels[category] || "Aktivitas"
}

function getScheduleStyles(type) {
  if (type === "core") {
    return {
      time: "text-blue-600",
      line: "bg-blue-600",
      badge: "bg-blue-600 text-white",
    }
  }

  if (type === "flexible") {
    return {
      time: "text-slate-500",
      line: "bg-slate-300",
      badge: "bg-slate-100 text-slate-600",
    }
  }

  if (type === "scheduled") {
    return {
      time: "text-slate-500",
      line: "bg-slate-300",
      badge: "bg-slate-100 text-slate-600",
    }
  }

  return {
    time: "text-slate-600",
    line: "bg-slate-400",
    badge: "bg-slate-200 text-slate-600",
  }
}

function timeToMinutes(time) {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    return null
  }

  const [hours, minutes] = time.split(":").map(Number)

  return hours * 60 + minutes
}

function getDurationInMinutes(startTime, endTime) {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)

  if (start === null || end === null) {
    return 0
  }

  if (end >= start) {
    return end - start
  }

  return 24 * 60 - start + end
}

function formatHours(minutes) {
  return `${(minutes / 60).toFixed(1)} Jam`
}

function normalizeSchedule(planSchedule = []) {
  return planSchedule.map((item, index) => {
    const category = item.category || "other"

    return {
      id: item.id || index + 1,
      time: `${item.startTime} - ${item.endTime}`,
      startTime: item.startTime,
      endTime: item.endTime,
      title: item.activity || "Untitled activity",
      category:
        item.description ||
        getCategoryLabel(category),
      status: getScheduleStatus(category),
      type: getScheduleType(category),
      categoryType: category,
      description: item.description || "",
    }
  })
}

function calculateConflicts(schedules) {
  const conflicts = []

  for (let i = 0; i < schedules.length; i += 1) {
    const current = schedules[i]

    const currentStart = timeToMinutes(current.startTime)
    let currentEnd = timeToMinutes(current.endTime)

    if (currentStart === null || currentEnd === null) {
      continue
    }

    if (currentEnd <= currentStart) {
      currentEnd += 24 * 60
    }

    for (let j = i + 1; j < schedules.length; j += 1) {
      const next = schedules[j]

      let nextStart = timeToMinutes(next.startTime)
      let nextEnd = timeToMinutes(next.endTime)

      if (nextStart === null || nextEnd === null) {
        continue
      }

      if (nextEnd <= nextStart) {
        nextEnd += 24 * 60
      }

      if (nextStart < currentStart) {
        nextStart += 24 * 60
        nextEnd += 24 * 60
      }

      if (
        currentStart < nextEnd &&
        nextStart < currentEnd
      ) {
        conflicts.push([current.id, next.id])
      }
    }
  }

  return conflicts
}

function DashboardSchedule({ plan, form, onEdit }) {
  const [selectedIds, setSelectedIds] = useState([])
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiRequest, setAiRequest] = useState("")

  const schedules = useMemo(
    () => normalizeSchedule(plan?.schedule || []),
    [plan?.schedule]
  )

  const metrics = useMemo(() => {
    const totalMinutes = schedules.reduce(
      (total, schedule) =>
        total +
        getDurationInMinutes(
          schedule.startTime,
          schedule.endTime
        ),
      0
    )

    const coreMinutes = schedules
      .filter((schedule) => schedule.type === "core")
      .reduce(
        (total, schedule) =>
          total +
          getDurationInMinutes(
            schedule.startTime,
            schedule.endTime
          ),
        0
      )

    const conflictPairs = calculateConflicts(schedules)

    return {
      totalMinutes,
      coreMinutes,
      flexibleMinutes: schedules
        .filter((schedule) => schedule.type === "flexible")
        .reduce(
          (total, schedule) =>
            total +
            getDurationInMinutes(
              schedule.startTime,
              schedule.endTime
            ),
          0
        ),
      coreSessions: schedules.filter(
        (schedule) => schedule.type === "core"
      ).length,
      conflicts: conflictPairs.length,
    }
  }, [schedules])

  const toggleSchedule = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    )
  }

  const selectAll = () => {
    if (selectedIds.length === schedules.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(
        schedules.map((schedule) => schedule.id)
      )
    }
  }

  const selectedSchedules = schedules.filter((schedule) =>
    selectedIds.includes(schedule.id)
  )

  const handleAiRevision = () => {
    if (selectedSchedules.length === 0) return

    setIsAiModalOpen(true)
  }

  const handleGenerateRevision = () => {
    const promptData = {
      selectedSchedules,
      userRequest: aiRequest,
      currentSchedule: schedules,
      userForm: form,
    }

    console.log("AI Revision Prompt Data:", promptData)
  }

  return (
    <div className="w-full">
      {/* Success notification */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <MaterialIcon className="text-[22px]">
              check_circle
            </MaterialIcon>
          </div>

          <div>
            <p className="text-base font-semibold leading-6 text-slate-900">
              Rutinitas Harian Berhasil Dibuat!
            </p>

            <p className="mt-0.5 text-xs leading-[18px] text-slate-500">
              DailyFlow telah menyusun{" "}
              <span className="font-medium text-slate-700">
                {schedules.length} blok waktu
              </span>{" "}
              berdasarkan data dan preferensi Anda.
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          Tersimpan Otomatis
        </span>
      </div>

      {/* Page heading */}
      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            RUTINITAS TERJADWAL
          </div>

          <h1 className="text-2xl font-semibold leading-10 tracking-tight text-slate-900">
            Jadwal Rutinitas Harian (Generated Flow)
          </h1>

          <p className="mt-1 text-sm leading-[22px] text-slate-500">
            {plan?.summary ||
              "Jadwal harian yang dibuat berdasarkan profil, rutinitas, dan prioritas Anda."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <MaterialIcon className="text-[18px] text-slate-500">
              refresh
            </MaterialIcon>

            Atur Ulang / Re-generate
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <MaterialIcon className="text-[18px]">
              sync_alt
            </MaterialIcon>

            Sinkronkan ke Google Calendar →
          </button>
        </div>
      </div>

      {/* Metrics */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Waktu Terjadwal"
          value={formatHours(metrics.totalMinutes)}
          description={`${schedules.length} blok dari jadwal yang dibuat`}
          icon="schedule"
        />

        <MetricCard
          label="Waktu Fleksibel"
          value={formatHours(metrics.flexibleMinutes)}
          description="Waktu istirahat, hobi, dan aktivitas fleksibel"
          icon="self_improvement"
        />

        <MetricCard
          label="Sesi Fokus Inti"
          value={`${metrics.coreSessions} Sesi`}
          description={`${formatHours(metrics.coreMinutes)} untuk kerja atau belajar`}
          icon="psychology"
        />

        <MetricCard
          label="Status Konflik"
          value={`${metrics.conflicts} Tabrakan`}
          description={
            metrics.conflicts === 0
              ? `Semua ${schedules.length} blok tidak bertabrakan`
              : `${metrics.conflicts} pasangan jadwal perlu diperiksa`
          }
          icon={metrics.conflicts === 0 ? "verified" : "warning"}
          highlight={metrics.conflicts === 0}
        />
      </section>

      {/* Main content */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Timeline */}
        <section className="min-w-0 lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MaterialIcon className="text-[20px] text-slate-500">
                view_timeline
              </MaterialIcon>

              <h2 className="text-base font-semibold leading-6 text-slate-900">
                Kronologi Rutinitas Harian
              </h2>
            </div>

            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              {selectedIds.length === schedules.length &&
              schedules.length > 0
                ? "Batalkan Semua"
                : "Pilih Semua"}
            </button>
          </div>

          {/* Selection action bar */}
          {selectedIds.length > 0 && (
            <div className="mb-3 flex flex-col justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                  <MaterialIcon className="text-[16px]">
                    check
                  </MaterialIcon>
                </div>

                <span className="text-sm font-medium text-slate-800">
                  {selectedIds.length} blok jadwal dipilih
                </span>
              </div>

              <button
                type="button"
                onClick={handleAiRevision}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <MaterialIcon className="text-[18px]">
                  auto_awesome
                </MaterialIcon>

                Edit dengan AI
              </button>
            </div>
          )}

          <div className="space-y-2">
            {schedules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <MaterialIcon className="text-[28px] text-slate-400">
                  event_busy
                </MaterialIcon>

                <p className="mt-3 text-sm font-medium text-slate-700">
                  Belum ada jadwal
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Generate plan terlebih dahulu untuk melihat rutinitas Anda.
                </p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  selected={selectedIds.includes(schedule.id)}
                  onSelect={() => toggleSchedule(schedule.id)}
                  onEdit={onEdit}
                />
              ))
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-6 lg:col-span-4">
          <SyncCard scheduleCount={schedules.length} />
          <TipsCard />
        </aside>
      </div>

      {/* AI Revision Modal */}
      {isAiModalOpen && (
        <AiRevisionModal
          selectedSchedules={selectedSchedules}
          value={aiRequest}
          onChange={setAiRequest}
          onClose={() => setIsAiModalOpen(false)}
          onGenerate={handleGenerateRevision}
        />
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  description,
  icon,
  highlight = false,
}) {
  return (
    <div className="flex min-h-[156px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>

        <MaterialIcon className="shrink-0 text-[20px] text-blue-600">
          {icon}
        </MaterialIcon>
      </div>

      <div>
        <span
          className={`text-2xl font-semibold leading-10 tracking-tight ${
            highlight ? "text-blue-600" : "text-slate-900"
          }`}
        >
          {value}
        </span>

        <p className="mt-1 text-xs leading-[18px] text-slate-500">
          {description}
        </p>
      </div>
    </div>
  )
}

function ScheduleCard({
  schedule,
  selected,
  onSelect,
  onEdit,
}) {
  const styles = getScheduleStyles(schedule.type)

  return (
    <div
      className={`flex flex-col justify-between gap-3 rounded-xl border bg-white p-4 transition-all sm:flex-row sm:items-center ${
        selected
          ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <label className="flex h-10 w-6 shrink-0 cursor-pointer items-center justify-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </label>

        <div
          className={`w-24 shrink-0 text-sm font-medium ${styles.time}`}
        >
          {schedule.time}
        </div>

        <div
          className={`h-10 w-1.5 shrink-0 rounded-full ${styles.line}`}
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-slate-900">
            {schedule.title}
          </p>

          <p className="mt-0.5 text-xs leading-[18px] text-slate-500">
            {schedule.category}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${styles.badge}`}
        >
          {schedule.status}
        </span>

        <button
          type="button"
          title="Edit blok jadwal"
          aria-label="Edit jadwal"
          onClick={onEdit}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
        >
          <MaterialIcon className="text-[18px]">
            edit
          </MaterialIcon>
        </button>

        <button
          type="button"
          title="Hapus blok jadwal"
          aria-label="Hapus jadwal"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <MaterialIcon className="text-[18px]">
            delete
          </MaterialIcon>
        </button>
      </div>
    </div>
  )
}

function AiRevisionModal({
  selectedSchedules,
  value,
  onChange,
  onClose,
  onGenerate,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MaterialIcon className="text-[20px]">
                  auto_awesome
                </MaterialIcon>
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                Edit Jadwal dengan AI
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Jelaskan perubahan yang Anda inginkan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <MaterialIcon className="text-[20px]">
              close
            </MaterialIcon>
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Blok yang akan direvisi
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedSchedules.map((schedule) => (
              <span
                key={schedule.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
              >
                <span className="text-blue-600">
                  {schedule.time}
                </span>

                <span className="text-slate-300">•</span>

                {schedule.title}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          <label
            htmlFor="ai-request"
            className="mb-2 block text-sm font-medium text-slate-900"
          >
            Apa yang ingin Anda ubah?
          </label>

          <textarea
            id="ai-request"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Contoh: Saya ingin lebih fokus belajar di malam hari dan mengurangi aktivitas yang kurang penting."
            rows={5}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs leading-[18px] text-slate-500">
            DailyFlow akan mempertimbangkan blok yang dipilih,
            jadwal lainnya, serta batasan rutinitas Anda.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!value.trim()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MaterialIcon className="text-[18px]">
              auto_awesome
            </MaterialIcon>

            Generate Perubahan
          </button>
        </div>
      </div>
    </div>
  )
}

function SyncCard({ scheduleCount }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <MaterialIcon className="text-[20px]">
            cloud_sync
          </MaterialIcon>
        </div>

        <div>
          <h3 className="text-base font-semibold leading-6 text-slate-900">
            Siap Disinkronkan
          </h3>

          <p className="text-xs leading-[18px] text-slate-500">
            Ekspor sekali klik ke kalender aktif Anda.
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-2 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Blok Jadwal:
          </span>

          <span className="text-xs font-medium text-slate-900">
            {scheduleCount} blok
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Kalender Tujuan:
          </span>

          <span className="text-xs font-medium text-blue-600">
            DailyFlow (Routine Layer)
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <SyncCheck text={`${scheduleCount} blok jadwal siap diekspor`} />
        <SyncCheck text="Peringatan notifikasi 10 menit sebelumnya" />
        <SyncCheck text="Deteksi jeda buffer aktif" />
      </div>

      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Sinkronkan Sekarang

        <MaterialIcon className="text-[16px]">
          arrow_forward
        </MaterialIcon>
      </button>

      <button
        type="button"
        className="mt-3 block w-full text-center text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
      >
        Buka Tab Export &amp; Sync →
      </button>
    </div>
  )
}

function SyncCheck({ text }) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <MaterialIcon className="text-[18px] text-blue-600">
        check
      </MaterialIcon>

      <span className="text-xs leading-[18px]">
        {text}
      </span>
    </div>
  )
}

function TipsCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <MaterialIcon className="text-[20px]">
            lightbulb
          </MaterialIcon>
        </div>

        <h3 className="text-base font-semibold leading-6 text-slate-900">
          Tips Ritme Harian
        </h3>
      </div>

      <ul className="space-y-4 text-xs leading-[18px] text-slate-500">
        <Tip
          title="Lindungi Sesi Fokus:"
          text="Gunakan blok kerja atau belajar sebagai waktu fokus utama dan minimalkan gangguan."
        />

        <Tip
          title="Jaga Ritme:"
          text="Pertahankan waktu tidur, makan, dan istirahat agar jadwal tetap realistis."
        />

        <Tip
          title="Manfaatkan Buffer:"
          text="Gunakan waktu fleksibel untuk menyesuaikan aktivitas tanpa mengganggu blok penting lainnya."
        />
      </ul>
    </div>
  )
}

function Tip({ title, text }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />

      <span>
        <strong className="font-medium text-slate-900">
          {title}
        </strong>{" "}
        {text}
      </span>
    </li>
  )
}

export default DashboardSchedule