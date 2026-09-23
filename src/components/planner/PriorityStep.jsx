function PriorityStep({ form, onChange, onToggleGoal }) {
  const goals = [
    { value: "exercise", label: "Exercise" },
    { value: "learning", label: "Learning" },
    { value: "reading", label: "Reading" },
    { value: "personal", label: "Personal time" },
    { value: "hobby", label: "Hobbies" },
    { value: "family", label: "Family time" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">
          Your priorities
        </h3>

        <p className="mt-1 text-sm text-muted">
          Choose what you want Dailyflow to make room for.
        </p>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-dark">
          What matters to you?
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((goal) => {
            const selected = form.goals.includes(goal.value)

            return (
              <button
                key={goal.value}
                type="button"
                onClick={() => onToggleGoal(goal.value)}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                  selected
                    ? "border-primary bg-blue-50/60 font-medium text-primary"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {goal.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-dark">
          When do you prefer demanding tasks?
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["morning", "Morning"],
            ["balanced", "Balanced"],
            ["evening", "Evening"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-lg border p-4 text-center transition ${
                form.morningPreference === value
                  ? "border-primary bg-blue-50/60"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="morningPreference"
                value={value}
                checked={form.morningPreference === value}
                onChange={onChange}
                className="sr-only"
              />

              <span className="text-sm font-medium text-dark">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-dark">
          Break preference
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["long_focus", "Longer focus"],
            ["balanced", "Balanced"],
            ["frequent", "Frequent breaks"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-lg border p-4 text-center transition ${
                form.breakPreference === value
                  ? "border-primary bg-blue-50/60"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="breakPreference"
                value={value}
                checked={form.breakPreference === value}
                onChange={onChange}
                className="sr-only"
              />

              <span className="text-sm font-medium text-dark">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-dark">
          Anything else?
        </label>

        <textarea
          name="otherRoutine"
          value={form.otherRoutine}
          onChange={onChange}
          rows={4}
          placeholder="Tell us about other routines, commitments, or preferences..."
          className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
    </div>
  )
}

export default PriorityStep