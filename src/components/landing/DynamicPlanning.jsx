import MaterialIcon from "../ui/MaterialIcon"

function DynamicPlanning() {
  return (
    <section className="border-b border-slate-100 bg-slate-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark">
            Plans change. Your flow can too.
          </h2>

          <p className="mt-3 text-base text-muted">
            DailyFlow is designed to adapt when your day changes, helping you
            reorganize flexible activities without disturbing important
            commitments.
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* Scenario */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MaterialIcon className="text-[18px] text-amber-500">
                warning
              </MaterialIcon>

              Trigger Scenario
            </div>

            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              User skips exercise at 18:00
            </span>
          </div>

          {/* Notification */}
          <div className="my-5 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3.5">
            <div className="flex items-center gap-2.5">
              <MaterialIcon className="text-[20px] text-primary">
                tune
              </MaterialIcon>

              <span className="text-xs font-medium text-blue-900 sm:text-sm">
                Your evening has been adjusted.
              </span>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Auto-Rebalanced
            </span>
          </div>

          {/* Updated Schedule */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Updated Remaining Schedule
            </span>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium text-slate-400">
                  18:00 – 19:00
                </span>

                <span className="font-medium text-slate-800">
                  Buffer & Rest Period
                </span>
              </div>

              <span className="text-slate-500">
                Expanded rest
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium text-slate-400">
                  19:30 – 20:30
                </span>

                <span className="font-medium text-slate-800">
                  Reading & Study
                </span>
              </div>

              <span className="text-primary">
                Shifted earlier
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-medium text-slate-400">
                  21:00 – 22:30
                </span>

                <span className="font-medium text-slate-800">
                  Personal Time
                </span>
              </div>

              <span className="text-emerald-600">
                Preserved intact
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DynamicPlanning