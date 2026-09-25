import { useEffect, useState } from "react"

import DashboardSchedule from "../components/dashboard/DashboardSchedule"
import PlanModal from "../components/planner/PlanModal"
import MaterialIcon from "../components/ui/MaterialIcon"
import { useAuth } from "../contexts/AuthContext"
import { generateDailyPlan } from "../services/aiService"
import {
  getLatestDailyPlan,
  saveDailyPlan,
  updateDailyPlan,
} from "../services/firestoreService"
import { buildInitialPlanPrompt } from "../prompts/initialPlanPrompt"

function DashboardPage() {
  const { user } = useAuth()

  const [plan, setPlan] = useState(null)
  const [form, setForm] = useState(null)
  const [hasPlan, setHasPlan] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [isPlanModalOpen, setIsPlanModalOpen] =
    useState(false)

  const [isGenerating, setIsGenerating] =
    useState(false)

  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadPlan() {
      if (!user?.uid) {
        return
      }

      try {
        setIsLoading(true)
        setError("")

        const latestPlan =
          await getLatestDailyPlan(user.uid)

        if (!isMounted) {
          return
        }

        if (latestPlan) {
          setPlan(latestPlan)
          setForm(latestPlan.sourceData || null)
          setHasPlan(true)
        } else {
          setPlan(null)
          setForm(null)
          setHasPlan(false)
        }
      } catch (loadError) {
        console.error(
          "Failed to load daily plan:",
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

  const handleGenerate = async (formData) => {
    if (!user?.uid) {
      return
    }

    try {
      setIsGenerating(true)
      setError("")

      const prompt =
        buildInitialPlanPrompt(formData)

      const generatedPlan =
        await generateDailyPlan(prompt)

      if (!generatedPlan) {
        throw new Error(
          "Rencana yang dibuat kosong."
        )
      }

      const schedule = Array.isArray(
        generatedPlan.schedule
      )
        ? generatedPlan.schedule
        : []

      const updatedPlanData = {
        summary: generatedPlan.summary || "",
        schedule,
        sourceData: formData,
      }

      if (plan?.id) {
        await updateDailyPlan(
          user.uid,
          plan.id,
          updatedPlanData
        )

        setPlan({
          id: plan.id,
          ...updatedPlanData,
        })
      } else {
        const planId = await saveDailyPlan(
          user.uid,
          generatedPlan,
          formData
        )

        setPlan({
          id: planId,
          ...updatedPlanData,
        })
      }

      setForm(formData)
      setHasPlan(true)
      setIsPlanModalOpen(false)
    } catch (generateError) {
      console.error(
        "Failed to generate daily plan:",
        generateError
      )

      setError(
        generateError?.message ||
          "Gagal membuat rutinitas harian. Silakan coba lagi."
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateSchedule = async (
    scheduleId,
    updates
  ) => {
    if (!user?.uid || !plan?.id) {
      return
    }

    try {
      setError("")

      const currentSchedule =
        Array.isArray(plan.schedule)
          ? plan.schedule
          : []

      const updatedSchedule =
        currentSchedule.map(
          (item, index) => {
            const itemId =
              item.id ||
              `schedule-${index}`

            if (itemId !== scheduleId) {
              return item
            }

            return {
              ...item,
              ...updates,
            }
          }
        )

      await updateDailyPlan(
        user.uid,
        plan.id,
        {
          schedule: updatedSchedule,
        }
      )

      setPlan((currentPlan) => ({
        ...currentPlan,
        schedule: updatedSchedule,
      }))
    } catch (updateError) {
      console.error(
        "Failed to update schedule:",
        updateError
      )

      setError(
        "Gagal memperbarui blok jadwal."
      )
    }
  }

  const handleAddSchedule = async (
    scheduleData
  ) => {
    if (!user?.uid || !plan?.id) {
      return
    }

    try {
      setError("")

      const currentSchedule =
        Array.isArray(plan.schedule)
          ? plan.schedule
          : []

      const newSchedule = {
        id: `schedule-${Date.now()}`,
        ...scheduleData,
      }

      const updatedSchedule = [
        ...currentSchedule,
        newSchedule,
      ].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      )

      await updateDailyPlan(
        user.uid,
        plan.id,
        {
          schedule: updatedSchedule,
        }
      )

      setPlan((currentPlan) => ({
        ...currentPlan,
        schedule: updatedSchedule,
      }))
    } catch (addError) {
      console.error(
        "Failed to add schedule:",
        addError
      )

      setError(
        "Gagal menambahkan aktivitas."
      )
    }
  }

  const handleDeleteSchedule = async (
    scheduleId
  ) => {
    if (!user?.uid || !plan?.id) {
      return
    }

    try {
      setError("")

      const currentSchedule =
        Array.isArray(plan.schedule)
          ? plan.schedule
          : []

      const updatedSchedule =
        currentSchedule.filter(
          (item, index) => {
            const itemId =
              item.id ||
              `schedule-${index}`

            return itemId !== scheduleId
          }
        )

      await updateDailyPlan(
        user.uid,
        plan.id,
        {
          schedule: updatedSchedule,
        }
      )

      setPlan((currentPlan) => ({
        ...currentPlan,
        schedule: updatedSchedule,
      }))
    } catch (deleteError) {
      console.error(
        "Failed to delete schedule:",
        deleteError
      )

      setError(
        "Gagal menghapus blok jadwal."
      )
    }
  }

  const handleOpenPlanner = () => {
    setError("")
    setIsPlanModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#f8f9ff]">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-6 py-10">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <MaterialIcon className="animate-spin text-[20px]">
              progress_activity
            </MaterialIcon>

            Memuat rutinitas harian...
          </div>
        </div>
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
              Rutinitas Harian
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Atur aktivitas harian berdasarkan
              kebutuhan, kebiasaan, dan prioritas Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenPlanner}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <MaterialIcon className="text-[18px]">
              auto_awesome
            </MaterialIcon>

            Atur Ulang Jadwal
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

        {!hasPlan ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MaterialIcon className="text-[28px]">
                calendar_month
              </MaterialIcon>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Belum ada rutinitas harian
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Isi informasi tentang diri dan aktivitas
              Anda untuk membuat rutinitas harian dengan
              DailyFlow.
            </p>

            <button
              type="button"
              onClick={handleOpenPlanner}
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <MaterialIcon className="text-[18px]">
                add
              </MaterialIcon>

              Buat Rutinitas
            </button>
          </div>
        ) : (
          <DashboardSchedule
            plan={plan}
            onUpdateSchedule={
              handleUpdateSchedule
            }
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={
              handleDeleteSchedule
            }
          />
        )}
      </main>

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          if (!isGenerating) {
            setIsPlanModalOpen(false)
          }
        }}
        onGenerate={handleGenerate}
        initialData={form}
        isGenerating={isGenerating}
      />
    </div>
  )
}

export default DashboardPage