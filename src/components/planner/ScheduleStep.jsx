function ScheduleStep({ form, onChange, onToggleDay }) {
  const days = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">
          Your fixed schedule
        </h3>

        <p className="mt-1 text-sm text-muted">
          Tell us about commitments that Dailyflow should work around.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Main activity
          </label>

          <input
            type="text"
            name="mainActivity"
            value={form.mainActivity}
            onChange={onChange}
            placeholder="e.g. Software Engineer, Student, Designer"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Activity type
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["desk", "Mostly desk", "Mostly computer or desk work"],
              ["mixed", "Mixed", "Combination of desk and movement"],
              ["physical", "Physical", "Mostly active or physical"],
            ].map(([value, title, description]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-lg border p-4 transition ${
                  form.activityType === value
                    ? "border-primary bg-blue-50/60"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="activityType"
                  value={value}
                  checked={form.activityType === value}
                  onChange={onChange}
                  className="sr-only"
                />

                <span className="block text-sm font-medium text-dark">
                  {title}
                </span>

                <span className="mt-1 block text-xs leading-5 text-muted">
                  {description}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-dark">
            Work / study days
          </label>

          <div className="flex flex-wrap gap-2">
            {days.map((day) => {
              const selected = form.workDays.includes(day.value)

              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => onToggleDay(day.value)}
                  className={`h-10 min-w-12 rounded-lg border px-3 text-sm font-medium transition ${
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark">
              Start time
            </label>

            <input
              type="time"
              name="workStart"
              value={form.workStart}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark">
              End time
            </label>

            <input
              type="time"
              name="workEnd"
              value={form.workEnd}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <span className="block text-sm font-medium text-dark">
              Include commute time
            </span>

            <span className="mt-1 block text-xs text-muted">
              Reserve time before and after work or study.
            </span>
          </div>

          <input
            type="checkbox"
            name="commuteEnabled"
            checked={form.commuteEnabled}
            onChange={onChange}
            className="h-4 w-4 accent-primary"
          />
        </label>

        {form.commuteEnabled && (
          <div>
            <label className="mb-2 block text-sm font-medium text-dark">
              Commute duration
            </label>

            <div className="relative">
              <input
                type="number"
                name="commuteDuration"
                value={form.commuteDuration}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-16 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
                min
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduleStep