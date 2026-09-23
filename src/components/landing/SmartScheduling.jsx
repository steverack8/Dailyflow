function Commitment({
  title,
  description,
  variant = "fixed",
}) {
  const isFlexible = variant === "flexible"

  return (
    <div>
      <div
        className={`mb-3 flex items-center justify-between ${
          isFlexible ? "" : ""
        }`}
      >
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isFlexible ? "text-primary" : "text-slate-400"
          }`}
        >
          {title}
        </span>

        <span
          className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
            isFlexible
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          {isFlexible ? "Scheduled Dynamically" : "Non-negotiable"}
        </span>
      </div>

      <div className="space-y-2">
        {description.map((item) => (
          <div
            key={item.text}
            className={`flex items-center justify-between rounded-lg border p-2.5 text-xs ${
              isFlexible
                ? "border-blue-200 bg-blue-50/40"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <span
              className={`font-medium ${
                isFlexible ? "text-slate-900" : "text-slate-800"
              }`}
            >
              {item.text}
            </span>

            <span
              className={`font-mono ${
                isFlexible ? "text-primary" : "text-slate-500"
              }`}
            >
              {item.meta}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SmartScheduling() {
  return (
    <section
      id="scheduling"
      className="border-b border-slate-100 bg-slate-50/50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Text */}
          <div className="lg:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Intelligent Architecture
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-dark">
              Make time for what matters.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted">
              DailyFlow works around the things you cannot move and finds the
              right place for the things you want to make time for.
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary">
                  ✓
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-dark">
                    Anchored Commitments
                  </h4>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Fixed job hours, sleep times, and other important
                    commitments are locked down first.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary">
                  ✓
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-dark">
                    Dynamic Habits & Routines
                  </h4>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Flexible activities fill available time around your fixed
                    commitments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-6">
            <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <Commitment
                title="Fixed Commitments"
                description={[
                  {
                    text: "08:00 – 17:00 Work Hours",
                    meta: "Anchor",
                  },
                  {
                    text: "22:30 – 06:00 Sleep Rest",
                    meta: "Anchor",
                  },
                  {
                    text: "Important daily commitments",
                    meta: "Anchor",
                  },
                ]}
              />

              <Commitment
                title="Flexible Activities"
                variant="flexible"
                description={[
                  {
                    text: "Exercise (45 mins)",
                    meta: "Placed at 18:00",
                  },
                  {
                    text: "Learning & Reading (60 mins)",
                    meta: "Placed at 20:00",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SmartScheduling