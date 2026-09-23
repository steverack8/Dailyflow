function TimelineItem({
  time,
  title,
  description,
  category,
  variant = "default",
}) {
  const styles = {
    default: {
      container: "bg-white border-slate-200 hover:border-slate-300",
      time: "text-slate-500",
      title: "text-slate-800",
      badge: "bg-slate-100 text-slate-600 border-slate-200",
    },

    anchor: {
      container: "bg-blue-50/60 border-blue-200 hover:border-blue-300",
      time: "text-primary",
      title: "text-slate-900",
      badge: "bg-blue-100 text-blue-800 border-blue-100",
    },

    flexible: {
      container: "bg-indigo-50/60 border-indigo-200 hover:border-indigo-300",
      time: "text-indigo-700",
      title: "text-slate-900",
      badge: "bg-indigo-100 text-indigo-800 border-indigo-100",
    },

    sleep: {
      container: "bg-slate-100 border-slate-200 hover:border-slate-300",
      time: "text-slate-600",
      title: "text-slate-800",
      badge: "bg-slate-200 text-slate-700 border-slate-200",
    },
  }

  const currentStyle = styles[variant]

  return (
    <div
      className={`flex items-center rounded-lg border p-2.5 text-sm transition-colors ${currentStyle.container}`}
    >
      <span
        className={`w-14 font-mono text-xs font-medium ${currentStyle.time}`}
      >
        {time}
      </span>

      <div
        className={`flex-1 font-medium ${currentStyle.title}`}
      >
        {title}

        {description && (
          <span className="ml-1 text-xs font-normal text-slate-500">
            ({description})
          </span>
        )}
      </div>

      <span
        className={`rounded border px-2 py-0.5 text-[11px] ${currentStyle.badge}`}
      >
        {category}
      </span>
    </div>
  )
}

function TimelineColumn({ title, children }) {
  return (
    <div className="space-y-2.5">
      <div className="pl-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </div>

      {children}
    </div>
  )
}

function Hero() {
  return (
    <section className="overflow-hidden border-b border-slate-100 bg-white pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Intelligent cadence & time planning
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-dark sm:text-5xl md:text-6xl">
          Make your day flow better.
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg font-normal leading-relaxed text-muted sm:text-xl">
          DailyFlow turns your routines, commitments, and priorities into a
          realistic daily plan that fits your life.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <a
            href="#get-started"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            Build my daily flow
          </a>
        </div>

        {/* Timeline Preview */}
        <div className="mx-auto mt-14 max-w-4xl text-left">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />

                <span className="ml-2 text-xs font-medium text-slate-500">
                  Today's Flow — Wednesday, October 22
                </span>
              </div>

              <div className="hidden items-center gap-3 text-xs text-slate-500 sm:flex">
                <span className="inline-flex items-center gap-1.5 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Balanced (16h Active)
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-50/40 p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TimelineColumn title="Morning & Work">
                  <TimelineItem
                    time="06:00"
                    title="Wake up"
                    category="Sleep"
                  />

                  <TimelineItem
                    time="06:30"
                    title="Morning routine"
                    category="Personal"
                  />

                  <TimelineItem
                    time="07:00"
                    title="Breakfast"
                    category="Meals"
                  />

                  <TimelineItem
                    time="08:00"
                    title="Work"
                    description="Fixed Deep Work"
                    category="Anchor"
                    variant="anchor"
                  />

                  <TimelineItem
                    time="12:00"
                    title="Lunch & Prayer"
                    category="Midday"
                  />

                  <TimelineItem
                    time="13:00"
                    title="Work"
                    description="Collaborative Tasks"
                    category="Anchor"
                    variant="anchor"
                  />
                </TimelineColumn>

                <TimelineColumn title="Evening & Wind Down">
                  <TimelineItem
                    time="17:00"
                    title="Finish work"
                    category="Transition"
                  />

                  <TimelineItem
                    time="18:00"
                    title="Exercise"
                    description="Flexible Habit"
                    category="Flexible"
                    variant="flexible"
                  />

                  <TimelineItem
                    time="19:00"
                    title="Dinner & Prayer"
                    category="Meals"
                  />

                  <TimelineItem
                    time="20:00"
                    title="Learning"
                    description="Personal Growth"
                    category="Study"
                  />

                  <TimelineItem
                    time="21:00"
                    title="Free time"
                    description="Wind down"
                    category="Personal"
                  />

                  <TimelineItem
                    time="22:30"
                    title="Sleep"
                    description="Optimal Rest"
                    category="Anchor"
                    variant="sleep"
                  />
                </TimelineColumn>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-2.5 text-xs text-slate-500">
              <span>Synchronized across daily habits</span>

              <span className="flex items-center gap-1 font-medium text-primary">
                <span className="material-symbols-outlined text-[16px]">
                  sync
                </span>
                Auto-synced
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero