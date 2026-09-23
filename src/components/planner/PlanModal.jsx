import { useState } from "react"
import MaterialIcon from "../ui/MaterialIcon"
import ProfileStep from "./ProfileStep"
import ScheduleStep from "./ScheduleStep"
import LifestyleStep from "./LifestyleStep"
import PriorityStep from "./PriorityStep"

const initialForm = {
  age: "",
  gender: "",
  height: "",
  weight: "",

  mainActivity: "",
  activityType: "",
  workDays: [],
  workStart: "08:00",
  workEnd: "17:00",
  commuteEnabled: false,
  commuteDuration: "30",

  sleepTime: "22:30",
  wakeTime: "06:00",
  breakfastTime: "07:00",
  lunchTime: "12:00",
  dinnerTime: "19:00",
  exerciseFrequency: "3",
  exerciseDuration: "45",
  prayerEnabled: true,

  goals: [],
  morningPreference: "balanced",
  breakPreference: "balanced",
  otherRoutine: "",
}

const steps = [
  {
    number: "01",
    title: "About You",
  },
  {
    number: "02",
    title: "Fixed Schedule",
  },
  {
    number: "03",
    title: "Daily Life",
  },
  {
    number: "04",
    title: "Priorities",
  },
]

function PlanModal({ isOpen, onClose, onGenerate }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState(initialForm)

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      workDays: current.workDays.includes(day)
        ? current.workDays.filter((item) => item !== day)
        : [...current.workDays, day],
    }))
  }

  const toggleGoal = (goal) => {
    setForm((current) => ({
      ...current,
      goals: current.goals.includes(goal)
        ? current.goals.filter((item) => item !== goal)
        : [...current.goals, goal],
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((current) => current + 1)
      return
    }

    onGenerate(form)
    onClose()
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileStep
            form={form}
            onChange={handleChange}
          />
        )

      case 1:
        return (
          <ScheduleStep
            form={form}
            onChange={handleChange}
            onToggleDay={toggleDay}
          />
        )

      case 2:
        return (
          <LifestyleStep
            form={form}
            onChange={handleChange}
          />
        )

      case 3:
        return (
          <PriorityStep
            form={form}
            onChange={handleChange}
            onToggleGoal={toggleGoal}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Build your flow
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-dark">
              Create My Daily Flow
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-dark"
            aria-label="Close"
          >
            <MaterialIcon>close</MaterialIcon>
          </button>
        </div>

        {/* Steps */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, index) => {
              const active = index === currentStep
              const completed = index < currentStep

              return (
                <div key={step.number} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      active || completed
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {completed ? "✓" : step.number}
                  </div>

                  <span
                    className={`hidden text-xs font-medium sm:block ${
                      active ? "text-dark" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-7">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MaterialIcon className="text-[19px]">
              arrow_back
            </MaterialIcon>

            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            {currentStep === steps.length - 1
              ? "Generate My Flow"
              : "Continue"}

            <MaterialIcon className="text-[19px]">
              arrow_forward
            </MaterialIcon>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanModal