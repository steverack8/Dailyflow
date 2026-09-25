function PriorityStep({ form, onChange, onToggleGoal }) {
  const goals = [
    { value: "exercise", label: "Olahraga" },
    { value: "learning", label: "Belajar" },
    { value: "reading", label: "Membaca" },
    { value: "personal", label: "Waktu pribadi" },
    { value: "hobby", label: "Hobi" },
    { value: "family", label: "Waktu keluarga" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">
          Prioritasmu
        </h3>

        <p className="mt-1 text-sm text-muted">
          Pilih hal yang ingin Dailyflow sediakan waktunya.
        </p>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-dark">
          Apa yang penting bagimu?
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
          Kapan kamu lebih suka mengerjakan tugas berat?
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["morning", "Pagi"],
            ["balanced", "Seimbang"],
            ["evening", "Malam"],
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
          Preferensi jeda
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["long_focus", "Fokus lebih lama"],
            ["balanced", "Seimbang"],
            ["frequent", "Jeda sering"],
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
          Ada lagi?
        </label>

        <textarea
          name="otherRoutine"
          value={form.otherRoutine}
          onChange={onChange}
          rows={4}
          placeholder="Ceritakan rutinitas, komitmen, atau preferensi lainnya..."
          className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
    </div>
  )
}

export default PriorityStep