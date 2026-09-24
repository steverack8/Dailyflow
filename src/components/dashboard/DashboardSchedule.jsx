import { useMemo, useState } from "react"

import MaterialIcon from "../ui/MaterialIcon"

function timeToMinutes(time) {
  if (!time || !time.includes(":")) {
    return 0
  }

  const [hours, minutes] = time.split(":").map(Number)

  return hours * 60 + minutes
}

function getDurationInMinutes(startTime, endTime) {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)

  if (end >= start) {
    return end - start
  }

  return 24 * 60 - start + end
}

function formatHours(minutes) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}m`
  }

  if (remainingMinutes === 0) {
    return `${hours}j`
  }

  return `${hours}j ${remainingMinutes}m`
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

  return labels[category] || "Lainnya"
}

function getScheduleType(category) {
  if (
    ["work", "study", "sleep"].includes(
      category
    )
  ) {
    return "core"
  }

  if (
    ["meal", "exercise", "personal"].includes(
      category
    )
  ) {
    return "scheduled"
  }

  return "flexible"
}

function getScheduleStyles(category) {
  const styles = {
    sleep: {
      dot: "bg-indigo-500",
      badge: "bg-indigo-50 text-indigo-700",
    },
    work: {
      dot: "bg-blue-600",
      badge: "bg-blue-50 text-blue-700",
    },
    study: {
      dot: "bg-violet-600",
      badge: "bg-violet-50 text-violet-700",
    },
    exercise: {
      dot: "bg-emerald-600",
      badge: "bg-emerald-50 text-emerald-700",
    },
    meal: {
      dot: "bg-orange-500",
      badge: "bg-orange-50 text-orange-700",
    },
    personal: {
      dot: "bg-cyan-600",
      badge: "bg-cyan-50 text-cyan-700",
    },
    hobby: {
      dot: "bg-pink-500",
      badge: "bg-pink-50 text-pink-700",
    },
    rest: {
      dot: "bg-slate-400",
      badge: "bg-slate-100 text-slate-700",
    },
    other: {
      dot: "bg-slate-500",
      badge: "bg-slate-100 text-slate-700",
    },
  }

  return styles[category] || styles.other
}

function normalizeSchedule(schedule) {
  if (!Array.isArray(schedule)) {
    return []
  }

  return schedule.map((item, index) => {
    const category = item.category || "other"

    return {
      ...item,
      id: item.id || `schedule-${index}`,
      startTime:
        item.startTime ||
        item.start ||
        item.time?.split("-")?.[0]?.trim() ||
        "00:00",
      endTime:
        item.endTime ||
        item.end ||
        item.time?.split("-")?.[1]?.trim() ||
        "00:00",
      title:
        item.title ||
        item.activity ||
        "Aktivitas",
      category,
      type:
        item.type ||
        getScheduleType(category),
      description:
        item.description ||
        getCategoryLabel(category),
    }
  })
}

function calculateConflicts(schedule) {
  const conflicts = new Set()

  for (
    let index = 0;
    index < schedule.length;
    index += 1
  ) {
    const current = schedule[index]

    for (
      let nextIndex = index + 1;
      nextIndex < schedule.length;
      nextIndex += 1
    ) {
      const next = schedule[nextIndex]

      const currentStart = timeToMinutes(
        current.startTime
      )
      const currentEnd = timeToMinutes(
        current.endTime
      )
      const nextStart = timeToMinutes(
        next.startTime
      )
      const nextEnd = timeToMinutes(
        next.endTime
      )

      if (
        currentStart < nextEnd &&
        nextStart < currentEnd
      ) {
        conflicts.add(current.id)
        conflicts.add(next.id)
      }
    }
  }

  return conflicts
}

function validateScheduleTime(
  startTime,
  endTime,
  schedule,
  currentId = null
) {
  if (!startTime || !endTime) {
    return "Waktu mulai dan waktu selesai wajib diisi."
  }

  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)

  if (start >= end) {
    return "Waktu selesai harus lebih dari waktu mulai."
  }

  const hasOverlap = schedule.some((item) => {
    if (item.id === currentId) {
      return false
    }

    const itemStart = timeToMinutes(
      item.startTime
    )
    const itemEnd = timeToMinutes(
      item.endTime
    )

    return (
      start < itemEnd &&
      itemStart < end
    )
  })

  if (hasOverlap) {
    return "Waktu aktivitas bertabrakan dengan aktivitas lain."
  }

  return ""
}

function DeleteConfirmationModal({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <MaterialIcon className="text-[22px]">
            delete
          </MaterialIcon>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function ScheduleForm({
  title,
  values,
  onChange,
  onCancel,
  onSave,
  error,
  saveLabel,
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <MaterialIcon className="text-[19px]">
            {saveLabel === "Tambah Aktivitas"
              ? "add"
              : "edit"}
          </MaterialIcon>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            Atur detail aktivitas dan waktunya.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Waktu Mulai
          </span>

          <input
            type="time"
            value={values.startTime}
            onChange={(event) =>
              onChange({
                ...values,
                startTime: event.target.value,
              })
            }
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Waktu Selesai
          </span>

          <input
            type="time"
            value={values.endTime}
            onChange={(event) =>
              onChange({
                ...values,
                endTime: event.target.value,
              })
            }
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Judul
          </span>

          <input
            type="text"
            value={values.title}
            onChange={(event) =>
              onChange({
                ...values,
                title: event.target.value,
              })
            }
            placeholder="Contoh: Membaca Buku"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Kategori
          </span>

          <select
            value={values.category}
            onChange={(event) =>
              onChange({
                ...values,
                category: event.target.value,
              })
            }
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="sleep">Tidur</option>
            <option value="work">Kerja</option>
            <option value="study">Belajar</option>
            <option value="exercise">Olahraga</option>
            <option value="meal">Makan</option>
            <option value="personal">
              Personal
            </option>
            <option value="hobby">Hobi</option>
            <option value="rest">
              Istirahat
            </option>
            <option value="other">
              Lainnya
            </option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Deskripsi
          </span>

          <textarea
            rows={3}
            value={values.description}
            onChange={(event) =>
              onChange({
                ...values,
                description: event.target.value,
              })
            }
            placeholder="Tambahkan keterangan aktivitas."
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <MaterialIcon className="mt-0.5 shrink-0 text-[18px]">
            error
          </MaterialIcon>

          <p>{error}</p>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <MaterialIcon className="text-[18px]">
            save
          </MaterialIcon>

          {saveLabel}
        </button>
      </div>
    </div>
  )
}

function DashboardSchedule({
  plan,
  form,
  onEdit,
  onUpdateSchedule,
  onAddSchedule,
  onDeleteSchedule,
}) {
  const [editingId, setEditingId] =
    useState(null)

  const [editingValues, setEditingValues] =
    useState(null)

  const [editingError, setEditingError] =
    useState("")

  const [isAdding, setIsAdding] =
    useState(false)

  const [newSchedule, setNewSchedule] =
    useState({
      startTime: "",
      endTime: "",
      title: "",
      category: "personal",
      description: "",
    })

  const [addError, setAddError] =
    useState("")

  const [deleteTarget, setDeleteTarget] =
    useState(null)

  const schedule = useMemo(
    () => normalizeSchedule(plan?.schedule),
    [plan?.schedule]
  )

  const conflicts = useMemo(
    () => calculateConflicts(schedule),
    [schedule]
  )

  const totalMinutes = useMemo(
    () =>
      schedule.reduce(
        (total, item) =>
          total +
          getDurationInMinutes(
            item.startTime,
            item.endTime
          ),
        0
      ),
    [schedule]
  )

  const flexibleMinutes = useMemo(
    () =>
      schedule
        .filter(
          (item) =>
            item.type === "flexible"
        )
        .reduce(
          (total, item) =>
            total +
            getDurationInMinutes(
              item.startTime,
              item.endTime
            ),
          0
        ),
    [schedule]
  )

  const handleStartEdit = (item) => {
    setIsAdding(false)
    setAddError("")

    setEditingId(item.id)

    setEditingError("")

    setEditingValues({
      startTime: item.startTime,
      endTime: item.endTime,
      title: item.title,
      category: item.category,
      description: item.description,
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingValues(null)
    setEditingError("")
  }

  const handleSaveEdit = async (
    itemId
  ) => {
    if (!editingValues) {
      return
    }

    if (!editingValues.title.trim()) {
      setEditingError(
        "Judul aktivitas wajib diisi."
      )
      return
    }

    const validationError =
      validateScheduleTime(
        editingValues.startTime,
        editingValues.endTime,
        schedule,
        itemId
      )

    if (validationError) {
      setEditingError(validationError)
      return
    }

    await onUpdateSchedule(
      itemId,
      {
        ...editingValues,
        title: editingValues.title.trim(),
        description:
          editingValues.description.trim(),
      }
    )

    setEditingId(null)
    setEditingValues(null)
    setEditingError("")
  }

  const handleStartAdd = () => {
    setEditingId(null)
    setEditingValues(null)
    setEditingError("")

    setNewSchedule({
      startTime: "",
      endTime: "",
      title: "",
      category: "personal",
      description: "",
    })

    setAddError("")
    setIsAdding(true)
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setAddError("")
  }

  const handleSaveAdd = async () => {
    if (!newSchedule.title.trim()) {
      setAddError(
        "Judul aktivitas wajib diisi."
      )
      return
    }

    const validationError =
      validateScheduleTime(
        newSchedule.startTime,
        newSchedule.endTime,
        schedule
      )

    if (validationError) {
      setAddError(validationError)
      return
    }

    await onAddSchedule({
      ...newSchedule,
      title: newSchedule.title.trim(),
      description:
        newSchedule.description.trim() ||
        getCategoryLabel(
          newSchedule.category
        ),
    })

    setIsAdding(false)
    setAddError("")
    setNewSchedule({
      startTime: "",
      endTime: "",
      title: "",
      category: "personal",
      description: "",
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return
    }

    const scheduleId =
      deleteTarget.id

    setDeleteTarget(null)

    await onDeleteSchedule(
      scheduleId
    )
  }

  return (
    <>
      <section>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Jadwal Hari Ini
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Rutinitas Anda
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {schedule.length} blok aktivitas
              dalam rutinitas Anda
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <MaterialIcon className="text-[18px]">
              add
            </MaterialIcon>

            Tambah Aktivitas
          </button>
        </div>

        {isAdding && (
          <div className="mb-6">
            <ScheduleForm
              title="Tambah Aktivitas"
              values={newSchedule}
              onChange={setNewSchedule}
              onCancel={handleCancelAdd}
              onSave={handleSaveAdd}
              error={addError}
              saveLabel="Tambah Aktivitas"
            />
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Rutinitas
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatHours(
                totalMinutes
              )}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Waktu Fleksibel
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatHours(
                flexibleMinutes
              )}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Potensi Benturan
            </p>

            <p
              className={`mt-2 text-2xl font-semibold ${
                conflicts.size > 0
                  ? "text-red-600"
                  : "text-slate-900"
              }`}
            >
              {conflicts.size}
            </p>
          </div>
        </div>

        {schedule.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MaterialIcon className="text-[25px]">
                event
              </MaterialIcon>
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              Belum ada aktivitas
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tambahkan aktivitas pertama
              ke rutinitas Anda.
            </p>

            <button
              type="button"
              onClick={handleStartAdd}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <MaterialIcon className="text-[18px]">
                add
              </MaterialIcon>

              Tambah Aktivitas
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((item) => {
              const styles =
                getScheduleStyles(
                  item.category
                )

              const isEditing =
                editingId === item.id

              const hasConflict =
                conflicts.has(item.id)

              if (isEditing) {
                return (
                  <ScheduleForm
                    key={item.id}
                    title="Edit Aktivitas"
                    values={
                      editingValues
                    }
                    onChange={
                      setEditingValues
                    }
                    onCancel={
                      handleCancelEdit
                    }
                    onSave={() =>
                      handleSaveEdit(
                        item.id
                      )
                    }
                    error={
                      editingError
                    }
                    saveLabel="Simpan"
                  />
                )
              }

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border bg-white p-4 shadow-sm ${
                    hasConflict
                      ? "border-red-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.startTime}{" "}
                          -{" "}
                          {item.endTime}
                        </p>

                        <span
                          className={`w-fit rounded-md px-2 py-1 text-[11px] font-medium ${styles.badge}`}
                        >
                          {getCategoryLabel(
                            item.category
                          )}
                        </span>

                        {hasConflict && (
                          <span className="inline-flex w-fit items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700">
                            <MaterialIcon className="text-[14px]">
                              warning
                            </MaterialIcon>

                            Benturan
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-base font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleStartEdit(
                            item
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Edit manual"
                      >
                        <MaterialIcon className="text-[19px]">
                          edit
                        </MaterialIcon>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(
                            item
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Hapus aktivitas"
                      >
                        <MaterialIcon className="text-[19px]">
                          delete
                        </MaterialIcon>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <DeleteConfirmationModal
        isOpen={Boolean(
          deleteTarget
        )}
        title="Hapus aktivitas?"
        description={
          deleteTarget
            ? `Aktivitas "${deleteTarget.title}" akan dihapus dari rutinitas harian Anda.`
            : ""
        }
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={
          handleDeleteConfirm
        }
      />
    </>
  )
}

export default DashboardSchedule