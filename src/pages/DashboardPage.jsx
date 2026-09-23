import { useEffect, useState } from "react"

import PlanModal from "../components/planner/PlanModal"
import DashboardSchedule from "../components/dashboard/DashboardSchedule"
import { buildInitialPlanPrompt } from "../prompts/initialPlanPrompt"
import { generateDailyPlan } from "../services/aiService"
import {
  getLatestDailyPlan,
  saveDailyPlan,
} from "../services/firestoreService"
import { useAuth } from "../contexts/AuthContext"

function DashboardPage() {
  const { user } = useAuth()

  const [hasPlan, setHasPlan] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingPlan, setIsLoadingPlan] = useState(true)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState(null)

  const [form, setForm] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    mainActivity: "",
    activityType: "",
    workDays: [],
    workStart: "",
    workEnd: "",
    commuteEnabled: false,
    commuteDuration: "",
    sleepTime: "",
    wakeTime: "",
    breakfastTime: "",
    lunchTime: "",
    dinnerTime: "",
    exerciseFrequency: "",
    exerciseDuration: "",
    prayerEnabled: false,
    goals: [],
    morningPreference: "",
    breakPreference: "",
    otherRoutine: "",
  })

  useEffect(() => {
    const loadPlan = async () => {
      if (!user?.uid) {
        setIsLoadingPlan(false)
        return
      }

      try {
        setError("")

        const latestPlan = await getLatestDailyPlan(user.uid)

        if (latestPlan) {
          setPlan(latestPlan)
          setHasPlan(true)

          if (latestPlan.sourceData) {
            setForm(latestPlan.sourceData)
          }
        }
      } catch (err) {
        console.error("Load plan error:", err)

        setError(
          err.message || "Failed to load your daily plan."
        )
      } finally {
        setIsLoadingPlan(false)
      }
    }

    loadPlan()
  }, [user?.uid])

  const handleGenerate = async (formData) => {
    try {
      setIsGenerating(true)
      setError("")

      if (!user?.uid) {
        throw new Error("User authentication is required.")
      }

      setForm(formData)

      const prompt = buildInitialPlanPrompt(formData)

      const generatedPlan = await generateDailyPlan(prompt)

      await saveDailyPlan(
        user.uid,
        generatedPlan,
        formData
      )

      setPlan(generatedPlan)
      setHasPlan(true)
      setIsModalOpen(false)
    } catch (err) {
      console.error("Generate plan error:", err)

      setError(
        err.message || "Failed to generate and save your daily plan."
      )
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoadingPlan) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="material-symbols-outlined animate-spin text-[20px]">
            progress_activity
          </span>

          Loading your plan...
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!hasPlan ? (
          <section className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <span className="material-symbols-outlined text-[28px]">
                  calendar_month
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                Plan your day with DailyFlow
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Tell us about your routine, lifestyle, and priorities.
                DailyFlow will create a personalized daily schedule for you.
              </p>

              <button
                type="button"
                onClick={() => {
                  setError("")
                  setIsModalOpen(true)
                }}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <span className="material-symbols-outlined text-[20px]">
                  auto_awesome
                </span>

                Create My Plan
              </button>
            </div>
          </section>
        ) : (
          <DashboardSchedule
            plan={plan}
            onEdit={() => setIsModalOpen(true)}
          />
        )}
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isGenerating) {
            setIsModalOpen(false)
          }
        }}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </>
  )
}

export default DashboardPage