import MaterialIcon from "../ui/MaterialIcon"

const events = [
  {
    time: "08:00 AM",
    title: "Deep Work: Core Architecture",
    type: "work",
  },
  {
    time: "12:00 PM",
    title: "Lunch Break & Midday Prayer",
    type: "break",
  },
  {
    time: "06:00 PM",
    title: "Evening Workout / Run",
    type: "exercise",
  },
]

const eventStyles = {
  work: "border-blue-200 bg-blue-100 text-blue-900",
  break: "border-emerald-200 bg-emerald-100 text-emerald-900",
  exercise: "border-indigo-200 bg-indigo-100 text-indigo-900",
}

function CalendarSync() {
  return (
    <section
      id="calendar-sync"
      className="border-b border-slate-100 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark">
            Take your plan with you.
          </h2>

          <p className="mt-3 text-base text-muted">
            Convert your DailyFlow routine into calendar events and keep your
            schedule accessible wherever you go.
          </p>
        </div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* Controls */}
          <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Planning range:
              </span>

              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                <button className="rounded-md bg-white px-3 py-1 font-medium text-dark shadow-sm">
                  1 Day
                </button>

                <button className="rounded-md px-3 py-1 text-slate-600 hover:text-dark">
                  7 Days
                </button>

                <button className="rounded-md px-3 py-1 text-slate-600 hover:text-dark">
                  30 Days
                </button>
              </div>
            </div>

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:w-auto">
              <MaterialIcon className="text-[18px]">
                sync
              </MaterialIcon>

              Sync to Google Calendar
            </button>
          </div>

          {/* Preview */}
          <div className="mt-6 pt-2">
            <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Google Calendar Preview</span>

              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Ready to export
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {events.map((event) => (
                <div
                  key={event.time}
                  className="grid grid-cols-12 items-center gap-2 rounded border border-slate-100 bg-slate-50 p-2"
                >
                  <span className="col-span-3 font-medium text-slate-400 sm:col-span-2">
                    {event.time}
                  </span>

                  <div
                    className={`col-span-9 flex items-center justify-between rounded border px-3 py-1.5 font-sans font-medium sm:col-span-10 ${eventStyles[event.type]}`}
                  >
                    <span>{event.title}</span>

                    <span className="ml-3 hidden text-[10px] opacity-70 sm:block">
                      DailyFlow
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CalendarSync