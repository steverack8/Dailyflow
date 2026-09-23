function LifestyleStep({ form, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark">
          Your daily life
        </h3>

        <p className="mt-1 text-sm text-muted">
          Set the routines that should be considered when building your day.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Wake up
          </label>

          <input
            type="time"
            name="wakeTime"
            value={form.wakeTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Sleep
          </label>

          <input
            type="time"
            name="sleepTime"
            value={form.sleepTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Breakfast
          </label>

          <input
            type="time"
            name="breakfastTime"
            value={form.breakfastTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Lunch
          </label>

          <input
            type="time"
            name="lunchTime"
            value={form.lunchTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Dinner
          </label>

          <input
            type="time"
            name="dinnerTime"
            value={form.dinnerTime}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Exercise frequency
          </label>

          <select
            name="exerciseFrequency"
            value={form.exerciseFrequency}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="0">No exercise</option>
            <option value="1">1 day / week</option>
            <option value="2">2 days / week</option>
            <option value="3">3 days / week</option>
            <option value="4">4 days / week</option>
            <option value="5">5 days / week</option>
            <option value="6">6 days / week</option>
            <option value="7">Every day</option>
          </select>
        </div>
      </div>

      {Number(form.exerciseFrequency) > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-dark">
            Exercise duration
          </label>

          <div className="relative">
            <input
              type="number"
              name="exerciseDuration"
              value={form.exerciseDuration}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-16 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
              min
            </span>
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
        <div>
          <span className="block text-sm font-medium text-dark">
            Include prayer time
          </span>

          <span className="mt-1 block text-xs text-muted">
            Reserve space for prayer in your daily flow.
          </span>
        </div>

        <input
          type="checkbox"
          name="prayerEnabled"
          checked={form.prayerEnabled}
          onChange={onChange}
          className="h-4 w-4 accent-primary"
        />
      </label>
    </div>
  )
}

export default LifestyleStep