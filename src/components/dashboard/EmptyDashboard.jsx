import MaterialIcon from "../ui/MaterialIcon"

function EmptyDashboard({ onCreate }) {
  return (
    <div className="flex min-h-[calc(100vh-260px)] items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-primary">
          <MaterialIcon className="text-[28px]">
            calendar_month
          </MaterialIcon>
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
          Create your daily flow
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Your dashboard is ready. Tell Dailyflow about your schedule,
          routines, and priorities to create your first daily plan.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <MaterialIcon className="text-[19px]">
            add_task
          </MaterialIcon>

          Create My Daily Flow
        </button>

        <p className="mt-4 text-[11px] text-slate-400">
          Takes only a few minutes to set up.
        </p>
      </div>
    </div>
  )
}

export default EmptyDashboard