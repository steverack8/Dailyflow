import { useState } from "react"

import EmptyDashboard from "../components/dashboard/EmptyDashboard"
import DashboardSchedule from "../components/dashboard/DashboardSchedule"
import PlanModal from "../components/planner/PlanModal"

function DashboardPage() {
  const [hasPlan, setHasPlan] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(null)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleGenerate = (generatedForm) => {
    setForm(generatedForm)
    setHasPlan(true)
    setIsModalOpen(false)

    console.log("Dailyflow form:", generatedForm)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {hasPlan ? (
          <DashboardSchedule
            form={form}
            onEdit={openModal}
          />
        ) : (
          <>
            {/* Empty dashboard heading */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-[#0b1c30]">
                Dashboard
              </h1>

              <p className="mt-1 text-sm leading-6 text-[#434655]">
                Buat rutinitas harian yang disesuaikan dengan aktivitas dan
                prioritas Anda.
              </p>
            </div>

            <EmptyDashboard onCreate={openModal} />
          </>
        )}
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onGenerate={handleGenerate}
      />
    </>
  )
}

export default DashboardPage